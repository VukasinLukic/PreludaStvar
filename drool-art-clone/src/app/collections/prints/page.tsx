import Image from "next/image";
import Link from "next/link";
import { ensureAltText } from '@/lib/utils';

export default function PrintsCollection() {
  return (
    <div className="bg-white">
      {/* Banner */}
      <div className="bg-black text-white text-center py-16 px-4">
        <h1 className="text-4xl font-bold mb-4">Art Prints & Posters</h1>
        <p className="text-lg max-w-3xl mx-auto">Discover unique contemporary art prints from emerging talents around the world.</p>
      </div>

      {/* Filters */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-500">Filter:</span>
              <button className="border rounded px-3 py-1 hover:bg-gray-50 flex items-center">
                Style
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <button className="border rounded px-3 py-1 hover:bg-gray-50 flex items-center">
                Medium
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <button className="border rounded px-3 py-1 hover:bg-gray-50 flex items-center">
                Size
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <button className="border rounded px-3 py-1 hover:bg-gray-50 flex items-center">
                Color
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-500">Sort by:</span>
              <select className="border rounded px-3 py-1 hover:bg-gray-50">
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
                <option>Bestselling</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Active filters */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-gray-500">Active filters:</span>
          <div className="border rounded-full px-3 py-1 bg-gray-100 flex items-center">
            Sale
            <button className="ml-2 text-gray-500 hover:text-black">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <button className="text-gray-500 hover:text-black underline">Clear all</button>
        </div>
      </div>

      {/* Products grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="group">
              <div className="relative mb-3 overflow-hidden">
                <Link href={product.href}>
                  <Image
                    src={product.image}
                    alt={ensureAltText(product.name, `${product.artist} artwork`)}
                    width={300}
                    height={400}
                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
                {product.discount && (
                  <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1">
                    Save {product.discount}
                  </div>
                )}
              </div>
              <Link href={product.href}>
                <h3 className="font-medium mb-1">{product.name}</h3>
              </Link>
              <p className="text-sm text-gray-600 mb-2">{product.artist}</p>
              <div className="flex items-center text-sm">
                <div className="flex items-center mr-2">
                  <span className="text-yellow-500">★★★★★</span>
                  <span className="ml-1">4.8 | 900+ Reviews</span>
                </div>
              </div>
              <div className="mt-2">
                <span className="font-medium">From ${product.price}</span>
                {product.originalPrice && (
                  <span className="ml-2 text-gray-500 line-through">${product.originalPrice}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="flex space-x-1">
          <button className="w-10 h-10 rounded flex items-center justify-center border hover:bg-gray-50 text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="w-10 h-10 rounded flex items-center justify-center border bg-black text-white">1</button>
          <button className="w-10 h-10 rounded flex items-center justify-center border hover:bg-gray-50">2</button>
          <button className="w-10 h-10 rounded flex items-center justify-center border hover:bg-gray-50">3</button>
          <button className="w-10 h-10 rounded flex items-center justify-center border hover:bg-gray-50">4</button>
          <button className="w-10 h-10 rounded flex items-center justify-center border hover:bg-gray-50">5</button>
          <button className="w-10 h-10 rounded flex items-center justify-center border hover:bg-gray-50 text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// Sample product data
const products = [
  {
    id: 1,
    name: "Okinawa 1",
    artist: "Othman Zougam",
    price: "28.00",
    originalPrice: "55.00",
    discount: "49%",
    image: "https://ext.same-assets.com/1114562178/697151246.jpeg",
    href: "/products/okinawa-1-by-othman-zougam-05"
  },
  {
    id: 2,
    name: "Waves",
    artist: "Alexander Khabbazi",
    price: "28.00",
    originalPrice: "55.00",
    discount: "49%",
    image: "https://ext.same-assets.com/1114562178/2001877899.jpeg",
    href: "/products/waves-by-alexander-khabbazi-05"
  },
  {
    id: 3,
    name: "Champion Plum",
    artist: "George Kempster",
    price: "28.00",
    originalPrice: "55.00",
    discount: "49%",
    image: "https://ext.same-assets.com/1114562178/1942543949.jpeg",
    href: "/products/champion-plum-by-george-kempster-05"
  },
  {
    id: 4,
    name: "Open Mind",
    artist: "John Schulisch",
    price: "28.00",
    originalPrice: "55.00",
    discount: "49%",
    image: "https://ext.same-assets.com/1114562178/1979627473.jpeg",
    href: "/products/open-mind-by-john-schulisch-05"
  },
  {
    id: 5,
    name: "Tiger In Green",
    artist: "Kwonny",
    price: "33.00",
    originalPrice: "66.00",
    discount: "50%",
    image: "https://ext.same-assets.com/1114562178/2493572876.jpeg",
    href: "/products/tiger-in-green-by-kwonny"
  },
  {
    id: 6,
    name: "Self Care",
    artist: "Utsav Verma",
    price: "28.00",
    originalPrice: "55.00",
    discount: "49%",
    image: "https://ext.same-assets.com/1114562178/3480855253.jpeg",
    href: "/products/self-care-by-utsav-verma"
  },
  {
    id: 7,
    name: "Evergreen",
    artist: "George Kempster",
    price: "28.00",
    originalPrice: "55.00",
    discount: "49%",
    image: "https://ext.same-assets.com/1114562178/2703411165.jpeg",
    href: "/products/evergreen-by-george-kempster"
  },
  {
    id: 8,
    name: "Every Dog",
    artist: "Alexander Khabbazi",
    price: "28.00",
    originalPrice: "55.00",
    discount: "49%",
    image: "https://ext.same-assets.com/1114562178/2229080376.jpeg",
    href: "/products/every-dog-by-alexander-khabbazi"
  }
];
