import admin from 'firebase-admin';
import { readFile, readdir } from 'fs/promises';
import path from 'path';
import { supabase } from '../src/lib/supabaseClient'; // Import initialized Supabase client
import { PRODUCTS } from '../src/data/products';
import mime from 'mime-types'; // To determine content type
import dotenv from 'dotenv';

// Load .env.local for script environment
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// --- Configuration ---
const serviceAccountKeyPath = path.resolve(__dirname, '../serviceAccountKey.json');
const firestoreCollectionName = 'products';
const localImagesDir = path.resolve(__dirname, '../local_assets/products'); // Your local staging folder
const supabaseBucketName = 'product-images'; // The public bucket you created in Supabase

// --- Initialize Firebase Admin ---
async function initializeFirebase() {
  if (admin.apps.length === 0) { // Prevent re-initialization
    try {
      const serviceAccountJson = await readFile(serviceAccountKeyPath, 'utf8');
      const serviceAccount = JSON.parse(serviceAccountJson);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('Firebase Admin SDK initialized successfully.');
    } catch (error) {
      console.error('Error initializing Firebase Admin SDK:', error);
      process.exit(1);
    }
  } else {
    console.log('Firebase Admin SDK already initialized.');
  }
}

// --- Main Upload Logic ---
async function uploadImages() {
  await initializeFirebase();
  const db = admin.firestore();
  const productsCollection = db.collection(firestoreCollectionName);

  console.log(`Reading images from: ${localImagesDir}`);
  console.log(`Uploading to Supabase bucket: ${supabaseBucketName}`);

  let uploadedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  try {
    const files = await readdir(localImagesDir);
    console.log(`Found ${files.length} files in local directory.`);

    for (const localFilename of files) {
      const filePath = path.join(localImagesDir, localFilename);
      const localBaseNameLower = path.parse(localFilename).name.toLowerCase();

      const productData = PRODUCTS.find(p => p.exactSlug.toLowerCase() === localBaseNameLower);

      if (!productData) {
        console.warn(`Skipping ${localFilename}: No product found with exactSlug matching '${localBaseNameLower}'.`);
        skippedCount++;
        continue;
      }

      const firestoreSlug = productData.slug;
      const supabaseFilename = `${productData.exactSlug}${path.extname(localFilename)}`;

      console.log(`Processing ${localFilename} (matches product slug: ${firestoreSlug}, uploading as: ${supabaseFilename})...`);

      try {
        // 1. Read file buffer
        const fileBuffer = await readFile(filePath);

        // 2. Determine content type
        const contentType = mime.lookup(localFilename) || 'application/octet-stream';

        // 3. Upload to Supabase Storage using the exactSlug-based name
        const supabasePath = `public/${supabaseFilename}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(supabaseBucketName)
          .upload(supabasePath, fileBuffer, {
            contentType,
            upsert: true, // Overwrite if exists
          });

        if (uploadError) {
          throw new Error(`Supabase upload error: ${uploadError.message}`);
        }

        if (!uploadData) {
            throw new Error('Supabase upload did not return data.');
        }

        // 4. Get public URL
        const { data: urlData } = supabase.storage
          .from(supabaseBucketName)
          .getPublicUrl(supabasePath);

        if (!urlData || !urlData.publicUrl) {
            throw new Error('Could not get public URL from Supabase.');
        }
        const publicUrl = urlData.publicUrl;
        console.log(`  Uploaded to Supabase: ${publicUrl}`);

        // 5. Update Firestore document
        const productRef = productsCollection.doc(firestoreSlug);
        await productRef.update({
          imageURL: publicUrl,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log(`  Updated Firestore document '${firestoreSlug}' with imageURL.`);
        uploadedCount++;

      } catch (uploadUpdateError: any) {
        console.error(`  Error processing ${localFilename}:`, uploadUpdateError.message);
        errorCount++;
      }
    }

  } catch (readDirError: any) {
    console.error(`Error reading local image directory (${localImagesDir}):`, readDirError);
    console.error('Please ensure the directory exists and contains your prepared images.');
    process.exit(1);
  }

  console.log('\n--- Upload Summary ---');
  console.log(`Successfully uploaded and updated: ${uploadedCount}`);
  console.log(`Skipped (no matching product): ${skippedCount}`);
  console.log(`Errors: ${errorCount}`);
}

// --- Execution ---
uploadImages()
  .then(() => {
    console.log('\nImage upload process finished.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nUnhandled error during upload process:', error);
    process.exit(1);
  }); 