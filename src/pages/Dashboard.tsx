import React, { useEffect, useState } from 'react';
import { 
  TrendingUp,
  DollarSign,
  BarChart2,
  MessageSquare,
  Link,
  Facebook,
  Play,
  Target,
  Tag,
  BookmarkCheck,
  Calendar,
  ChevronDown,
  Lock,
  Bookmark,
  Search,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Dashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    selling_price: '',
    product_cost: '',
    is_locked: false,
    images: [],
    category_id: '', // New field for category
    profit_margin: 0,  // Default value for profit margin
    release_time: '', // Default or empty
    priority: 0, // Default value for priority
    is_top_product: false,  // Default value for is_top_product
    search_volume: '{"trend": "stable", "monthly": 0, "relatedTerms": []}', // Default JSON
    aliexpress_orders: '{"daily": 0, "trend": "stable", "weekly": 0, "monthly": 0}', // Default JSON
    engagement_metrics: '{"fbAds": "inactive", "level": "medium", "targetingInfo": "unavailable"}', // Default JSON
    saturation_data: '{"timeFrame": "30 days", "percentage": 0, "competition": "low", "totalStores": 0, "activeStores": 0, "recentChange": "0%"}' // Default JSON
  });
  const [selectedImage, setSelectedImage] = useState(null); // New state for image upload

  useEffect(() => {
    // Fetch products from Supabase
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setProducts(data);
      }
    };

    // Fetch categories from Supabase
    const fetchCategories = async () => {
      const { data, error } = await supabase.from("categories").select("*");
      if (error) {
        console.error("Error fetching categories:", error);
      } else {
        setCategories(data);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const { name, description, selling_price, product_cost, is_locked, category_id, profit_margin, release_time, priority, is_top_product, search_volume, aliexpress_orders, engagement_metrics, saturation_data } = newProduct;

    let imageUrl = '';
    if (selectedImage) {
      // Upload image to Supabase Storage
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(`product_images/${selectedImage.name}`, selectedImage);

      if (error) {
        console.error('Error uploading image:', error);
        return;
      }
      imageUrl = data?.path; // Get the image URL from Supabase Storage
    }

    try {
      // Insert the new product into Supabase
      const { data, error } = await supabase
        .from("products")
        .insert([{
          name,
          description,
          selling_price,
          product_cost,
          is_locked,
          category_id,
          images: [imageUrl], // Save image URL in the 'images' field
          profit_margin: profit_margin || (selling_price - product_cost), // Default profit margin calculation
          release_time,
          priority,
          is_top_product,
          search_volume: JSON.parse(search_volume), // Ensure it's stored as JSON
          aliexpress_orders: JSON.parse(aliexpress_orders),
          engagement_metrics: JSON.parse(engagement_metrics),
          saturation_data: JSON.parse(saturation_data),
          created_at: new Date(),  // Automatically set created_at
          updated_at: new Date(),  // Automatically set updated_at
        }]);

      if (error) throw error;

      // Update products state with the new product
      setProducts((prevProducts) => [...prevProducts, ...data]);

      // Close the modal after adding the product
      setShowAddProductModal(false); // This will close the modal

      // Reset the form fields and selected image
      setNewProduct({
        name: '',
        description: '',
        selling_price: '',
        product_cost: '',
        is_locked: false,
        images: [],
        category_id: '',
        profit_margin: 0,
        release_time: '',
        priority: 0,
        is_top_product: false,
        search_volume: '{"trend": "stable", "monthly": 0, "relatedTerms": []}',
        aliexpress_orders: '{"daily": 0, "trend": "stable", "weekly": 0, "monthly": 0}',
        engagement_metrics: '{"fbAds": "inactive", "level": "medium", "targetingInfo": "unavailable"}',
        saturation_data: '{"timeFrame": "30 days", "percentage": 0, "competition": "low", "totalStores": 0, "activeStores": 0, "recentChange": "0%"}',
      });
      setSelectedImage(null); // Clear selected image
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pt-20">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI-Curated Winning Products, Updated Every Day</h1>
        </div>

        {/* Add Product Button */}
      

        {/* Modal for Adding Product */}
       
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex h-[180px]">
              {/* Product Image */}
              <div className="relative w-[180px] shrink-0">
                <img 
                  src={product.images[0] || '/placeholder-image.jpg'} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.is_locked && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                    <Lock size={24} className="text-white" />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 p-4 flex flex-col">
                <div className="flex justify-between items-start gap-2 mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-gray-500">Posted {product.posted}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
