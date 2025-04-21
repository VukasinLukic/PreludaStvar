const admin = require('firebase-admin');
const fs = require('fs').promises; // Use promise-based fs
const path = require('path');
const { pathToFileURL } = require('url'); // Import pathToFileURL

// --- Configuration ---
const serviceAccountKeyPath = path.resolve(__dirname, '../serviceAccountKey.json'); // Assumes key is in project root
const collectionName = 'products';

// --- Firebase Initialization (async IIFE needed for top-level await) ---
let db;
let productsCollection;
let PRODUCTS = []; // To store loaded products
let translationsEN = {};
let translationsSR = {};

async function initialize() {
  try {
    const serviceAccountJson = await fs.readFile(serviceAccountKeyPath, 'utf8');
    const serviceAccount = JSON.parse(serviceAccountJson);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    db = admin.firestore();
    productsCollection = db.collection(collectionName);
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:');
    console.error('1. Make sure serviceAccountKey.json exists in the project root.');
    console.error('2. Ensure the file is valid JSON.');
    console.error('3. Download it from Firebase Console > Project Settings > Service accounts.');
    console.error('Details:', error);
    process.exit(1);
  }

  // Load products using dynamic import
  try {
    // Construct the absolute path first
    const productsPath = path.resolve(__dirname, '../src/data/products.ts'); // Keep .ts
    // Convert the absolute path to a file URL
    const productsFileURL = pathToFileURL(productsPath).href;
    // Use the file URL in the dynamic import
    const productsModule = await import(productsFileURL);
    PRODUCTS = productsModule.PRODUCTS;
    if (!PRODUCTS) {
        throw new Error('Failed to load PRODUCTS export from products.ts');
    }
    console.log(`Loaded ${PRODUCTS.length} products from ../src/data/products.ts`);
  } catch (error) {
    console.error('Error dynamically importing products.ts:', error);
    console.error('Ensure Node.js version supports dynamic import and can handle .ts (might need ts-node/register or similar).');
    process.exit(1);
  }

  // Load translations
  translationsEN = await loadTranslations('en');
  translationsSR = await loadTranslations('sr');
}

// --- Localization Data Loading ---
const loadTranslations = async (lang) => {
  try {
    const filePath = path.resolve(__dirname, `../public/locales/${lang}/common.json`);
    const fileContent = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error loading translations for language: ${lang}`, error);
    return {}; // Return empty object on error
  }
};

// --- Migration Logic ---
async function migrateProducts() {
  if (!db || !productsCollection || PRODUCTS.length === 0) {
    console.error('Initialization incomplete. Cannot migrate.');
    return;
  }

  console.log(`Starting migration of ${PRODUCTS.length} products to Firestore collection '${collectionName}'...`);

  let batch = db.batch();
  let operationsCount = 0;

  for (const product of PRODUCTS) {
    const docId = product.slug;
    const productRef = productsCollection.doc(docId);

    const firestoreData = {
      id: product.id,
      slug: product.slug,
      name: {
        en: translationsEN[product.nameKey] || `Missing: ${product.nameKey}`,
        sr: translationsSR[product.nameKey] || `Missing: ${product.nameKey}`,
      },
      artist: {
        en: translationsEN[product.artistKey] || `Missing: ${product.artistKey}`,
        sr: translationsSR[product.artistKey] || `Missing: ${product.artistKey}`,
      },
      description: {
        en: translationsEN[product.descriptionKey] || `Missing: ${product.descriptionKey}`,
        sr: translationsSR[product.descriptionKey] || `Missing: ${product.descriptionKey}`,
      },
      category: product.category,
      alt: product.alt,
      techniques: product.techniques || [],
      year: product.year || null,
      dimensions: {
        width: product.dimensions.width || null,
        height: product.dimensions.height || null,
      },
      price: product.price,
      imageURL: '',
      etsyLink: product.etsyLink || '',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    batch.set(productRef, firestoreData);
    operationsCount++;

    // Commit batch if it reaches Firestore limit (500 operations)
    if (operationsCount >= 499) {
        console.log(`Committing batch of ${operationsCount} operations...`);
        await batch.commit();
        batch = db.batch(); // Start a new batch
        operationsCount = 0;
        console.log('Batch limit reached, committed and started new batch.');
    }
  }

  // Commit any remaining operations in the last batch
  if (operationsCount > 0) {
    console.log(`Committing final batch of ${operationsCount} operations...`);
    await batch.commit();
  }

  console.log(`Successfully migrated ${PRODUCTS.length} products.`);
}

// --- Execution ---
(async () => {
  await initialize(); // Wait for async initialization
  try {
    await migrateProducts();
    console.log('Migration completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
})(); 