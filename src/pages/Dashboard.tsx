"use client"

import { useEffect, useState } from "react"
import {
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
  X,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"

// Generate 20 products for demonstration
const generateProducts = () => {
  const baseProducts = [
    {
      name: "Acupressure Reflexology Chart Socks",
      image: "https://i.postimg.cc/j2s21Z6r/w3ame3fm-NY79-Zb3-Rp-Ce-Johx-X0298-No-DKnk-T1so-DY.jpg",
      stats: {
        profit: "+156%",
        engagement: "High",
        fbAds: "Active",
        targetingInfo: "Available",
        retailPrice: "$29.99",
      },
    },
    {
      name: "Teeth Whitening Powder",
      image: "https://i.postimg.cc/jdxn3dvJ/g-LNIZ90-Muiv-Qh-P34kt-ENf25-Lgb-L17u-Ih4og7-SF1q.webp",
      stats: {
        profit: "+142%",
        engagement: "Medium",
        fbAds: "Active",
        targetingInfo: "Available",
        retailPrice: "$39.99",
      },
    },
    {
      name: "Rechargeable Automatic Dog Paw Cleaner",
      image: "https://i.postimg.cc/QtZHQXHC/ASWBR0od5-FT0-Gt-KSt-CAsto-Ruezkhp-Urt-NKBa6-CBK.webp",
      stats: {
        profit: "+98%",
        engagement: "High",
        fbAds: "Active",
        targetingInfo: "Available",
        retailPrice: "$24.99",
      },
    },
    {
      name: "Baby Hair Clipper with Vacuum",
      image: "https://i.postimg.cc/BZD8N7Fk/Wuaw43-J4j-Mu1x-Dehzoo8d-UUHTnke-Kcnrm-GMzs-DCj.webp",
      stats: {
        profit: "+134%",
        engagement: "High",
        fbAds: "Active",
        targetingInfo: "Available",
        retailPrice: "$19.99",
      },
    },
  ]

  return Array.from({ length: 20 }, (_, index) => {
    const baseProduct = baseProducts[index % baseProducts.length]
    const daysAgo = Math.floor(Math.random() * 7) + 1
    return {
      id: index + 1,
      name: baseProduct.name,
      image: baseProduct.image,
      posted: `${daysAgo} days ago`,
      stats: baseProduct.stats,
      isLocked: index < 4, // Only first 4 products are locked
      isSaved: false,
    }
  })
}

// const products = generateProducts();
const PRODUCTS_PER_PAGE = 20
const TOTAL_PAGES = 14 // For demonstration, showing 277 total products

const Dashboard = () => {
  const navigate = useNavigate()
  const [showSaved, setShowSaved] = useState(false)
  const [dateRange, setDateRange] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [savedProducts, setSavedProducts] = useState<Set<number>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    const fetchData = async () => {
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("categories")
        .select("*")
        .order("name")

      if (categoriesError) {
        console.error("Error fetching categories:", categoriesError)
      } else {
        setCategories(categoriesData || [])
      }

      // Fetch products
      let query = supabase.from("products").select(`
        *,
        product_categories!inner(category_id),
        categories(id, name)
      `)

      // Apply category filter if not "all"
      if (selectedCategory !== "all") {
        query = query.eq("product_categories.category_id", selectedCategory)
      }

      const { data, error } = await query

      if (error) {
        console.error("Error fetching products:", error)
      } else {
        setProducts(data || [])
      }
    }

    fetchData()
  }, [selectedCategory])

  const toggleSaveProduct = (productId: number) => {
    setSavedProducts((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(productId)) {
        newSet.delete(productId)
      } else {
        newSet.add(productId)
      }
      return newSet
    })
  }

  const handleShowMeMoney = (productId: number) => {
    navigate(`/product/${productId}`)
  }

  const getPaginationRange = () => {
    const range = []
    const showPages = 5
    const leftOffset = Math.floor(showPages / 2)

    let start = currentPage - leftOffset
    let end = currentPage + leftOffset

    if (start < 1) {
      end += 1 - start
      start = 1
    }

    if (end > TOTAL_PAGES) {
      start -= end - TOTAL_PAGES
      end = TOTAL_PAGES
    }

    start = Math.max(start, 1)
    end = Math.min(end, TOTAL_PAGES)

    if (start > 1) {
      range.push(1)
      if (start > 2) range.push("...")
    }

    for (let i = start; i <= end; i++) {
      range.push(i)
    }

    if (end < TOTAL_PAGES) {
      if (end < TOTAL_PAGES - 1) range.push("...")
      range.push(TOTAL_PAGES)
    }

    return range
  }

  return (
    <div className="max-w-7xl mx-auto pt-20">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI-Curated Winning Products, Updated Every Day</h1>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for products, niches, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Filters Toggle */}
        <button
          className="md:hidden flex items-center justify-between w-full px-4 py-2 bg-white border rounded-lg"
          onClick={() => setShowFilters(!showFilters)}
        >
          <span className="text-gray-700 font-medium">Filters</span>
          <ChevronDown
            size={20}
            className={`text-gray-500 transform transition-transform ${showFilters ? "rotate-180" : ""}`}
          />
        </button>

        {/* Filters */}
        <div
          className={`
          flex flex-col gap-3
          md:flex md:flex-row md:items-center md:justify-between
          ${showFilters ? "block" : "hidden md:flex"}
        `}
        >
          {/* Left Side - My Saved */}
          <button
            onClick={() => setShowSaved(!showSaved)}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors w-full md:w-auto ${
              showSaved ? "bg-secondary text-white" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <BookmarkCheck size={18} />
            <span className="whitespace-nowrap">My Saved</span>
          </button>

          {/* Right Side - Filters */}
          <div className="flex flex-col md:flex-row gap-3">
            <select className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium">
              <option>Sort by: New</option>
              <option>Sort by: Trending</option>
              <option>Sort by: Profit</option>
            </select>

            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2">
              <Calendar size={18} className="text-gray-500 shrink-0" />
              <select
                className="w-full bg-transparent border-none text-sm font-medium focus:outline-none"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">Last 3 Months</option>
              </select>
            </div>

            <select
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {products.map((product: any) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex h-[180px]">
              {/* Product Image */}
              <div className="relative w-[180px] shrink-0">
                <img
                  src={product.images && product.images.length > 0 ? product.images[0] : "/placeholder.svg"}
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
                    <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-gray-500">Posted {product.posted}</p>
                    {product.categories && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {product.categories.map((category: any) => (
                          <span
                            key={category.id}
                            className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full"
                          >
                            {category.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { icon: DollarSign, label: "PROFITS", color: "text-green-600" },
                    { icon: BarChart2, label: "ANALYTICS", color: "text-orange-500" },
                    { icon: MessageSquare, label: "ENGAGEMENT", color: "text-blue-500" },
                    { icon: Link, label: "LINKS", color: "text-purple-500" },
                    { icon: Facebook, label: "FB ADS", color: "text-blue-600" },
                    { icon: Play, label: "VIDEO", color: "text-red-500" },
                    { icon: Target, label: "TARGETING", color: "text-indigo-500" },
                    { icon: Tag, label: "RETAIL PRICE", color: "text-yellow-600" },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center justify-center p-2 bg-gray-50/80 rounded hover:bg-gray-100/80 transition-colors h-[46px]"
                    >
                      <stat.icon size={20} className={`${stat.color} md:mb-1`} />
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
                <Bookmark size={18} className={savedProducts.has(product.id) ? "fill-secondary" : ""} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 gap-2 overflow-x-auto">
        {getPaginationRange().map((page, index) =>
          page === "..." ? (
            <span key={`ellipsis-${index}`} className="px-4 py-2 text-gray-600">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => setCurrentPage(Number(page))}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === page ? "bg-primary text-white" : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ),
        )}
      </div>
    </div>
  )
}

export default Dashboard

