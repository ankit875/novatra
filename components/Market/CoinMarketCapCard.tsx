import { ArrowRight, TrendingUp, Users, DollarSign } from "react-feather"
import Link from "next/link"

const CoinMarketCapCard = () => {
    return (
        <Link href="/markets/coinmarketcap">
            <div className="group cursor-pointer">
                {/* Desktop Version */}
                <div className="hidden md:block">
                    <div className="relative bg-gradient-to-br from-orange-500/10 via-orange-400/5 to-transparent rounded-2xl p-6 border border-orange-400/20 hover:border-orange-400/40 transition-all duration-500 backdrop-blur-sm hover:shadow-2xl hover:shadow-orange-500/10 overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent opacity-50"></div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-400/10 to-transparent rounded-full blur-xl"></div>
                        
                        <div className="relative flex items-center space-x-6">
                            {/* Logo Section */}
                            <div className="flex-shrink-0 relative">
                                <div className="w-20 h-20 bg-gradient-to-br from-orange-400/20 to-orange-600/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-orange-400/30 group-hover:scale-105 transition-transform duration-300">
                                    <img src="./assets/images/coinmarketcap.png" className="w-14 h-14 object-contain" alt="CoinMarketCap" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse border-2 border-black"></div>
                            </div>

                            {/* Content Section */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-3 mb-2">
                                    <h3 className="text-2xl font-bold text-white group-hover:text-orange-300 transition-colors duration-300">
                                        CoinMarketCap Markets
                                    </h3>
                                    <span className="px-3 py-1 bg-orange-400/20 text-orange-300 text-xs font-semibold rounded-full border border-orange-400/30">
                                        TRENDING
                                    </span>
                                </div>
                                <p className="text-gray-300 text-base leading-relaxed mb-4 max-w-2xl">
                                    Predict cryptocurrency prices, market trends, and trading volumes for top tokens listed on CoinMarketCap
                                </p>
                                
                                {/* Stats Row */}
                                <div className="flex items-center space-x-6 text-sm">
                                    <div className="flex items-center space-x-2">
                                        <Users size={16} className="text-orange-400" />
                                        <span className="text-gray-400">- Predictors</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <DollarSign size={16} className="text-green-400" />
                                        <span className="text-gray-400">- Volume</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <TrendingUp size={16} className="text-blue-400" />
                                        <span className="text-gray-400">- 24h</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Section */}
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl group-hover:from-orange-400 group-hover:to-orange-500 transition-all duration-300 group-hover:scale-110">
                                    <ArrowRight size={20} className="text-white group-hover:translate-x-1 transition-transform duration-300" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Version */}
                <div className="block md:hidden">
                    <div className="relative bg-gradient-to-br from-orange-500/10 via-orange-400/5 to-transparent rounded-xl p-4 border border-orange-400/20 hover:border-orange-400/40 transition-all duration-500 backdrop-blur-sm overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent opacity-50"></div>
                        
                        <div className="relative flex items-start space-x-4">
                            {/* Logo Section */}
                            <div className="flex-shrink-0 relative">
                                <div className="w-16 h-16 bg-gradient-to-br from-orange-400/20 to-orange-600/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-orange-400/30">
                                    <img src="./assets/images/coinmarketcap.png" className="w-10 h-10 object-contain" alt="CoinMarketCap" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse border border-black"></div>
                            </div>

                            {/* Content Section */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-bold text-white">CoinMarketCap</h3>
                                    <span className="px-2 py-1 bg-orange-400/20 text-orange-300 text-xs font-semibold rounded-full">HOT</span>
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed mb-3 line-clamp-2">
                                    Predict crypto prices and market trends for top tokens listed on CoinMarketCap
                                </p>
                                
                                {/* Stats Row Mobile */}
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-400">156 Predictors</span>
                                    <span className="text-green-400 font-semibold">$8.2K Volume</span>
                                    <ArrowRight size={16} className="text-orange-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default CoinMarketCapCard