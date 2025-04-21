import admin from 'firebase-admin';
import { readFile } from 'fs/promises'; // Use fs/promises for async operations
import path from 'path';
import { fileURLToPath } from 'url';
import { PRODUCTS } from '../src/data/products.js'; // Assuming products.ts compiles to .js or you adjust import

// --- Configuration ---
// ES Modules require __dirname and __filename to be derived
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountKeyPath = path.resolve(__dirname, '../serviceAccountKey.json'); // Assumes key is in project root
const collectionName = 'products';

// --- Firebase Initialization ---
let db;
try {
  const serviceAccountJson = await readFile(serviceAccountKeyPath, 'utf8');
  const serviceAccount = JSON.parse(serviceAccountJson);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  db = admin.firestore();
  console.log('Firebase Admin SDK initialized successfully.');
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:');
  console.error('1. Make sure serviceAccountKey.json exists in the project root.');
  console.error('2. Ensure the file is valid JSON.');
  console.error('3. Download it from Firebase Console > Project Settings > Service accounts.');
  console.error('Details:', error);
  process.exit(1);
}

const productsCollection = db.collection(collectionName);

// --- Localization Data Loading ---
const loadTranslations = async (lang) => {
  try {
    const filePath = path.resolve(__dirname, `../public/locales/${lang}/common.json`);
    const fileContent = await readFile(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error loading translations for language: ${lang}`, error);
    return {};
  }
};

const translationsEN = await loadTranslations('en');
const translationsSR = await loadTranslations('sr');

// --- Migration Logic ---
async function migrateProducts() {
  console.log(`Starting migration of ${PRODUCTS.length} products to Firestore collection '${collectionName}'...`);

  let batch = db.batch(); // Initialize batch
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

    if (operationsCount >= 499) {
      console.log(`Committing batch of ${operationsCount} operations...`);
      await batch.commit();
      batch = db.batch(); // Create a new batch instance
      operationsCount = 0;
      console.log('Batch limit reached, committed and started new batch.');
    }
  }

  if (operationsCount > 0) {
    console.log(`Committing final batch of ${operationsCount} operations...`);
    await batch.commit();
  }

  console.log(`Successfully migrated ${PRODUCTS.length} products.`);
}

// --- Execution ---
try {
  await migrateProducts();
  console.log('Migration completed successfully.');
  process.exit(0);
} catch (error) {
  console.error('Migration failed:', error);
  process.exit(1);
} 