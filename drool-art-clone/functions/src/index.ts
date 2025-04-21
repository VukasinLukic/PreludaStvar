/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// Import necessary types directly from firebase-functions for v1 compatibility
import * as logger from "firebase-functions/logger"; // This might still fail if logger is v2 only
import * as admin from "firebase-admin";
// Import the shared Product types (adjust path as needed relative to compiled output in 'lib')
import { Product, ProductData } from "../../src/types/product";
import { onRequest, HttpsOptions } from "firebase-functions/v2/https";

// Initialize Firebase Admin
// Check if already initialized to prevent errors during hot-reloads
if (!admin.apps.length) {
  admin.initializeApp();
}

// Configuration for the HTTPS function using v2 HttpsOptions
const httpsOptions: HttpsOptions = {
  region: "europe-west1",
  maxInstances: 10,
};

// Get all products from Firestore using v2 onRequest
export const getProducts = onRequest(httpsOptions, async (request, response) => { // Removed explicit types
  // Enable CORS - Crucial for requests from your frontend domain
  response.set("Access-Control-Allow-Origin", "*"); // Use specific domain in production
  response.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.set("Access-Control-Allow-Headers", "Content-Type");

  // Handle OPTIONS preflight requests for CORS
  if (request.method === "OPTIONS") {
    response.status(204).send("");
    return;
  }

  try {
    logger.info("Fetching products from Firestore", {structuredData: true});
    
    const productsRef = admin.firestore().collection("products");
    // Optional: Filter by 'isActive' if you add that field
    // const snapshot = await productsRef.where('isActive', '==', true).get();
    const snapshot = await productsRef.get();
    
    if (snapshot.empty) {
      logger.info("No products found in Firestore");
      response.status(200).json([]);
      return;
    }
    
    const products: Product[] = [];
    
    snapshot.forEach(doc => {
      // Cast to ProductData first, then add the id
      const data = doc.data() as ProductData;
      products.push({
        id: doc.id,
        ...data,
      });
    });
    
    logger.info(`Found ${products.length} products`);
    response.status(200).json(products);
  } catch (error) {
    logger.error("Error fetching products", error);
    response.status(500).json({
      error: "Failed to fetch products",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get a single product by slug using v2 onRequest
export const getProductBySlug = onRequest(httpsOptions, async (request, response) => { // Removed explicit types
   // Enable CORS - Crucial for requests from your frontend domain
   response.set("Access-Control-Allow-Origin", "*"); // Use specific domain in production
   response.set("Access-Control-Allow-Methods", "GET, OPTIONS");
   response.set("Access-Control-Allow-Headers", "Content-Type");

   // Handle OPTIONS preflight requests for CORS
   if (request.method === "OPTIONS") {
     response.status(204).send("");
     return;
   }

  try {
    const slug = request.query.slug as string;

    if (!slug) {
      response.status(400).json({error: "Slug parameter is required"});
      return;
    }

    logger.info(`Fetching product with slug: ${slug}`, {structuredData: true});

    const productsRef = admin.firestore().collection("products");
    // Optional: Add .where('isActive', '==', true) if needed
    const snapshot = await productsRef.where("slug", "==", slug).limit(1).get();

    if (snapshot.empty) {
      logger.info(`No product found with slug: ${slug}`);
      response.status(404).json({error: "Product not found"});
      return;
    }

    const doc = snapshot.docs[0];
    const productData = doc.data() as ProductData; // Cast to shared type
    const product: Product = {
      id: doc.id,
      ...productData,
    };

    // Use optional chaining for safety, though name should exist
    logger.info(`Found product: ${product.name?.en || product.name?.sr || product.id}`);
    response.status(200).json(product);
  } catch (error) {
    logger.error("Error fetching product by slug", error);
    response.status(500).json({
      error: "Failed to fetch product",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});
