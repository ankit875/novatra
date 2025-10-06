import { useState, useEffect } from "react"
import { MessageCircle, Target, TrendingUp, BarChart, CreditCard, AlertCircle } from "react-feather"
import useAptos from '@/hooks/useAptos'
import useDatabase from '@/hooks/useDatabase'
import FaucetModal from "@/modals/faucet"
import Overview from "@/components/Market/MoveAgentKit/OverviewAgent"
import Ranking from "../MarketDetails/Ranking"
import ChatPanel from "@/components/Market/MarketDetails/ChatPanel/MoveAgentKit"
import AvailableBets from '../MarketDetails/AvailableBets'
import MyBetPositions from '../MarketDetails/MyBetPositions'
import PlaceBetModal from "../../../modals/placeBet"

const MARKET_ID = 2

const MoveAgentKit = () => {

    const [modal, setModal] = useState(false)
    const [activeTab, setActiveTab] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [isTabAnimating, setIsTabAnimating] = useState(false)

    const { getMarketInfo } = useAptos()
    const { getMarketData } = useDatabase()

    const [marketData, setMarketData] = useState<any>()
    const [onchainMarket, setOnchainMarket] = useState<any>()
    const [bet, setBet] = useState<any>(undefined)

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true)
            try {
                await Promise.all([
                    getMarketInfo(MARKET_ID).then(setOnchainMarket),
                    getMarketData(MARKET_ID).then(setMarketData)
                ])
            } finally {
                setTimeout(() => setIsLoading(false), 300) // Small delay for smooth loading animation
            }
        }
        loadData()
    }, [])

    const openBetModal = (entry: any) => {
        setBet(entry)
    }

    const handleTabChange = (tabId: number) => {
        if (tabId === activeTab) return
        
        setIsTabAnimating(true)
        setTimeout(() => {
            setActiveTab(tabId)
            setIsTabAnimating(false)
        }, 150)
    }

    const currentRound = onchainMarket ? onchainMarket.round : 0

    const navItems = [
        { 
            id: 0, 
            label: "AI Chat", 
            icon: MessageCircle, 
            badge: "8", 
            color: "from-blue-500 to-blue-600",
            description: "Move Agent discussions"
        },
        { 
            id: 1, 
            label: "DeFi Predictions", 
            icon: Target, 
            badge: "16", 
            color: "from-green-500 to-green-600",
            description: "Yield & TVL bets"
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

    const renderActiveComponent = () => {
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
            <div className={`transition-all duration-300 ${
                isTabAnimating 
                    ? 'opacity-0 translate-y-2' 
                    : 'opacity-100 translate-y-0'
            }`}>
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
                onchainMarketId={2}
            />

            <div className={`max-w-7xl mx-auto p-4 space-y-6 transition-all duration-500 ${
                isLoading 
                    ? 'opacity-0 translate-y-4' 
                    : 'opacity-100 translate-y-0'
            }`}>
                
                <div className="relative bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-purple-400/20 backdrop-blur-sm animate-pulse-slow hover:from-purple-500/15 hover:via-blue-500/15 hover:to-purple-500/15 transition-all duration-300">
                    <div className="flex items-center space-x-3">
                        <AlertCircle size={18} className="text-purple-400 flex-shrink-0 animate-bounce-subtle" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-300">
                                AI-Powered DeFi Predictions on Testnet - Get test tokens from the{" "}
                                <button 
                                    onClick={() => setModal(true)} 
                                    className="text-purple-400 hover:text-purple-300 underline font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
                                >
                                    Faucet
                                </button>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
                    
                    <div className="lg:col-span-2 space-y-6">
                        
                        <div className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:shadow-white/5">
                            <Overview market={{ ...onchainMarket }} />
                        </div>

                        <div className="bg-gradient-to-r from-white/5 to-white/[0.02] rounded-xl p-3 border border-white/10 hover:border-white/20 transition-all duration-300">
                            <div className="grid grid-cols-3 gap-2">
                                {navItems.map((item, index) => {
                                    const IconComponent = item.icon
                                    const isActive = activeTab === item.id
                                    
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => handleTabChange(item.id)}
                                            className={`relative group transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                                                isActive 
                                                    ? 'bg-gradient-to-r ' + item.color + ' shadow-lg shadow-' + item.color.split('-')[1] + '/25' 
                                                    : 'hover:bg-white/10'
                                            } rounded-lg p-3 animate-slide-in-tab`}
                                            style={{ animationDelay: `${index * 100}ms` }}
                                        >
                                            <div className="flex flex-col items-center space-y-2">
                                                <div className={`relative transition-all duration-300 ${
                                                    isActive ? 'text-white scale-110' : 'text-gray-400 group-hover:text-white group-hover:scale-105'
                                                }`}>
                                                    <IconComponent size={20} />
                                                    {item.badge && (
                                                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold text-[10px] animate-pulse">
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className={`text-xs font-medium transition-all duration-300 ${
                                                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                                                } text-center`}>
                                                    {item.label}
                                                </div>
                                            </div>
                                            
                                            {/* Active tab indicator */}
                                            {isActive && (
                                                <div className="absolute inset-0 rounded-lg border-2 border-white/30 animate-border-glow"></div>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-white/5">
                            <div className="h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 animate-gradient-shift"></div>
                            <div className="p-6">
                                {renderActiveComponent()}
                            </div>
                        </div>

                    </div>

                    <div className="lg:col-span-1 animate-slide-in-right">
                        <div className="space-y-4">
                            
                            <div className="bg-gradient-to-br from-white/5 to-transparent rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-green-500/10">
                                <div className="flex items-center space-x-2 mb-3">
                                    <TrendingUp size={16} className="text-green-400 animate-pulse" />
                                    <h3 className="text-sm font-bold text-white">DeFi Rankings</h3>
                                </div>
                                <Ranking
                                    currentRound={currentRound}
                                    marketData={marketData}
                                />
                            </div>

                        </div>
                    </div>

                </div>

            </div>

        </>
    )
}

export default MoveAgentKit