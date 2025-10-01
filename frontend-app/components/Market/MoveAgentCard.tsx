import { ArrowRight, Activity, BarChart, Zap, TrendingUp } from "react-feather"
import Link from "next/link"

const MoveAgentKitCard = () => {
    return (
        <Link href="/markets/aptos-defi">
            <div className="group cursor-pointer">
                {/* Desktop Version */}
                <div className="hidden md:block">
                    <div className="relative bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent rounded-2xl p-6 border border-blue-400/20 hover:border-blue-400/40 transition-all duration-500 backdrop-blur-sm hover:shadow-2xl hover:shadow-blue-500/10 overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent opacity-50"></div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-400/10 to-purple-400/10 rounded-full blur-xl"></div>
                        
                        <div className="relative flex items-center space-x-6">
                            {/* Logo Section */}
                            <div className="flex-shrink-0 relative">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-blue-400/30 group-hover:scale-105 transition-transform duration-300">
                                    <img src="./assets/images/move-agent-kit.png" className="w-14 h-14 object-contain" alt="Move Agent Kit" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-400 rounded-full animate-pulse border-2 border-black"></div>
                                {/* AI Badge */}
                                <div className="absolute -bottom-1 -left-1 px-2 py-0.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold rounded-full">
                                    AI
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-3 mb-2">
                                    <h3 className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300">
                                        Aptos DeFi Ecosystem
                                    </h3>
                                    <span className="px-3 py-1 bg-blue-400/20 text-blue-300 text-xs font-semibold rounded-full border border-blue-400/30 flex items-center space-x-1">
                                        <Zap size={12} />
                                        <span>AI-POWERED</span>
                                    </span>
                                </div>
                                <p className="text-gray-300 text-base leading-relaxed mb-4 max-w-2xl">
                                    Predict yields, TVL, and performance across major DeFi protocols including Joule, Thala, LiquidSwap powered by Move Agent Kit
                                </p>
                                
                                {/* Stats Row */}
                                <div className="flex items-center space-x-6 text-sm">
                                    <div className="flex items-center space-x-2">
                                        <Activity size={16} className="text-blue-400" />
                                        <span className="text-gray-400">89 Active Agents</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <BarChart size={16} className="text-green-400" />
                                        <span className="text-gray-400">$4.3K Volume</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <TrendingUp size={16} className="text-purple-400" />
                                        <span className="text-gray-400">+31% 24h</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Section */}
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl group-hover:from-blue-400 group-hover:to-purple-500 transition-all duration-300 group-hover:scale-110">
                                    <ArrowRight size={20} className="text-white group-hover:translate-x-1 transition-transform duration-300" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Version */}
                <div className="block md:hidden">
                    <div className="relative bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent rounded-xl p-4 border border-blue-400/20 hover:border-blue-400/40 transition-all duration-500 backdrop-blur-sm overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent opacity-50"></div>
                        
                        <div className="relative flex items-start space-x-4">
                            {/* Logo Section */}
                            <div className="flex-shrink-0 relative">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-blue-400/30">
                                    <img src="./assets/images/move-agent-kit.png" className="w-10 h-10 object-contain" alt="Move Agent Kit" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full animate-pulse border border-black"></div>
                                <div className="absolute -bottom-1 -left-1 px-1.5 py-0.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold rounded-full">
                                    AI
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-bold text-white">Aptos DeFi</h3>
                                    <span className="px-2 py-1 bg-blue-400/20 text-blue-300 text-xs font-semibold rounded-full flex items-center space-x-1">
                                        <Zap size={10} />
                                        <span>AI</span>
                                    </span>
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed mb-3 line-clamp-2">
                                    Predict DeFi yields and TVL across Joule, Thala, LiquidSwap with AI-powered Move Agent Kit
                                </p>
                                
                                {/* Stats Row Mobile */}
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-400">89 AI Agents</span>
                                    <span className="text-green-400 font-semibold">$4.3K Volume</span>
                                    <ArrowRight size={16} className="text-blue-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default MoveAgentKitCard