import { useState } from "react"

enum Tab {
    Outcome,
    Bet,
    Odds,
    Resolution
}

const Tabs = () => {

    const [tab, setTab] = useState<Tab>(Tab.Outcome)

    return (
        <div className='p-2 px-0 my-8 lg:my-12'>
            <div className={`relative rounded-2xl mx-auto max-w-5xl bg-gradient-to-br from-gray-900/80 to-black/90 mt-6 backdrop-blur-sm border border-gray-800/50 shadow-2xl shadow-primary/5 overflow-hidden`}>
                {/* Background gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 animate-shimmer"></div>
                
                {/* NAV */}
                <div className='relative grid grid-cols-3 text-center text-base sm:text-lg overflow-hidden font-bold leading-7 border-b border-gray-800/50'>
                    <div 
                        className={`cursor-pointer py-6 px-4 transition-all duration-500 hover:scale-105 ${
                            tab === Tab.Outcome 
                                ? "text-white bg-gradient-to-b from-primary/20 to-primary/10 border-b-2 border-primary shadow-lg" 
                                : "text-gray-400 bg-gradient-to-b from-gray-800/30 to-gray-900/30 hover:text-white hover:bg-gradient-to-b hover:from-gray-700/40 hover:to-gray-800/40"
                        }`} 
                        onClick={() => setTab(Tab.Outcome)}
                    >
                        <div className="flex flex-col items-center space-y-1">
                            <span className="text-2xl">🎯</span>
                            <span>Proposing Outcomes</span>
                        </div>
                    </div>
                    <div 
                        className={`cursor-pointer py-6 px-4 transition-all duration-500 hover:scale-105 ${
                            tab === Tab.Bet 
                                ? "text-white bg-gradient-to-b from-primary/20 to-primary/10 border-b-2 border-primary shadow-lg" 
                                : "text-gray-400 bg-gradient-to-b from-gray-800/30 to-gray-900/30 hover:text-white hover:bg-gradient-to-b hover:from-gray-700/40 hover:to-gray-800/40"
                        }`} 
                        onClick={() => setTab(Tab.Bet)}
                    >
                        <div className="flex flex-col items-center space-y-1">
                            <span className="text-2xl">💰</span>
                            <span>Place Your Stake</span>
                        </div>
                    </div>
                    <div 
                        className={`cursor-pointer py-6 px-4 transition-all duration-500 hover:scale-105 ${
                            tab === Tab.Odds 
                                ? "text-white bg-gradient-to-b from-primary/20 to-primary/10 border-b-2 border-primary shadow-lg" 
                                : "text-gray-400 bg-gradient-to-b from-gray-800/30 to-gray-900/30 hover:text-white hover:bg-gradient-to-b hover:from-gray-700/40 hover:to-gray-800/40"
                        }`} 
                        onClick={() => setTab(Tab.Odds)}
                    >
                        <div className="flex flex-col items-center space-y-1">
                            <span className="text-2xl">🏆</span>
                            <span>Market Finalization</span>
                        </div>
                    </div>
                </div>

                <div className='relative p-6 sm:p-8 text-sm sm:text-base'>

                    {tab === Tab.Outcome && (
                        <div className="animate-fade-in-up">
                            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-700/50 mb-6">
                                <video width="auto" className="w-full h-auto" height="auto" autoPlay loop muted>
                                    <source src="./assets/propose-outcome.mp4" type="video/mp4" />
                                </video>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                            </div>
                            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-gray-700/30 backdrop-blur-sm">
                                <h3 className="text-xl font-bold text-white mb-3 flex items-center justify-center">
                                    <span className="mr-2">🎯</span>
                                    Propose Any Outcome
                                </h3>
                                <p className="text-gray-300 leading-relaxed text-lg">
                                    Got a prediction? Create your own — be it a token’s price, a project’s rank, or trading volume trends.
                                    <span className="text-primary font-semibold"> AI-Agent will help analyze the market data</span> and validate whether it fits the round's conditions.
                                </p>
                            </div>
                        </div>
                    )}

                    {tab === Tab.Bet && (
                        <div className="animate-fade-in-up">
                            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-700/50 mb-6">
                                <img className="w-full rounded-xl hover:scale-105 transition-transform duration-500" src={"./assets/images/place-bet.png"} alt="Place Bet Interface" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                            </div>
                            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-gray-700/30 backdrop-blur-sm">
                                <h3 className="text-xl font-bold text-white mb-3 flex items-center justify-center">
                                    <span className="mr-2">💰</span>
                                    Smart Betting Experience
                                </h3>
                                <p className="text-gray-300 leading-relaxed text-lg">
                                    Get instant insights from the <span className="text-primary font-semibold">AI-Agent and explore all outcomes </span> before placing your bet.
                                    Don’t see the prediction you’re looking for? Propose your own and let the market decide.
                                </p>
                            </div>
                        </div>
                    )}

                    {tab === Tab.Odds && (
                        <div className="animate-fade-in-up">
                            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-700/50 mb-6">
                                <img className="w-full rounded-xl hover:scale-105 transition-transform duration-500" src={"./assets/images/market-finalize.png"} alt="Market Finalization" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                            </div>
                            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-gray-700/30 backdrop-blur-sm">
                                <h3 className="text-xl font-bold text-white mb-3 flex items-center justify-center">
                                    <span className="mr-2">🏆</span>
                                    Automated Resolution
                                </h3>
                                <p className="text-gray-300 leading-relaxed text-lg">
                                    Your bets power the prize pool. The <span className="text-primary font-semibold">AI-Agent evaluates outcomes</span>, adjusts probabilities using live data, and ensures every winner gets rewarded fairly.
                                </p>
                            </div>
                        </div>
                    )}

                </div>

            </div>
        </div>
    )
}

export default Tabs