import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
  Tag,
  Copy,
  Check,
  Lock,
  Bookmark,
  Store,
  DollarSign,
  ShoppingBag,
  Search,
  ExternalLink,
  Play,
} from "lucide-react";
import { supabase } from "../lib/supabase";

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSaved, setIsSaved] = useState(false);
  const isPro = false;
  const [product, setProduct] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeVideo, setActiveVideo] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const tiktokVideos = [
    "https://www.tiktok.com/t/ZT29xucKT/",
    "https://www.tiktok.com/t/ZT29xucKT/",
    "https://www.tiktok.com/t/ZT29xucKT/",
    "https://www.tiktok.com/t/ZT29xucKT/",
    "https://www.tiktok.com/t/ZT29xucKT/",
  ]


  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const { data, error }: any = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching product:", error.message);
      } else {
        const formattedProduct = {
          name: data.name,
          postedDays: Math.floor(
            (Date.now() - new Date(data.created_at)) / (1000 * 60 * 60 * 24)
          ),
          sellingPrice: data.selling_price,
          categories: data.categories || [],
          productCost: data.product_cost,
          profitMargin: Math.round(data.selling_price - data.product_cost)?.toFixed(2),
          searchVolume: {
            monthly: data.search_volume_monthly || 0,
            trend: data.search_trend || "stable",
            relatedTerms: data.related_terms || [],
          },
          estimatedSales: {
            low: data.sales_low || 0,
            average: data.sales_avg || 0,
            high: data.sales_high || 0,
          },
          description: data.description,
          specs: data.specs || [
            { label: "Material", value: "Waterproof Oxford Fabric + LED Panel" },
            { label: "Capacity", value: "20L" },
            { label: "LED Display", value: "Programmable RGB LED screen with mobile app control" },
            { label: "Battery", value: "Built-in rechargeable 10,000mAh battery" },
            { label: "Charging Port", value: "USB Type-C fast charging" },
            { label: "Size", value: "45 cm (H) × 30 cm (W) × 15 cm (D)" },
            { label: "Weight", value: "1.2 kg" },
            { label: "Connectivity", value: "Bluetooth & Wi-Fi for app control" },
            { label: "Water Resistance", value: "IPX4 (Splash Resistant)" }
          ],
          images: data.images || [],
        };

        setProduct(formattedProduct);
      }
      setLoading(false);
    };

    if (id) fetchProduct();
  }, [id]);

  const marketplaceLinks = [
    { platform: "Amazon", url: "https://amazon.com/dp/B0123456789" },
    { platform: "eBay", url: "https://ebay.com/itm/123456789" },
    { platform: "Alibaba", url: "https://alibaba.com/product/123456789" },
    { platform: "AliExpress", url: "https://aliexpress.com/item/123456789" },
  ];
  const aliexpressSuppliers = [
    { name: "Tech Gadgets Supplier", url: "https://aliexpress.com/supplier/123" },
    { name: "LED Accessories Co.", url: "https://aliexpress.com/supplier/456" },
    { name: "Smart Bags Factory", url: "https://aliexpress.com/supplier/789" },
    { name: "Outdoor Gear Direct", url: "https://aliexpress.com/supplier/101" },
  ];
  const calculateMonthlyRevenue = (sales: number) => {
    return (sales * product.profitMargin).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary"></div>{" "}
          <p className="mt-3 text-lg font-semibold text-gray-700">
            Loading Product...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 mt-[40px] sm:mt-[40px] lg:mt-0">
      <div className="max-w-7xl mx-auto px-4 pt-[8px] pb-6 md:pt-4 md:pb-12 lg:pt-7 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-8 md:gap-16 lg:gap-16">
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="relative">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full aspect-square object-contain rounded-lg"
                />
                {!isPro && selectedImage > 0 && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] rounded-lg flex flex-col items-center justify-center">
                    <Lock size={32} className="text-white mb-2" />
                    <div className="text-white text-center px-6">
                      <p className="font-semibold mb-2">
                        Join Pro to Remove Watermark
                      </p>
                      <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                        Upgrade to Pro
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {[...product.images]?.reverse()?.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                    ? "border-primary"
                    : "border-transparent hover:border-gray-200"
                    }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full aspect-square object-cover"
                  />
                  {!isPro && index > 0 && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]">
                      <Lock
                        size={16}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white"
                      />
                    </div>
                  )}
                </button>
              ))}
            </div>
            {/* Viral Videos Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-black rounded-full p-1.5">
                  <Play size={18} className="text-white" />
                </div>
                <h2 className="text-lg font-semibold">Viral Videos</h2>
              </div>

              <div className="relative">
                <div className="overflow-hidden">
                  <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-6 px-6">
                    {tiktokVideos.map((video, index) => (
                      <div key={index} className="relative flex-shrink-0 w-[280px] snap-start">
                        <div className="aspect-[9/16] bg-gray-100 rounded-lg overflow-hidden">
                          <iframe
                            src={`https://www.tiktok.com/embed/${video.split("/t/")[1].split("/")[0]}`}
                            className="w-full h-full"
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>


          <div className="space-y-6 sm:space-y-6 md:space-y-8 lg:space-y-8">
            <div>
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  {product.name}
                </h1>
                <button
                  onClick={toggleSave}
                  className={`p-2 rounded-lg transition ${isSaved
                    ? "bg-gray-800 text-gray-200"
                    : "bg-gray-200 text-gray-600"
                    }`}
                >
                  <Bookmark size={20} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-2">
                {product.categories?.map((category, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm bg-gray-100 rounded-full"
                  >
                    {category}
                  </span>
                ))}
              </div>

              <p className="text-gray-500">Posted {product.postedDays} days ago</p>
              <div className="hidden sm:flex gap-4 mt-4">
                <button className="bg-[#FF4646] hover:bg-[#FF4646]/90 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  See on Aliexpress
                </button>
                <button className="bg-[#96BF48] hover:bg-[#96BF48]/90 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                  <ShoppingCart size={18} />
                  Sell with Shopify
                </button>
              </div>

              <p className="pt-4">{product?.description}</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-300 shadow-md">

              {/* Header Section */}
              <div className="bg-gray-100 w-full rounded-t-2xl py-3 border-b border-gray-300 flex justify-center">
                <h2 className="text-xl font-bold text-black text-center">
                  Your Profit & Cost
                </h2>
              </div>

              {/* Square Boxes & Reduced Gap */}
              <div className="mt-6 flex justify-center gap-3 p-4 pb-8">
                {/* Selling Price */}
                <div className="bg-white border-2 border-gray-300 shadow-md rounded-xl p-3 text-center w-36 h-28 flex flex-col items-center justify-center">
                  <p className="text-3xl font-extrabold text-black">$12.61</p>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Selling Price</p>
                </div>

                {/* Product Cost */}
                <div className="bg-white border-2 border-gray-300 shadow-md rounded-xl p-3 text-center w-36 h-28 flex flex-col items-center justify-center">
                  <p className="text-3xl font-extrabold text-black">$2.61</p>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Product Cost</p>
                </div>

                {/* Profit Margin */}
                <div className="bg-white border-2 border-gray-300 shadow-md rounded-xl p-3 text-center w-36 h-28 flex flex-col items-center justify-center">
                  <p className="text-3xl font-extrabold text-green-600">$10</p>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Profit Margin</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Search size={24} className="text-blue-500" />
                <h2 className="text-lg font-semibold">
                  Search Volume Analysis
                </h2>
              </div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-3xl font-bold text-gray-900">
                    {product.searchVolume.monthly.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">Monthly searches</p>
                </div>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${product.searchVolume.trend === "increasing"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                    }`}
                >
                  {product.searchVolume.trend === "increasing"
                    ? "Trending Up"
                    : "Trending Down"}
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700">
                  Related Search Terms
                </h3>
                {product.searchVolume.relatedTerms.map((term, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-gray-700">{term.term}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {term.volume.toLocaleString()} searches/mo
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign size={24} className="text-green-500" />
                <h2 className="text-lg font-semibold">
                  Estimated Monthly Revenue
                </h2>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">CONSERVATIVE</p>
                  <p className="text-xl font-bold text-gray-900">
                    {calculateMonthlyRevenue(product.estimatedSales.low)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {product.estimatedSales.low} sales/month
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border-2 border-green-100">
                  <p className="text-sm text-gray-500 mb-1">REALISTIC</p>
                  <p className="text-xl font-bold text-green-600">
                    {calculateMonthlyRevenue(product.estimatedSales.average)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {product.estimatedSales.average} sales/month
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">OPTIMISTIC</p>
                  <p className="text-xl font-bold text-gray-900">
                    {calculateMonthlyRevenue(product.estimatedSales.high)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {product.estimatedSales.high} sales/month
                  </p>
                </div>
              </div>
            </div>

            <div className="block sm:hidden bg-white rounded-xl overflow-hidden border border-gray-200">
              <img
                src="https://i.postimg.cc/0jv2zc4J/shopify-Banner-8b9252e6.webp"
                alt="Start with Shopify"
                className="w-full h-auto"
              />
            </div>

            {/* Marketplace Links Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <ExternalLink size={24} className="text-blue-500" />
                <h2 className="text-lg font-semibold">Marketplace Links</h2>
              </div>
              <div className="space-y-3">
                {marketplaceLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                  >
                    <span className="text-gray-700">{link.platform}</span>
                    <ExternalLink
                      size={18}
                      className="text-gray-400 group-hover:text-primary transition-colors"
                    />
                  </a>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <ShoppingBag size={24} className="text-[#FF4646]" />
                <h2 className="text-lg font-semibold">Aliexpress Suppliers</h2>
              </div>
              <div className="space-y-3">
                {aliexpressSuppliers.map((supplier, index) => (
                  <a
                    key={index}
                    href={supplier.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                  >
                    <span className="text-gray-700">{supplier.name}</span>
                    <ExternalLink
                      size={18}
                      className="text-gray-400 group-hover:text-[#FF4646] transition-colors"
                    />
                  </a>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">
                Product Descripion
              </h2>
              {product.specs && product.specs.length > 0 ? (
                <div className="space-y-2">
                  {product.specs.map((spec, index) => (
                    <div key={index} className="flex gap-2">
                      <span className="text-gray-600 font-medium">
                        {spec.label}:
                      </span>
                      <span className="text-gray-600">{spec.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No specifications available!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;