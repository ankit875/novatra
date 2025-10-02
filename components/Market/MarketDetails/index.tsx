
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
const MARKET_ID = 1

const MarketDetails = () => {

    const [modal, setModal] = useState(false)
    const [activeTab, setActiveTab] = useState(0)

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

    const renderActiveComponent = () => {
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

            {/* Modern DeFi Dashboard Layout */}
            <div className="max-w-7xl mx-auto p-4 space-y-6">
                
                {/* Alert Banner */}
                <div className="relative bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 rounded-xl p-4 border border-blue-400/20 backdrop-blur-sm">
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

                {/* Main Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left Panel - Market Overview & Navigation */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Market Overview */}
                        <div className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl p-6 border border-white/10">
                            <Overview market={{ ...onchainMarket }} />
                        </div>

                        {/* Compact Navigation */}
                        <div className="bg-gradient-to-r from-white/5 to-white/[0.02] rounded-xl p-3 border border-white/10">
                            <div className="grid grid-cols-3 gap-2">
                                {navItems.map((item) => {
                                    const IconComponent = item.icon
                                    const isActive = activeTab === item.id
                                    
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveTab(item.id)}
                                            className={`relative group transition-all duration-200 ${
                                                isActive 
                                                    ? 'bg-gradient-to-r ' + item.color + ' shadow-md' 
                                                    : 'hover:bg-white/5'
                                            } rounded-lg p-3`}
                                        >
                                            <div className="flex flex-col items-center space-y-2">
                                                <div className={`relative ${
                                                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                                                } transition-colors`}>
                                                    <IconComponent size={20} />
                                                    {item.badge && (
                                                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold text-[10px]">
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className={`text-xs font-medium ${
                                                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                                                } transition-colors text-center`}>
                                                    {item.label}
                                                </div>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Active Component Display */}
                        <div className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 overflow-hidden">
                            <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500"></div>
                            <div className="p-6">
                                {renderActiveComponent()}
                            </div>
                        </div>

                    </div>

                    {/* Right Panel - Compact Analytics */}
                    <div className="lg:col-span-1">
                        <div className="space-y-4">
                            
                            {/* Rankings Card */}
                            <div className="bg-gradient-to-br from-white/5 to-transparent rounded-xl p-4 border border-white/10">
                                <div className="flex items-center space-x-2 mb-3">
                                    <TrendingUp size={16} className="text-green-400" />
                                    <h3 className="text-sm font-bold text-white">Rankings</h3>
                                </div>
                                <Ranking
                                    currentRound={currentRound}
                                    marketData={marketData}
                                />
                            </div>

                            {/* Activity Feed */}
                            <div className="bg-gradient-to-br from-white/5 to-transparent rounded-xl p-4 border border-white/10">
                                <div className="flex items-center space-x-2 mb-3">
                                    <BarChart size={16} className="text-purple-400" />
                                    <h3 className="text-sm font-bold text-white">Activity</h3>
                                </div>
                                <MarketActivity />
                            </div>

                        </div>
                    </div>

                </div>

            </div>

        </>
    )
}

export default MarketDetails