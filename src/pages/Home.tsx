import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Bookmark, DollarSign, BarChart2, MessageSquare, Link, Facebook, Play, Target, Tag } from 'lucide-react';
import Footer from '../components/Footer';
import CountdownTimer from '../components/CountdownTimer';

const Home = () => {
  const navigate = useNavigate();

  const previewProducts = [
    {
      name: "Acupressure Reflexology Chart Socks",
      image: "https://i.postimg.cc/j2s21Z6r/w3ame3fm-NY79-Zb3-Rp-Ce-Johx-X0298-No-DKnk-T1so-DY.jpg",
      profit: "156",
      engagement: "High",
      fbAds: "Active",
      targetingInfo: "Available",
      retailPrice: "$29.99",
      postedDays: 2
    },
    {
      name: "Teeth Whitening Powder",
      image: "https://i.postimg.cc/jdxn3dvJ/g-LNIZ90-Muiv-Qh-P34kt-ENf25-Lgb-L17u-Ih4og7-SF1q.webp",
      profit: "142",
      engagement: "Medium",
      fbAds: "Active",
      targetingInfo: "Available",
      retailPrice: "$39.99",
      postedDays: 1
    },
    {
      name: "Rechargeable Automatic Dog Paw Cleaner",
      image: "https://i.postimg.cc/QtZHQXHC/ASWBR0od5-FT0-Gt-KSt-CAsto-Ruezkhp-Urt-NKBa6-CBK.webp",
      profit: "98",
      engagement: "High",
      fbAds: "Active",
      targetingInfo: "Available",
      retailPrice: "$24.99",
      postedDays: 3
    },
    {
      name: "Baby Hair Clipper with Vacuum",
      image: "https://i.postimg.cc/BZD8N7Fk/Wuaw43-J4j-Mu1x-Dehzoo8d-UUHTnke-Kcnrm-GMzs-DCj.webp",
      profit: "134",
      engagement: "High",
      fbAds: "Active",
      targetingInfo: "Available",
      retailPrice: "$19.99",
      postedDays: 2
    },
    {
      name: "360 Degree Relaxing Head Massager",
      image: "https://i.postimg.cc/QxJFZB0q/5-YMAh-Qrvb-Ta-ESQ3w-Oz-Qv-JQUFPw-NN77-G7-B0a6-Ff6-X.webp",
      profit: "167",
      engagement: "High",
      fbAds: "Active",
      targetingInfo: "Available",
      retailPrice: "$34.99",
      postedDays: 1
    },
    {
      name: "Portable Folding Dog Poop Scooper",
      image: "https://i.postimg.cc/x1sqqwrJ/sf-Y0-Xrmc0-UQ4-U2-HD6ph-T3wd-Mr-Syv-RPAEi4k-Lo-Hju.jpg",
      profit: "189",
      engagement: "Medium",
      fbAds: "Active",
      targetingInfo: "Available",
      retailPrice: "$27.99",
      postedDays: 4
    },
    {
      name: "Anti Theft Crossbody Travel Bag",
      image: "https://i.postimg.cc/kgVm9GmH/Qbn-Do-Il-V8-CCff-Qk-Qi-GN0-Itnph-K7bt-EMjedqq1-AG2.webp",
      profit: "145",
      engagement: "High",
      fbAds: "Active",
      targetingInfo: "Available",
      retailPrice: "$49.99",
      postedDays: 2
    },
    {
      name: "Upgrade Thermal Portable Printer",
      image: "https://i.postimg.cc/VNdvtK17/2wpe-Fn5-SDq-Jm-Vje8-Enr-XHDOr4-MVWXIKYq78-Etc-P1.jpg",
      profit: "112",
      engagement: "Medium",
      fbAds: "Active",
      targetingInfo: "Available",
      retailPrice: "$22.99",
      postedDays: 3
    },
    {
      name: "Wireless Sound Activated RGB Light Bar",
      image: "https://i.postimg.cc/0QcCnpNX/B1-O9yi1-Yq3-Cbxe9l-WYw3-OXmtv-JXUAg-X54b-JA9di-W.webp",
      profit: "178",
      engagement: "High",
      fbAds: "Active",
      targetingInfo: "Available",
      retailPrice: "$89.99",
      postedDays: 1
    },
    {
      name: "Food Platter Set",
      image: "https://i.postimg.cc/5t5gYcWV/z-Z1x-Dn-Te-Lqs-Sb-Zvk83-Uhv1quocbj-Pa-XYTssmv1-Vn.webp",
      profit: "123",
      engagement: "High",
      fbAds: "Active",
      targetingInfo: "Available",
      retailPrice: "$32.99",
      postedDays: 2
    }
  ];

  const dataTypes = [
    { icon: DollarSign, label: 'PROFITS', value: (p) => `$${p.profit}`, color: 'text-green-600' },
    { icon: BarChart2, label: 'ANALYTICS', value: () => 'View', color: 'text-orange-500' },
    { icon: MessageSquare, label: 'ENGAGEMENT', value: (p) => p.engagement, color: 'text-blue-500' },
    { icon: Link, label: 'LINKS', value: () => 'View', color: 'text-purple-500' },
    { icon: Facebook, label: 'FB ADS', value: (p) => p.fbAds, color: 'text-blue-600' },
    { icon: Play, label: 'VIDEO', value: () => 'Watch', color: 'text-red-500' },
    { icon: Target, label: 'TARGETING', value: (p) => p.targetingInfo, color: 'text-indigo-500' },
    { icon: Tag, label: 'PRICE', value: (p) => p.retailPrice, color: 'text-yellow-600' }
  ];

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
                onClick={() => navigate('/dashboard')}
                className="text-white hover:text-primary transition-colors text-sm sm:text-base px-2.5 py-1.5 sm:px-4 sm:py-2"
              >
                Login
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="bg-primary hover:bg-primary/90 text-white text-sm sm:text-base px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Enhanced for mobile */}
      <div className="pt-20 sm:pt-24 md:pt-32 pb-8 sm:pb-12 md:pb-20 px-3 sm:px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 md:mb-6 leading-tight">
            AI-Powered Curation Of{' '}
            <span className="text-primary">Winning Products</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-6 sm:mb-8 px-1 sm:px-2 max-w-2xl mx-auto">
            Stop wasting time on bad products. We curate the best new products every day using AI and real market data.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center mb-8 sm:mb-10 md:mb-12 px-4 sm:px-0">
            <button 
              onClick={() => navigate('/register')}
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
      <div className="relative max-w-6xl mx-auto px-2 sm:px-4 py-8 sm:py-12 md:py-20">
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
            {previewProducts.map((product, index) => (
              <div key={index} className="bg-white/10 rounded-xl overflow-hidden backdrop-blur-sm border border-white/10">
                <div className="flex h-[130px] sm:h-[140px] md:h-[180px]">
                  {/* Product Image */}
                  <div className="relative w-[130px] sm:w-[140px] md:w-[180px] shrink-0">
                    <img 
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 p-2 sm:p-3 md:p-4 flex flex-col">
                    <div className="flex justify-between items-start gap-2 mb-1.5 sm:mb-2 md:mb-3">
                      <div className="w-full">
                        <h3 className="font-medium text-white text-xs sm:text-sm mb-0.5 sm:mb-1 line-clamp-1">{product.name}</h3>
                        <p className="text-[10px] sm:text-xs text-gray-400">Posted {product.postedDays} days ago</p>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-1 sm:gap-1.5">
                      {dataTypes.map((type, i) => (
                        <div key={i} className="flex flex-col items-center justify-center p-1.5 sm:p-2 md:p-2 bg-white/5 rounded hover:bg-white/10 transition-colors h-[40px] sm:h-[44px] md:h-[46px]">
                          <type.icon size={12} className={`${type.color} mb-1`} />
                          <span className="text-[6px] sm:text-[7px] md:text-[8px] text-gray-300 font-semibold text-center uppercase tracking-wider leading-none">
                            {type.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 sm:gap-3 p-2 sm:p-3 md:p-4">
                  <button className="flex-1 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-primary hover:bg-primary/90 text-white transition-all duration-200">
                    View Details
                  </button>
                  <button className="px-2 sm:px-3 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-all duration-200">
                    <Bookmark size={14} className="sm:h-4 sm:w-4 md:h-[18px] md:w-[18px]" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Join Overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-[280px] sm:h-[300px] md:h-[320px] bg-gradient-to-t from-black via-black/95 to-black/90 backdrop-blur-sm rounded-xl">
            <div className="max-w-2xl mx-auto text-center pt-8 sm:pt-10 md:pt-12 px-3 sm:px-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4">
                Our AI is adding winning products on a daily basis.
              </h2>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-4">
                Stop wasting money on bad products
              </h3>
              <p className="text-sm md:text-base text-gray-300 mb-6">
                Want to be a successful store owner? Get instant access to our AI-curated winning products list with detailed analytics and targeting data.
              </p>
              <button 
                onClick={() => navigate('/register')}
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