"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { usePathname } from "next/navigation";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  
  const navigation = [
    { name: "Dashboard", href: "/bojanicnikola", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: "Orders", href: "/bojanicnikola/orders", icon: <ShoppingBag className="h-5 w-5" /> },
    { name: "Products", href: "/bojanicnikola/products", icon: <Package className="h-5 w-5" /> },
    { name: "Customers", href: "/bojanicnikola/customers", icon: <Users className="h-5 w-5" /> },
    { name: "Settings", href: "/bojanicnikola/settings", icon: <Settings className="h-5 w-5" /> },
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:z-auto`}
      >
        <div className="h-full flex flex-col">
          {/* Logo and close button (mobile) */}
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <Link href="/bojanicnikola" className="text-xl font-bold text-indigo-600">
              Drool Admin
            </Link>
            <button 
              className="md:hidden text-gray-500 focus:outline-none"
              onClick={toggleSidebar}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className={`flex items-center px-4 py-2 text-sm rounded-md ${
                      pathname === item.href 
                        ? "bg-indigo-50 text-indigo-600" 
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            <div className="mt-auto pt-4 border-t border-gray-200 mt-6">
              <Link 
                href="/"
                className="flex items-center px-4 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Back to Site
              </Link>
            </div>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="px-4 py-4 flex items-center justify-between">
            <button 
              className="md:hidden text-gray-500 focus:outline-none"
              onClick={toggleSidebar}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center">
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                    A
                  </div>
                  <span className="ml-2 text-sm font-medium">Admin User</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 