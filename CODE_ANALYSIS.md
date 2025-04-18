# PreludaStvar Codebase Analysis & Refactoring Plan

## 1. Analysis Summary

The PreludaStvar codebase is a Next.js application built with TypeScript, Tailwind CSS, and Shadcn UI. It functions as an e-commerce store for posters inspired by song lyrics. Key features include product browsing, product detail pages, a shopping cart, multi-language support (Serbian/English), and static content pages (About Us, FAQ, Privacy Policy, Terms).

While the application has a functional structure, the analysis reveals several areas needing improvement, primarily related to:

*   **Project Structure & File Organization:** Duplicated asset folders and inconsistent product routing structure.
*   **Code Duplication:** Repetitive component definitions and data structures across different files.
*   **Data Management:** Significant hardcoding of product data, routes, and potentially configuration values.
*   **Asset Management:** Presence of large, unoptimized images and non-web-standard file formats.
*   **Potential Issues & Best Practices:** Redundant routing logic, complex tracker implementation, leftover example code, and opportunities for component consolidation.

Addressing these points will lead to a more maintainable, scalable, performant, and professional codebase.

## 2. Identified Issues

### 2.1. Folder Structure & File Organization

*   **Duplicate Asset Folders:**
    *   `product photos/`, `public/product photos/`, and `public/product-photos/` contain identical (or near-identical) image sets. Only one location, typically within `public/`, should be used. The common convention and likely intended folder is `public/product-photos/`.
    *   `ads/` and `logos/` folders are duplicated at the root level and within `public/`. Assets used directly by the web application should reside within `public/`.
*   **Inconsistent Product Routing:**
    *   The `src/app/products/` directory contains both a dynamic route `[slug]/` and static directories for individual products (e.g., `apsolutnotvoj/`, `bangbang/`, `casino/`, etc.). This is redundant; the dynamic `[slug]/page.tsx` should handle all product pages. The static pages mostly just re-render the `ProductClient` component with a hardcoded slug.
    *   The `laju-kuje/page.tsx` file exists solely to redirect to `lajukuje`, indicating inconsistent slug handling that was patched rather than fixed at the source.
*   **Misplaced/Unnecessary Files:**
    *   `ProductClient.tsx` exists at the root level and appears empty or unrelated to the component in `src/app/products/[slug]/ProductClient.tsx`.
    *   An empty file named `-i` exists at the root, likely an artifact.
    *   The `output/` directory contains build artifacts and should likely be added to `.gitignore`, not tracked in version control.
*   **Redundant Scripts:**
    *   `run-dev.ps1` and `start-dev.bat` perform the same function (starting the dev server).
    *   `copy-images.ps1` exists to handle renaming and moving images due to inconsistent folder/file naming, which should be resolved by proper organization.

### 2.2. Code Duplication

*   **`ProductCard` Component:** Defined separately with slight variations in:
    *   `src/app/page.tsx` (Homepage)
    *   `src/app/posteri/page.tsx` (All Posters page)
    *   Similar inline rendering logic exists in `src/app/collections/prints/page.tsx`.
*   **Product Data:** Product information (names, slugs, images, prices, details) is hardcoded and duplicated/partially duplicated in:
    *   `src/app/products/[slug]/ProductClient.tsx` (most comprehensive list, including sizes/finishes)
    *   `src/app/posteri/page.tsx` (list of image names)
    *   `src/app/page.tsx` (sample lists for bestsellers, trending, latest)
    *   `src/lib/productRoutes.ts` (slug-to-filename mappings)
    *   `src/lib/useProductRouter.ts` (slug-to-filename mappings)
*   **Helper Functions:**
    *   `formatName` function is defined in both `src/app/posteri/page.tsx` and `src/app/products/[slug]/ProductClient.tsx`.
*   **Routing Logic:** Product slug normalization and mapping logic exists in both `src/lib/productRoutes.ts` and `src/lib/useProductRouter.ts`.

### 2.3. Hardcoding

*   **Product Data:** As mentioned above, all product details are hardcoded directly into source files instead of being managed centrally (e.g., JSON file, database, CMS).
*   **Image Paths:** While dynamically generated in some places, the base paths and filenames rely on hardcoded lists and conventions.
*   **Configuration/URLs:**
    *   `https://preludastvar.rs` is hardcoded in `src/app/api/proxy/route.ts`.
    *   TikTok/Instagram URLs are hardcoded in various components (`Footer.tsx`, `page.tsx`, etc.).
*   **Static Page Content:** Content for pages like "O nama", "Politika privatnosti", "Uslovi korišćenja" is hardcoded within the JSX, making updates cumbersome.
*   **FAQ Data:** Questions and answers are hardcoded in `src/app/cesta-pitanja/page.tsx` and `src/app/page.tsx`. While using translation keys is good, the structure itself is defined in the component.

### 2.4. Asset Management

*   **Large Image Files:** Many PNG images in the product photo folders are excessively large (6MB - 15MB), which will significantly impact page load times.
*   **Non-Web Format:** `brut.tif` (64MB) is included. TIFF is unsuitable for web use due to size and lack of browser support.
*   **Optimization:** Images lack optimization (compression, resizing, modern formats like WebP/AVIF).

### 2.5. Potential Issues & Best Practices

*   **`tracker.ts` Complexity:** The manual interception and proxying of `fetch` and `XMLHttpRequest` for `tackker.com` is complex, potentially fragile, and might indicate underlying CORS issues with the third-party service that could perhaps be resolved differently (e.g., server-side tracking).
*   **`useProductRouter.ts` Redundancy:** This hook seems to duplicate routing logic already present or better handled by Next.js routing and the `productRoutes.ts` helpers. Its necessity is questionable.
*   **Leftover Example Code:** `src/app/collections/prints/page.tsx` contains sample product data and UI elements unrelated to the actual store products (using `ext.same-assets.com` images), suggesting it's leftover template code.
*   **Context Implementation Detail:** The `useEffect` in `politika-privatnosti/page.tsx` to dynamically load list translations from the JSON file is functional but slightly complex; helper functions in the context itself might simplify this.
*   **Client vs. Server Components:** Heavy reliance on `\'use client\'` for pages that primarily display content might be suboptimal. Some pages could potentially be Server Components fetching data server-side for better performance.
*   **Documentation (`README.md`):** The current `README.md` is the generic `create-next-app` template and doesn't describe the actual project.
*   **Error Handling:** While some error handling exists (e.g., proxy route), it could be reviewed for consistency and robustness across the application.

## 3. Action Plan

This plan prioritizes structural changes and major refactoring first.

**Phase 1: Foundational Cleanup & Structure**

1.  **Consolidate Asset Folders:**
    *   Choose a single location for images, e.g., `public/assets/images/products/`, `public/assets/images/ads/`, `public/assets/images/logos/`.
    *   Move all relevant images (`*.png`, `*.jpg`, etc.) to the chosen locations. **Ensure filenames do not contain spaces.**
    *   Update all `Image` components and other references (`productRoutes.ts`, component data) to point to the new paths.
    *   Delete the duplicate folders (`product photos/`, `public/product photos/`, root `ads/`, root `logos/`).
2.  **Optimize Images:**
    *   Convert `brut.tif` to a web-friendly format (e.g., optimized PNG or WebP).
    *   Optimize all product/ad/logo images (resize, compress, consider WebP/AVIF formats). Aim for significantly smaller file sizes.
3.  **Clean Up Root Directory:**
    *   Delete the root `ProductClient.tsx` file.
    *   Delete the root `-i` file.
4.  **Update `.gitignore`:**
    *   Add the `output/` directory to `.gitignore`.
5.  **Refactor Product Routing:**
    *   Delete all static product pages within `src/app/products/` (e.g., `apsolutnotvoj/page.tsx`, `bangbang/page.tsx`, etc.), *except* for the dynamic `[slug]` directory.
    *   Ensure `src/app/products/[slug]/page.tsx` correctly fetches and displays data for *all* products based on the slug parameter.
    *   Remove the redirect page `src/app/products/laju-kuje/page.tsx`. Update any links pointing to `/laju-kuje` to use `/lajukuje`.

**Phase 2: Data & Component Refactoring**

6.  **Centralize Product Data:**
    *   Create a single source of truth for product data (e.g., a `src/data/products.json` file or `src/data/products.ts` exporting an array/object). This should include ID/slug, name, artist (if needed), price tiers (A4/A3, framed/unframed), image filename (without extension), description (if applicable), etc.
    *   Remove hardcoded product data arrays/objects from `ProductClient.tsx`, `posteri/page.tsx`, `page.tsx`.
7.  **Refactor `productRoutes.ts`:**
    *   Modify functions (`getProductSlug`, `getProductImageFilename`, `getProductImageUrl`, `getProductUrl`) to use the centralized product data source instead of hardcoded `PRODUCT_MAPPINGS`.
    *   Decide if `ALIAS_MAPPINGS` are still necessary or if slugs should be strictly enforced.
8.  **Consolidate `useProductRouter.ts`:**
    *   Review the purpose of this hook. If its logic is covered by `productRoutes.ts` and Next.js routing, remove the hook and its usage.
9.  **Create Reusable `ProductCard`:**
    *   Create a single `ProductCard` component (e.g., `src/components/products/ProductCard.tsx`).
    *   Refactor `src/app/page.tsx`, `src/app/posteri/page.tsx`, and the recommendations section in `src/app/products/[slug]/ProductClient.tsx` to use this shared component, passing product data as props.
10. **Refactor `formatName`:**
    *   Move the `formatName` helper function to a utility file (e.g., `src/lib/utils.ts`) and import it where needed.
11. **Refactor `collections/prints` Page:**
    *   Remove the leftover sample product data and non-functional UI elements.
    *   If this page is intended to display actual products, integrate it with the centralized product data and the reusable `ProductCard` component. Define its purpose clearly (e.g., show all products, a specific category?).

**Phase 3: Best Practices & Final Polish**

12. **Address Hardcoding:**
    *   Replace hardcoded URLs (`preludastvar.rs`, social media links) with environment variables or constants defined in a central configuration file.
    *   Consider moving static page content (About, Privacy, Terms, FAQ) into markdown files or a headless CMS for easier updates, or ensure all text is consistently managed via the localization files (`en.json`, `sr.json`).
13. **Review `tracker.ts`:**
    *   Investigate the necessity and robustness of the tracker proxy. Explore if the CORS issue with `tackker.com` can be resolved server-side or via configuration. If the proxy is essential, ensure its error handling is solid.
14. **Clean Up Scripts:**
    *   Remove redundant development scripts (`run-dev.ps1`, `start-dev.bat`).
    *   Remove `copy-images.ps1` if image organization is fixed.
15. **Update `README.md`:**
    *   Replace the generic content with project-specific details: setup instructions, tech stack, features, how to run, etc. Use the content from `cursor-rules.md` as a starting point for project description.
16. **Code Style & Linting:**
    *   Run `bunx biome format --write` and `bunx biome lint --write` to ensure consistent code style and fix any simple linting issues.
17. **Review Client/Server Components:**
    *   Analyze pages for potential conversion to Server Components where appropriate to improve performance.
18. **Testing (Optional but Recommended):**
    *   Consider adding basic unit or integration tests for critical parts like cart logic, routing helpers, and context providers.

This plan provides a roadmap to significantly improve the codebase. Each phase builds upon the previous one, starting with the most critical structural issues.