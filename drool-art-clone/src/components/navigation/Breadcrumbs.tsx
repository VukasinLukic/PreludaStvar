'use client';

import Link from 'next/link';
import React from 'react';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex flex-wrap items-center text-sm mb-6 text-gray-600" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center space-x-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <React.Fragment key={item.href + index}>
              <li className="flex items-center">
                {isLast ? (
                  <span className="font-medium text-gray-900">{item.label}</span>
                ) : (
                  <Link 
                    href={item.href}
                    className="hover:text-black hover:underline transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
              
              {!isLast && (
                <li className="text-gray-400 mx-1">/</li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs; 