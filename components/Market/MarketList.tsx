
import CoinMarketCapCard from "./CoinMarketCapCard"
import MoveAgentKitCard from "./MoveAgentCard"

const MarketList = () => {
    return (
        <div className="min-h-screen">
            <div className="heading mb-8 text-center lg:text-left animate-fade-in-up">
                <div className="flex items-center justify-center lg:justify-start mb-4">
                    <span className="inline-flex items-center bg-gradient-to-r from-white/10 to-white/5 px-4 py-2 rounded-full text-white font-semibold text-sm tracking-wide backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300 animate-float">
                         LIVE MARKETS
                    </span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent mb-3 hover:scale-105 transition-transform duration-300">
                    EXPLORE <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-shimmer">MARKETS</span>
                </h2>
                <p className="text-xl text-gray-300 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed hover:text-gray-200 transition-colors duration-300">
                    Discover active prediction markets and participate in decentralized forecasting with real-time insights
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 py-2 max-w-7xl animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                <div className="transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20">
                    <CoinMarketCapCard />
                </div>
                <div className="transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20" style={{animationDelay: '0.1s'}}>
                    <MoveAgentKitCard/>
                </div>
            </div>

            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/3 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
            </div>
        </div>
    )
}

export default MarketList