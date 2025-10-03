
import { useInterval } from "@/hooks/useInterval"
import { secondsToDDHHMMSS } from "../../../helpers"
import { useState, useEffect } from "react"
import { Clock, TrendingUp, DollarSign, Calendar, Zap, Activity } from "react-feather"

const OverviewMoveAgentKit = ({ market }: any) => {

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
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-xl flex items-center justify-center border border-blue-400/30">
                        <img src="/assets/images/move-agent-kit.png" className="w-8 h-8 object-contain" alt="Move Agent Kit" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">
                            APTOS<span className="text-blue-400">{` `}DEFI</span>
                        </h1>
                        <a href="https://metamove.build/" target="_blank" className="text-xs text-blue-400 hover:text-blue-300">
                            metamove.build ↗
                        </a>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="px-3 py-1 bg-blue-500/20 rounded-full border border-blue-400/30">
                        <span className="text-blue-300 font-semibold text-xs">AI-POWERED</span>
                    </div>
                    <Zap size={16} className="text-blue-400" />
                </div>
            </div>

            <p className="text-gray-300 text-sm">
                Predict yields, TVL across major DeFi protocols including Joule, Thala, LiquidSwap powered by Move Agent Kit
            </p>


            {market && countdown && (
                <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-400/20">
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="flex items-center space-x-1 mb-1">
                                <Calendar size={12} className="text-blue-400" />
                                <span className="text-xs font-medium text-white">DeFi Period</span>
                            </div>
                            <div className="text-xs text-gray-300 truncate">{period}</div>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center space-x-1 mb-1">
                                <Clock size={12} className="text-blue-400" />
                                <span className="text-xs text-gray-400">Closes</span>
                            </div>
                            <div className="text-xs font-bold text-blue-400">{countdown}</div>
                        </div>
                    </div>
                    <div className="mt-2 w-full bg-gray-700 rounded-full h-1">
                        <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: '73%' }}></div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default OverviewMoveAgentKit