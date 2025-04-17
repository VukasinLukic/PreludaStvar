"use client";

import { useEffect } from "react";
import { setupTrackerProxy } from "@/lib/tracker";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  // Remove any extension-added classes during hydration
  useEffect(() => {
    // This runs only on the client after hydration
    document.body.className = "antialiased";
    
    // Setup tracker proxy to avoid CORS issues
    setupTrackerProxy();
  }, []);

  return (
    <body className="antialiased" suppressHydrationWarning>
      {children}
    </body>
  );
}
