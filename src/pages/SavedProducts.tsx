import React from 'react';
import { Bookmark, Search, Filter, ArrowRight } from 'lucide-react';

const SavedProducts = () => {
  // This would be managed by a global state management solution in a real app
  const savedProducts = [
    {
      id: 1,
      name: "Portable LED Ring Light",
      image: "https://images.unsplash.com/photo-1603190287605-e6ade32fa852?auto=format&fit=crop&q=80&w=500",
      price: "$29.99",
      profit: "+156%",
      engagement: "High",
      savedAt: "2 days ago"
    },
    {
      id: 2,
      name: "Smart Plant Monitor",
      image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&q=80&w=500",
      price: "$39.99",
      profit: "+142%",
      engagement: "Medium",
      savedAt: "3 days ago"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Bookmark size={24} className="text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">Saved Products</h1>
          </div>
          <p className="text-gray-600">Manage and organize your saved products</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search saved products..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </button>
        </div>

        {/* Products Grid */}
        {savedProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="relative h-48">
                  <img 
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <button className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
                      <Bookmark size={18} className="text-primary fill-primary" />
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">Saved {product.savedAt}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm">
                      <span className="text-gray-600">Price:</span>
                      <span className="ml-1 font-medium text-gray-900">{product.price}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Profit:</span>
                      <span className="ml-1 font-medium text-green-600">{product.profit}</span>
                    </div>
                  </div>
                  
                  <button className="w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                    View Details
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Bookmark size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No saved products yet</h3>
            <p className="text-gray-600 mb-4">Start saving products to build your collection</p>
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="inline-flex items-center justify-center px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors"
            >
              Discover Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedProducts;