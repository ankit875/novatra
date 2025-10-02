
import { useInterval } from "@/hooks/useInterval"
import { secondsToDDHHMMSS } from "@/helpers"
import { useState, useEffect } from "react"
import { Clock, ExternalLink, TrendingUp, Users, DollarSign, Calendar } from "react-feather"

const Overview = ({ market }: any) => {

    const [countdown, setCountdown] = useState<string | undefined>()
    const [interval, setInterval] = useState(100)
    const [period, setPeriod] = useState("")

    useInterval(() => {
        if (market) {
            const now = new Date().valueOf()
            const end = (Number(market.createdTime) * 1000) + (market.round * (Number(market.interval) * 1000))
            const diff = end - now
            if (diff > 0) {
                const totals = Math.floor(diff / 1000)
                const { days, hours, minutes, seconds } = secondsToDDHHMMSS(totals)
                setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`)
            } else {
                setCountdown("0d - Please refresh")
            }
            setInterval(1000)
        }

    }, interval)

    useEffect(() => {
        if (market) {
            const startPeriod = (Number(market.createdTime) * 1000) + (market.round * (Number(market.interval) * 1000))
            const endPeriod = startPeriod + (Number(market.interval) * 1000)
            setPeriod(`${new Date(startPeriod).toDateString()} - ${new Date(endPeriod).toDateString()}`)
        }
    }, [market])
   
        
    return (
        <div className="space-y-6">
            {/* Market Header */}
            <div className="flex items-start justify-between">
                <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-2xl flex items-center justify-center border border-orange-400/30">
                            <img src="/assets/images/coinmarketcap.png" className="w-10 h-10 object-contain" alt="CoinMarketCap" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                COINMARKETCAP<span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">.COM</span>
                            </h1>
                            <a href="https://coinmarketcap.com" target="_blank" className="inline-flex items-center space-x-2 text-orange-400 hover:text-orange-300 transition-colors group">
                                <span className="font-medium">coinmarketcap.com</span>
                                <ExternalLink size={14} className="group-hover:translate-x-0.5 transition-transform" />
                            </a>
                        </div>
                    </div>
                    
                    <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
                        Predict cryptocurrency prices, market cap rankings, and trading volumes for top tokens listed on CoinMarketCap
                    </p>
                </div>

                <div className="flex flex-col items-end space-y-2">
                    <div className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-full border border-green-400/30">
                        <span className="text-green-300 font-semibold text-sm">ACTIVE MARKET</span>
                    </div>
                    <div className="text-right text-sm text-gray-400">
                        Round #{market?.round || '---'}
                    </div>
                </div>
            </div>


            {/* Prediction Period */}
            <div className="bg-gradient-to-r from-white/5 to-white/[0.02] rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                            <Calendar size={20} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">Current Prediction Period</h3>
                            <div className="text-gray-300">{period}</div>
                        </div>
                    </div>
                    
                    {market && countdown && (
                        <div className="text-right">
                                                <div className="flex items-center space-x-1 mb-1">
                                                    <Clock size={12} className="text-blue-400" />
                                                    <span className="text-lg font-bold text-white mb-1">Closes</span>
                                                </div>
                                                <div className="text-gray-300">{countdown}</div>
                                            </div>
                    )}
                </div>

                <div className="mt-4 w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full" style={{ width: '67%' }}></div>
                </div>
                <div className="mt-2 text-xs text-gray-400 text-center">
                    Market period progress
                </div>
            </div>
        </div>
    )
}

export default Overview