import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  Bookmark,
  DollarSign,
  BarChart2,
  MessageSquare,
  Link,
  Facebook,
  Play,
  Target,
  Tag,
} from "lucide-react";
import Footer from "../components/Footer";
import CountdownTimer from "../components/CountdownTimer";
import { supabase } from "../lib/supabase";

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any>([]);
  const [savedProducts, setSavedProducts] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setProducts(data);
      }
    };
    fetchProducts();
  }, []);


  const toggleSaveProduct = (productId: number) => {
    setSavedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleShowMeMoney = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation - Optimized for mobile */}
      <nav className="fixed top-0 left-0 right-0 bg-black/50 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between h-16 sm:h-20 md:h-24">
            <div className="flex items-center">
              <img
                src="https://i.postimg.cc/3JQd5V6C/WINPROD-AI-Twitch-Banner-1.png"
                alt="WinProd AI"
                className="h-10 sm:h-12 md:h-24 w-auto"
              />
            </div>
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              <button
                onClick={() => navigate("/login")}
                className="text-white hover:text-primary transition-colors text-sm sm:text-base px-2.5 py-1.5 sm:px-4 sm:py-2"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-primary hover:bg-primary/90 text-white text-sm sm:text-base px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Enhanced for mobile */}
      <div className="pt-20 sm:pt-24 md:pt-32 pb-0 sm:pb-12 md:pb-0 lg:pb-0 px-3 sm:px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 md:mb-6 leading-tight">
            AI-Powered Curation Of{" "}
            <span className="text-primary">Winning Products</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-6 sm:mb-8 px-1 sm:px-2 max-w-2xl mx-auto">
            Stop wasting time on bad products. We curate the best new products
            every day using AI and real market data.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center mb-10 lg:mb-0 sm:mb-10 md:mb-0 px-4 sm:px-0">
            <button
              onClick={() => navigate("/register")}
              className="bg-primary hover:bg-primary/90 text-white px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-lg text-base sm:text-lg font-medium transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              Start Free Trial
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-lg text-base sm:text-lg font-medium transition-colors w-full sm:w-auto">
              Watch Demo
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Preview */}
      <div className="relative max-w-6xl mx-auto px-2 py-0 sm:px-4 pb-8 sm:py-12 md:pb-20">
        {/* Countdown Timer - Moved outside gradient overlays */}
        <div className="relative z-10 -mx-2 sm:-mx-4 mb-4 sm:mb-6">
          <CountdownTimer />
        </div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-transparent" />

        <div className="relative">
          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 p-2 sm:p-4 md:p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            {products && products?.length > 0 ? (
              products.map((product: any) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex h-[180px]">
                    {/* Product Image */}
                    <div className="relative w-[180px] shrink-0">
                      <img
                        src={product.images ? product.images[0] : "/"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {product.isLocked && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                          <Lock size={24} className="text-white" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 p-4 flex flex-col">
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <div>
                          <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">
                            {product.name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            Posted {product.posted}
                          </p>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-4 gap-1.5">
                        {[
                          {
                            icon: DollarSign,
                            label: "PROFITS",
                            color: "text-green-600",
                          },
                          {
                            icon: BarChart2,
                            label: "ANALYTICS",
                            color: "text-orange-500",
                          },
                          {
                            icon: MessageSquare,
                            label: "ENGAGEMENT",
                            color: "text-blue-500",
                          },
                          {
                            icon: Link,
                            label: "LINKS",
                            color: "text-purple-500",
                          },
                          {
                            icon: Facebook,
                            label: "FB ADS",
                            color: "text-blue-600",
                          },
                          { icon: Play, label: "VIDEO", color: "text-red-500" },
                          {
                            icon: Target,
                            label: "TARGETING",
                            color: "text-indigo-500",
                          },
                          {
                            icon: Tag,
                            label: "RETAIL PRICE",
                            color: "text-yellow-600",
                          },
                        ].map((stat, index) => (
                          <div
                            key={index}
                            className="flex flex-col items-center justify-center p-2 bg-gray-50/80 rounded hover:bg-gray-100/80 transition-colors h-[46px]"
                          >
                            <stat.icon
                              size={20}
                              className={`${stat.color} md:mb-1`}
                            />
                            <span className="text-[8px] text-gray-600 font-semibold leading-none text-center uppercase tracking-wider hidden md:block">
                              {stat.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 p-4">
                    <button
                      onClick={() => handleShowMeMoney(product.id)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        product.isLocked
                          ? "bg-primary hover:bg-primary/90 text-white shadow-sm hover:shadow"
                          : "bg-secondary hover:bg-secondary/90 text-white shadow-sm hover:shadow"
                      }`}
                    >
                      {product.isLocked ? "Unlock Now" : "Show Me The Money!"}
                    </button>

                    <button
                      onClick={() => toggleSaveProduct(product.id)}
                      className={`px-3 rounded-lg transition-all duration-200 ${
                        savedProducts.has(product.id)
                          ? "bg-secondary/10 text-secondary hover:bg-secondary/20"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <Bookmark
                        size={18}
                        className={
                          savedProducts.has(product.id) ? "fill-secondary" : ""
                        }
                      />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col col-span-2 items-center justify-center bg-black text-white text-center px-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary"></div>
                <p className="mt-4 text-lg font-semibold text-gray-400">
                  Loading Products...
                </p>
              </div>
            )}
          </div>

          {/* Join Overlay */}
          <div className="absolute bottom-0 top-56 left-0 right-0 h-[280px] sm:h-[300px] md:h-[320px] bg-gradient-to-t from-black via-black/95 to-black/90 backdrop-blur-sm rounded-xl">
            <div className="max-w-2xl mx-auto text-center pt-8 sm:pt-10 md:pt-12 px-3 sm:px-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4">
                Our AI is adding winning products on a daily basis.
              </h2>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-4">
                Stop wasting money on bad products
              </h3>
              <p className="text-sm md:text-base text-gray-300 mb-6">
                Want to be a successful store owner? Get instant access to our
                AI-curated winning products list with detailed analytics and
                targeting data.
              </p>
              <button
                onClick={() => navigate("/register")}
                className="bg-[#47D147] hover:bg-[#47D147]/90 text-white text-base sm:text-lg md:text-xl font-medium px-6 sm:px-8 md:px-12 py-2.5 sm:py-3 md:py-4 rounded-lg transition-colors"
              >
                Join now! It's Free :)
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
