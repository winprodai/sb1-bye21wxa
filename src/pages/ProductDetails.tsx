import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, ShoppingCart, TrendingUp, BarChart2, MessageSquare, 
  Link as LinkIcon, Facebook, Play, Target, Tag, Wand2, Copy, 
  Check, RefreshCw, Lock, Bookmark, Store, TrendingDown, 
  AlertTriangle, DollarSign, ShoppingBag, Search, ExternalLink
} from 'lucide-react';

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedTone, setSelectedTone] = useState('professional');
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const isPro = false;

  // Add new mock data for links and ads
  const marketplaceLinks = [
    { platform: 'Amazon', url: 'https://amazon.com/dp/B0123456789' },
    { platform: 'eBay', url: 'https://ebay.com/itm/123456789' },
    { platform: 'Alibaba', url: 'https://alibaba.com/product/123456789' },
    { platform: 'AliExpress', url: 'https://aliexpress.com/item/123456789' }
  ];

  const facebookAds = [
    {
      id: 1,
      title: "Spring Sale - 50% OFF",
      url: "https://facebook.com/ads/123",
      status: "Active",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=500"
    },
    {
      id: 2,
      title: "Limited Time Offer",
      url: "https://facebook.com/ads/456",
      status: "Active",
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=500"
    }
  ];

  const product = {
    name: "Portable Folding Dog Poop Scooper",
    postedDays: 3,
    sellingPrice: 29.48,
    productCost: 6.48,
    profitMargin: 23,
    searchVolume: {
      monthly: 27800,
      trend: 'increasing',
      relatedTerms: [
        { term: 'dog poop scooper', volume: 18200 },
        { term: 'pooper scooper', volume: 6600 },
        { term: 'portable dog waste picker', volume: 3000 }
      ]
    },
    estimatedSales: {
      low: 50,
      average: 150,
      high: 300
    },
    aliexpressOrders: {
      daily: 127,
      weekly: 892,
      monthly: 3845,
      trend: 'increasing'
    },
    description: "Portable Folding Dog Poop Scooper with Garbage Bag",
    specs: [
      { label: "Material", value: "ABS + TPE" },
      { label: "Small Size", value: "10.5 cm (L) × 13 cm (H) × 5 cm (W)" },
      { label: "Large Size", value: "14.5 cm (L) × 18 cm (H) × 5 cm (W)" }
    ],
    images: [
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=500",
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=500",
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=500",
      "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=500",
      "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&q=80&w=500"
    ],
    saturation: {
      percentage: 65,
      totalStores: 842,
      activeStores: 523,
      trend: 'increasing',
      competition: 'medium',
      recentChange: '+12%',
      timeFrame: '30 days'
    }
  };

  const calculateMonthlyRevenue = (sales: number) => {
    return (sales * product.profitMargin).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    });
  };

  const toneOptions = [
    { value: 'professional', label: 'Professional' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'persuasive', label: 'Persuasive' },
    { value: 'enthusiastic', label: 'Enthusiastic' }
  ];

  const getSaturationColor = (value: number) => {
    if (value <= 33) return 'bg-green-500';
    if (value <= 66) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getCompetitionIcon = (competition: string) => {
    switch (competition.toLowerCase()) {
      case 'low':
        return { Icon: TrendingDown, color: 'text-green-500' };
      case 'medium':
        return { Icon: AlertTriangle, color: 'text-yellow-500' };
      case 'high':
        return { Icon: TrendingUp, color: 'text-red-500' };
      default:
        return { Icon: BarChart2, color: 'text-gray-500' };
    }
  };

  const handleGenerate = () => {
    if (!isPro) return;
    
    setIsGenerating(true);
    setTimeout(() => {
      const descriptions = {
        professional: "Introducing the Premium Portable Folding Dog Poop Scooper, an essential tool for responsible pet owners. Crafted from durable ABS + TPE materials, this innovative scooper features a convenient folding design and integrated garbage bag system. Available in two sizes to accommodate all breeds, from small companions to large dogs.",
        friendly: "Say goodbye to messy cleanups with our super handy Folding Dog Poop Scooper! 🐕 Made with love for pet parents, this cute and practical scooper makes walkies more fun and cleanup a breeze. It's perfect for any size pup, from tiny Chihuahuas to big friendly Labs! Plus, it folds up nice and compact - how cool is that? 🎉",
        persuasive: "Transform your daily dog walks with the most efficient and hygienic pet waste solution available. Our Portable Folding Dog Poop Scooper isn't just another pet accessory – it's a game-changer that will save you time, effort, and embarrassment. With its premium construction and thoughtful design, you'll wonder how you ever managed without it.",
        enthusiastic: "WOW! Get ready for the ULTIMATE dog walking companion! 🌟 This AMAZING Portable Folding Dog Poop Scooper is absolutely PERFECT for every dog owner! It's super sturdy, incredibly easy to use, and comes with an AWESOME garbage bag system! Whether you have a tiny pup or a gentle giant, this scooper is a TOTAL GAME-CHANGER! 🐾"
      };
      setGeneratedDescription(descriptions[selectedTone]);
      setIsGenerating(false);
    }, 1500);
  };

  const handleCopy = () => {
    if (!isPro) return;
    
    navigator.clipboard.writeText(generatedDescription);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSave}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isSaved
                    ? 'bg-secondary/10 text-secondary hover:bg-secondary/20'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Bookmark size={18} className={isSaved ? 'fill-secondary' : ''} />
                {isSaved ? 'Saved' : 'Save Product'}
              </button>
              <button className="bg-[#FF4646] hover:bg-[#FF4646]/90 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                See on Aliexpress
              </button>
              <button className="bg-[#96BF48] hover:bg-[#96BF48]/90 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                <ShoppingCart size={18} />
                Sell with Shopify
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="relative">
                <img 
                  src={product.images[selectedImage]} 
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
                {!isPro && selectedImage > 0 && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] rounded-lg flex flex-col items-center justify-center">
                    <Lock size={32} className="text-white mb-2" />
                    <div className="text-white text-center px-6">
                      <p className="font-semibold mb-2">Join Pro to Remove Watermark</p>
                      <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                        Upgrade to Pro
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index 
                      ? 'border-primary' 
                      : 'border-transparent hover:border-gray-200'
                  }`}
                >
                  <img 
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full aspect-square object-cover"
                  />
                  {!isPro && index > 0 && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]">
                      <Lock size={16} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
              <img 
                src="https://i.postimg.cc/0jv2zc4J/shopify-Banner-8b9252e6.webp"
                alt="Start with Shopify"
                className="w-full h-auto"
              />
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Market Saturation Analysis</h2>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  product.saturation.trend === 'increasing' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {product.saturation.recentChange} in {product.saturation.timeFrame}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`absolute top-0 left-0 h-full ${getSaturationColor(product.saturation.percentage)} transition-all duration-500`}
                    style={{ width: `${product.saturation.percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Low Competition</span>
                  <span>Medium</span>
                  <span>High Competition</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Store size={18} className="text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">Total Stores</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{product.saturation.totalStores.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">Currently selling this product</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Store size={18} className="text-green-500" />
                    <span className="text-sm font-medium text-gray-700">Active Stores</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{product.saturation.activeStores.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">Made sales in last 30 days</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Competition Level</h3>
                    <p className="text-xs text-gray-500 mt-1">Based on market analysis</p>
                  </div>
                  {(() => {
                    const { Icon, color } = getCompetitionIcon(product.saturation.competition);
                    return (
                      <div className={`flex items-center gap-2 ${color}`}>
                        <Icon size={18} />
                        <span className="font-medium capitalize">{product.saturation.competition}</span>
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ShoppingBag size={18} className="text-[#FF4646]" />
                    <h3 className="text-sm font-medium text-gray-700">Aliexpress Orders</h3>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    product.aliexpressOrders.trend === 'increasing' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.aliexpressOrders.trend === 'increasing' ? 'Trending Up' : 'Trending Down'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">DAILY</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-gray-900">
                        {product.aliexpressOrders.daily.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500">orders</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">WEEKLY</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-gray-900">
                        {product.aliexpressOrders.weekly.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500">orders</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">MONTHLY</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-gray-900">
                        {product.aliexpressOrders.monthly.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500">orders</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-gray-500">Posted {product.postedDays} days ago</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Your Profit & Cost</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">SELLING PRICE</p>
                  <p className="text-2xl font-bold text-gray-900">${product.sellingPrice}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">PRODUCT COST</p>
                  <p className="text-2xl font-bold text-gray-900">${product.productCost}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">PROFIT MARGIN</p>
                  <p className="text-2xl font-bold text-green-500">${product.profitMargin}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Search size={24} className="text-blue-500" />
                <h2 className="text-lg font-semibold">Search Volume Analysis</h2>
              </div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{product.searchVolume.monthly.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Monthly searches</p>
                </div>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  product.searchVolume.trend === 'increasing'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.searchVolume.trend === 'increasing' ? 'Trending Up' : 'Trending Down'}
                </span>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700">Related Search Terms</h3>
                {product.searchVolume.relatedTerms.map((term, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">{term.term}</span>
                    <span className="text-sm font-medium text-gray-900">{term.volume.toLocaleString()} searches/mo</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign size={24} className="text-green-500" />
                <h2 className="text-lg font-semibold">Estimated Monthly Revenue</h2>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">CONSERVATIVE</p>
                  <p className="text-xl font-bold text-gray-900">{calculateMonthlyRevenue(product.estimatedSales.low)}</p>
                  <p className="text-xs text-gray-500 mt-1">{product.estimatedSales.low} sales/month</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border-2 border-green-100">
                  <p className="text-sm text-gray-500 mb-1">REALISTIC</p>
                  <p className="text-xl font-bold text-green-600">{calculateMonthlyRevenue(product.estimatedSales.average)}</p>
                  <p className="text-xs text-gray-500 mt-1">{product.estimatedSales.average} sales/month</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">OPTIMISTIC</p>
                  <p className="text-xl font-bold text-gray-900">{calculateMonthlyRevenue(product.estimatedSales.high)}</p>
                  <p className="text-xs text-gray-500 mt-1">{product.estimatedSales.high} sales/month</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Wand2 size={20} className="text-primary" />
                  <h2 className="text-lg font-semibold">Description Generator</h2>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedTone}
                    onChange={(e) => setSelectedTone(e.target.value)}
                    className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={!isPro}
                  >
                    {toneOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label} Tone
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !isPro}
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 size={18} />
                        Generate
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <textarea
                    value={generatedDescription}
                    onChange={(e) => setGeneratedDescription(e.target.value)}
                    placeholder="Click 'Generate' to create a product description..."
                    className="w-full h-40 p-4 text-gray-600 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    disabled={!isPro}
                  />
                  {!isPro && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] rounded-lg flex flex-col items-center justify-center">
                      <Lock size={32} className="text-white mb-2" />
                      <div className="text-white text-center px-6">
                        <p className="font-semibold mb-2">Join Pro to Use Description Generator</p>
                        <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                          Upgrade to Pro
                        </button>
                      </div>
                    </div>
                  )}
                  {generatedDescription && isPro && (
                    <button
                      onClick={handleCopy}
                      className="absolute top-2 right-2 p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {copied ? (
                        <Check size={18} className="text-green-500" />
                      ) : (
                        <Copy size={18} className="text-gray-400" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Marketplace Links Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <LinkIcon size={24} className="text-blue-500" />
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
                    <ExternalLink size={18} className="text-gray-400 group-hover:text-primary transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* Facebook Ads Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Facebook size={24} className="text-[#1877F2]" />
                <h2 className="text-lg font-semibold">Facebook Ads</h2>
              </div>
              <div className="space-y-4">
                {facebookAds.map((ad) => (
                  <a
                    key={ad.id}
                    href={ad.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={ad.image}
                        alt={ad.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900">{ad.title}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            ad.status === 'Active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {ad.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Product Specifications</h2>
              <div className="space-y-2">
                {product.specs.map((spec, index) => (
                  <div key={index} className="flex gap-2">
                    <span className="text-gray-600 font-medium">{spec.label}:</span>
                    <span className="text-gray-600">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;