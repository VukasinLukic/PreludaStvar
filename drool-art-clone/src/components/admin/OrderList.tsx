"use client";

import { useState, useEffect } from "react";
import { firestoreAdmin } from "@/lib/firebaseAdmin";
import { 
  DocumentSnapshot,
  Timestamp 
} from 'firebase-admin/firestore';
import { format } from "date-fns";
import { AlertCircle, ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react";
import { Order, OrderStatus } from "@/types/order";

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastVisible, setLastVisible] = useState<DocumentSnapshot | null>(null);
  const [firstVisible, setFirstVisible] = useState<DocumentSnapshot | null>(null);
  const [pageTokens, setPageTokens] = useState<DocumentSnapshot[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  
  const ORDERS_PER_PAGE = 10;
  
  useEffect(() => {
    fetchOrders();
  }, []);
  
  const fetchOrders = async (searchTerm = "", startAfterDoc: DocumentSnapshot | null = null) => {
    try {
      setLoading(true);
      setError(null);
      
      let ordersQuery;
      const ordersRef = firestoreAdmin.collection('orders');
      
      if (startAfterDoc) {
        ordersQuery = ordersRef
          .orderBy("createdAt", "desc")
          .startAfter(startAfterDoc)
          .limit(ORDERS_PER_PAGE);
      } else {
        ordersQuery = ordersRef
          .orderBy("createdAt", "desc")
          .limit(ORDERS_PER_PAGE);
      }
      
      const querySnapshot = await ordersQuery.get();
      
      if (querySnapshot.empty) {
        setOrders([]);
        setLoading(false);
        return;
      }
      
      // Set the first and last documents for pagination
      setFirstVisible(querySnapshot.docs[0]);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      
      const fetchedOrders: Order[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const orderItems = data.items || [];
        
        // Standardizuj podatke o porudžbini prema Order tipu
        const order: Order = {
          id: doc.id,
          items: orderItems.map((item: any) => ({
            productId: item.productId || item.id || "",
            name: item.name || "Unknown Product",
            price: item.price || 0,
            quantity: item.quantity || 1,
            size: item.size || null,
            finish: item.finish || null,
            image: item.image || ""
          })),
          shippingInfo: {
            firstName: data.shippingInfo?.firstName || data.customerName?.split(' ')[0] || "Unknown",
            lastName: data.shippingInfo?.lastName || data.customerName?.split(' ').slice(1).join(' ') || "",
            email: data.shippingInfo?.email || data.customerEmail || "unknown@example.com",
            phone: data.shippingInfo?.phone || "",
            address: data.shippingInfo?.address || data.shippingAddress?.street || "",
            city: data.shippingInfo?.city || data.shippingAddress?.city || "",
            postalCode: data.shippingInfo?.postalCode || data.shippingAddress?.postalCode || "",
            country: data.shippingInfo?.country || data.shippingAddress?.country || "",
            igUsername: data.shippingInfo?.igUsername || null
          },
          subtotal: data.subtotal || data.orderTotal || 0,
          discount: data.discount || 0,
          total: data.total || data.orderTotal || 0,
          status: (data.status || "pending") as OrderStatus,
          createdAt: data.createdAt || Timestamp.now(),
          updatedAt: data.updatedAt,
          shippedAt: data.shippedAt,
          deliveredAt: data.deliveredAt,
          notes: data.notes || ""
        };
        
        // If searching, only add orders that match the search term
        if (
          !searchTerm ||
          order.shippingInfo.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.shippingInfo.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.shippingInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.id.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          fetchedOrders.push(order);
        }
      });
      
      setOrders(fetchedOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleNextPage = () => {
    if (!lastVisible) return;
    
    // Save the current first document for backward navigation
    if (currentPage === pageTokens.length - 1) {
      setPageTokens([...pageTokens, firstVisible!]);
    }
    
    setCurrentPage(currentPage + 1);
    fetchOrders(searchQuery, lastVisible);
  };
  
  const handlePreviousPage = () => {
    if (currentPage === 0) return;
    
    const previousPage = currentPage - 1;
    const token = pageTokens[previousPage];
    
    setCurrentPage(previousPage);
    fetchOrders(searchQuery, token || null);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders(searchQuery);
  };
  
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-lg text-gray-500">Loading orders...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 my-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Orders</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          View and manage all customer orders
        </p>
        
        {/* Search form */}
        <form onSubmit={handleSearch} className="mt-4 flex">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md py-2"
              placeholder="Search by order ID, customer name or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Search
          </button>
        </form>
      </div>
      
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No orders found</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Order ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Customer
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Items
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {order.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.shippingInfo.firstName} {order.shippingInfo.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{order.shippingInfo.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(order.createdAt instanceof Date ? order.createdAt : order.createdAt.toDate(), "MMM d, yyyy 'at' h:mm a")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.items.length}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between items-center">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 0}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${
                  currentPage === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={orders.length < ORDERS_PER_PAGE}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${
                  orders.length < ORDERS_PER_PAGE ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 