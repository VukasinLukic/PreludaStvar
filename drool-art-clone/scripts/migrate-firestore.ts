import admin from 'firebase-admin';
import { readFile } from 'fs/promises'; // Use async readFile
import path from 'path';
import { PRODUCTS } from '../src/data/products'; // Adjust path as needed

// --- Configuration ---
// Path to your service account key JSON file
const serviceAccountKeyPath = path.resolve(__dirname, '../serviceAccountKey.json'); // Assumes key is in project root
const collectionName = 'products';

// --- Firebase Initialization ---
async function initializeFirebase() { // Wrap in async function
  try {
    const serviceAccountJson = await readFile(serviceAccountKeyPath, 'utf8'); // Use async readFile
    const serviceAccount = JSON.parse(serviceAccountJson);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:');
    console.error('1. Make sure serviceAccountKey.json exists in the project root.');
    console.error('2. Ensure the file is valid JSON.');
    console.error('3. Download it from Firebase Console > Project Settings > Service accounts.');
    console.error('Details:', error);
    process.exit(1); // Exit if Firebase can't initialize
  }
}

// --- Localization Data Loading (Corrected & Async) ---

// Helper function to flatten nested JSON objects
const flattenObject = (obj: any, prefix = '', res: Record<string, string> = {}): Record<string, string> => {
  for (const key in obj) {
    const newKey = prefix ? prefix + '.' + key : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      flattenObject(obj[key], newKey, res);
    } else {
      res[newKey] = obj[key];
    }
  }
  return res;
};

// Corrected loadTranslations function
const loadTranslations = async (lang: string): Promise<Record<string, string>> => {
  try {
    const filePath = path.resolve(__dirname, `../src/locales/${lang}.json`);
    const fileContent = await readFile(filePath, 'utf8'); // Use async readFile
    const jsonData = JSON.parse(fileContent);
    return flattenObject(jsonData); // Flatten the loaded JSON
  } catch (error) {
    console.error(`Error loading or flattening translations for language: ${lang}`, error);
    return {}; // Return empty object on error
  }
};

// --- Migration Logic --- (Updated to accept db and collection)
async function migrateProducts(
  db: admin.firestore.Firestore, // Add db parameter
  productsCollection: admin.firestore.CollectionReference, // Add collection parameter
  translationsEN: Record<string, string>,
  translationsSR: Record<string, string>
) {
  console.log(`Starting migration of ${PRODUCTS.length} products to Firestore collection '${collectionName}'...`);

  let batch = db.batch(); // Initialize batch correctly
  let operationsCount = 0;

  for (const product of PRODUCTS) {
    const docId = product.slug;
    const productRef = productsCollection.doc(docId);

    // Get the base price from the first size option (e.g., A4)
    const basePrice = product.sizes.find(s => s.id === 'a4')?.price || 900;

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
      alt: `Poster art inspired by ${product.nameKey}`,
      techniques: [],
      year: null,
      price: basePrice,
      imageURL: '',
      etsyLink: '',
      sizes: product.sizes,
      finishes: product.finishes,
      tags: product.tags || [],
      isFeatured: product.featured || false,
      isNew: product.new || false,
      isTrending: product.trending || false,
      isActive: true,
      isOnSale: false,
      saleMultiplier: 1,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    batch.set(productRef, firestoreData);
    operationsCount++;

    // Firestore batches have a limit of 500 operations
    if (operationsCount >= 499) {
      console.log(`Committing batch of ${operationsCount} operations...`);
      await batch.commit();
      batch = db.batch(); // Create a new batch instance
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

// --- Execution --- (Updated to handle async initialization and loading)
async function main() {
  await initializeFirebase();

  // Initialize db and collection *after* Firebase is initialized
  const db = admin.firestore();
  const productsCollection = db.collection(collectionName);

  const translationsEN = await loadTranslations('en');
  const translationsSR = await loadTranslations('sr');

  // Check if translations loaded successfully before migrating
  if (Object.keys(translationsEN).length === 0 || Object.keys(translationsSR).length === 0) {
    console.error('Failed to load translations. Aborting migration.');
    process.exit(1);
  }

  try {
    // Pass db and productsCollection to migrateProducts
    await migrateProducts(db, productsCollection, translationsEN, translationsSR);
    console.log('Migration completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

main(); // Run the main async function 