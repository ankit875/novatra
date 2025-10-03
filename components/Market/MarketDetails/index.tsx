
import { useState, useEffect } from "react";
import { MessageCircle, Target, TrendingUp, BarChart, CreditCard, AlertCircle } from "react-feather";
import FaucetModal from "@/modals/faucet";
import ChatPanel from "@/components/Market/MarketDetails/ChatPanel";
import Overview from "@/components/Market/MarketDetails/Overview";
import Ranking from "@/components/Market/MarketDetails/Ranking";
import useAptos from '@/hooks/useAptos'
import useDatabase from '@/hooks/useDatabase'
import AvailableBets from '@/components/Market/MarketDetails/AvailableBets'
import PlaceBetModal from "@/modals/placeBet"
import MyBetPositions from '@/components/Market/MarketDetails/MyBetPositions'
import MarketActivity from '@/components/Market/MarketDetails/MarketActivity';

// Fixed on this version
const MARKET_ID = 3

const MarketDetails = () => {

    const [modal, setModal] = useState(false)
    const [activeTab, setActiveTab] = useState(0)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const [contentKey, setContentKey] = useState(0)

    const { getMarketInfo } = useAptos()
    const { getMarketData } = useDatabase()

    const [marketData, setMarketData] = useState<any>()
    const [onchainMarket, setOnchainMarket] = useState<any>()
    const [bet, setBet] = useState<any>(undefined) 

    useEffect(() => {
        getMarketInfo(MARKET_ID).then(setOnchainMarket)
    }, [])

    useEffect(() => {
        getMarketData(MARKET_ID).then(setMarketData)
    }, [])

    const openBetModal = (entry: any) => {
        setBet(entry)
    }

    const currentRound = onchainMarket ? onchainMarket.round : 0
    console.log({marketData},'----marketData--', marketData)
    const navItems = [
        { 
            id: 0, 
            label: "Live Chat", 
            icon: MessageCircle, 
            badge: "12", 
            color: "from-blue-500 to-blue-600",
            description: "Community discussions"
        },
        { 
            id: 1, 
            label: "Available Bets", 
            icon: Target, 
            badge: "24", 
            color: "from-green-500 to-green-600",
            description: "Place predictions"
        },
        { 
            id: 2, 
            label: "My Positions", 
            icon: CreditCard, 
            badge: null, 
            color: "from-purple-500 to-purple-600",
            description: "Portfolio overview"
        }
    ]

    const handleTabChange = (tabId: number) => {
        if (tabId === activeTab) return
        
        setIsTransitioning(true)
        setTimeout(() => {
            setActiveTab(tabId)
            setContentKey(prev => prev + 1)
            setIsTransitioning(false)
        }, 150)
    }

    const renderActiveComponent = () => {
        const baseClasses = "transform transition-all duration-500 ease-out"
        const animationClasses = isTransitioning 
            ? "opacity-0 translate-y-4 scale-95" 
            : "opacity-100 translate-y-0 scale-100"
        
        const content = (() => {
            switch(activeTab) {
                case 0:
                    return (
                        <ChatPanel
                            currentRound={currentRound}
                            marketData={marketData}
                            onchainMarket={onchainMarket}
                            openBetModal={openBetModal}
                        />
                    )
                case 1:
                    return (
                        <AvailableBets
                            currentRound={currentRound}
                            marketData={marketData}
                            onchainMarket={onchainMarket}
                            openBetModal={openBetModal} 
                        />
                    )
                case 2:
                    return (
                        <MyBetPositions
                            marketData={marketData}
                            currentRound={currentRound}
                            onchainMarket={onchainMarket}
                        />
                    )
                default:
                    return null
            }
        })()

        return (
            <div key={contentKey} className={`${baseClasses} ${animationClasses}`}>
                {content}
            </div>
        )
    }

    return (
        <>

            <FaucetModal
                visible={modal}
                close={() => setModal(false)}
            />

            <PlaceBetModal
                visible={bet}
                close={() => setBet(undefined)}
                bet={bet}
            />

            <div className="max-w-7xl mx-auto p-4 space-y-6">
                
                <div className="relative bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 rounded-xl p-4 border border-blue-400/20 backdrop-blur-sm animate-float">
                    <div className="flex items-center space-x-3">
                        <AlertCircle size={18} className="text-blue-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-300">
                                Testnet Environment - Get test tokens from the{" "}
                                <button 
                                    onClick={() => setModal(true)} 
                                    className="text-blue-400 hover:text-blue-300 underline font-semibold"
                                >
                                    Faucet
                                </button>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    <div className="lg:col-span-2 space-y-6 animate-fade-in-up">
                        
                        <div className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-500 hover:shadow-lg hover:shadow-blue-500/20 animate-glow">
                            <Overview market={{ ...onchainMarket }} />
                        </div>

                        <div className="bg-gradient-to-r from-white/5 to-white/[0.02] rounded-xl p-3 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-md">
                            <div className="grid grid-cols-3 gap-2">
                                {navItems.map((item) => {
                                    const IconComponent = item.icon
                                    const isActive = activeTab === item.id
                                    
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => handleTabChange(item.id)}
                                            className={`relative group transition-all duration-300 transform hover:z-10 overflow-hidden ${
                                                isActive 
                                                    ? `bg-gradient-to-r ${item.color} shadow-lg shadow-${item.color.split('-')[1]}-500/20 scale-105 border-2 border-white/20` 
                                                    : 'hover:bg-white/10 hover:scale-102 border-2 border-transparent'
                                            } rounded-lg p-3 hover:shadow-md transition-bounce`}
                                        >
                                            <div className="absolute inset-0 bg-white/20 rounded-lg transform scale-0 group-hover:scale-100 transition-transform duration-500 ease-out"></div>
                                            
                                            {isActive && (
                                                <div className={`absolute -top-1 -left-1 -right-1 -bottom-1 bg-gradient-to-r ${item.color} rounded-lg opacity-30 animate-pulse`}></div>
                                            )}
                                            
                                            <div className="relative z-10 flex flex-col items-center space-y-2">
                                                <div className={`relative ${
                                                    isActive ? 'text-white drop-shadow-sm' : 'text-gray-400 group-hover:text-white'
                                                } transition-all duration-300`}>
                                                    <IconComponent size={20} className={isActive ? 'animate-pulse' : ''} />
                                                    {item.badge && (
                                                        <span className={`absolute -top-1 -right-1 w-4 h-4 ${
                                                            isActive ? 'bg-white text-gray-800' : 'bg-red-500 text-white'
                                                        } text-xs rounded-full flex items-center justify-center font-bold text-[10px] transition-all duration-300`}>
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className={`text-xs font-medium ${
                                                    isActive ? 'text-white font-bold drop-shadow-sm' : 'text-gray-400 group-hover:text-white'
                                                } transition-all duration-300 text-center`}>
                                                    {item.label}
                                                </div>
                                            </div>

                                            {isActive && (
                                                <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-white rounded-full shadow-md`}></div>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300 hover:shadow-lg">
                            <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 animate-shimmer"></div>
                            <div className="p-6">
                                <div className="transition-all duration-300 ease-in-out">
                                    {renderActiveComponent()}
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="lg:col-span-1 animate-fade-in-right">
                        <div className="space-y-4">
                            
                            <div className="bg-gradient-to-br from-white/5 to-transparent rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-102 hover:shadow-lg animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                                <div className="flex items-center space-x-2 mb-3">
                                    <TrendingUp size={16} className="text-green-400 animate-pulse" />
                                    <h3 className="text-sm font-bold text-white">Rankings</h3>
                                </div>
                                <Ranking
                                    currentRound={currentRound}
                                    marketData={marketData}
                                />
                            </div>

                           
                                <MarketActivity />
                        
                        </div>
                    </div>

                </div>

            </div>

        </>
    )
}

export default MarketDetails