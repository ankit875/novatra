
import CoinMarketCapCard from "./CoinMarketCapCard"
import MoveAgentKitCard from "./MoveAgentCard"

const MarketList = () => {
    return (
        <>
            {/* Modern Header Section */}
            <div className="heading mb-8 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-4">
                    <span className="inline-flex items-center bg-gradient-to-r from-secondary/20 to-secondary/10 px-4 py-2 rounded-full text-secondary font-semibold text-sm tracking-wide backdrop-blur-sm border border-secondary/20">
                        🎯 LIVE MARKETS
                    </span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent mb-3">
                    EXPLORE <span className="bg-gradient-to-r from-secondary to-secondary/70 bg-clip-text text-transparent">MARKETS</span>
                </h2>
                <p className="text-xl text-gray-300 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                    Discover active prediction markets and participate in decentralized forecasting with real-time insights
                </p>
            </div>

            {/* Enhanced Market Cards Grid */}
            <div className="grid grid-cols-1 gap-6 py-2 max-w-7xl">
                <CoinMarketCapCard />
                <MoveAgentKitCard/>
            </div>

        </>
    )
}

export default MarketList