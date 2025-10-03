import { useState, useEffect } from 'react';
import { Clock, ArrowUpRight, ArrowDownRight } from "react-feather";

import { shortAddress } from "@/helpers";
import useDatabase from '@/hooks/useDatabase';

const MarketActivity = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const { getRecentActivities } = useDatabase()
    const [activities, setActivities] = useState<any>([])

    useEffect(() => {
        getRecentActivities().then(setActivities)
    }, [])

    // Helper function to format time relative to now
    const formatRelativeTime = (timestamp: number) => {
        const now = Math.floor(new Date().valueOf() / 1000);
        const diffInSeconds = now - timestamp

        if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    // Helper to get transaction icon
    const getTransactionIcon = (type: any) => {
        switch (type) {
            case 'bet':
                return <ArrowUpRight className="w-4 h-4 text-green-500" />;
            case 'claim':
                return <ArrowDownRight className="w-4 h-4 text-purple-500" />;
            case 'outcome':
                return <Clock className="w-4 h-4 text-orange-500" />;
            default:
                return <Clock className="w-4 h-4 text-gray-500" />;
        }
    };

    // Helper to get transaction type display text
    const getTransactionTypeText = (type: any) => {
        switch (type) {
            case 'bet': return 'Placed Bet';
            case 'claim': return 'Claimed Prize';
            case 'liquidity': return 'Added Liquidity';
            case 'outcome': return 'Proposed Outcome';
            default: return 'Transaction';
        }
    };

    return (
        <div className="w-full mt-[20px] sm:mt-[40px] bg-black rounded-xl p-6 border border-gray-800 overflow-hidden">
            <div className="flex flex-col px-0 py-3 text-white border-b border-gray-800 mb-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Recent Market Activities</h2>
                <div className="flex flex-row mt-2">
                    <div className='text-gray-400 text-sm font-semibold mr-1'>
                        Smart Contract Address:
                    </div>
                    <a href="https://explorer.aptoslabs.com/account/0x896f7c28432dc223478a0ff3e9325d23f97e8bc261c1896eab85ee20c1f66183?network=testnet" target="_blank" className="text-sm text-white hover:text-white/200 transition-colors">
                        {shortAddress("0x896f7c28432dc223478a0ff3e9325d23f97e8bc261c1896eab85ee20c1f66183", 10, -8)}
                    </a>
                </div>
            </div>

            {isExpanded && (
                <div className="px-0 py-2">
                    {activities.length > 0 ? (
                        <ul className={`divide-y divide-gray-800 space-y-2 ${activities.length > 5 ? 'max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800' : ''}`}>
                            {activities.map((activity: any, index: number) => (
                                <li
                                    key={index}
                                    className={`py-4 px-3 text-white rounded-lg transition-all duration-300 hover:bg-gray-900/50 ${
                                        activity.isUserTx ? 'bg-blue-900/20 border border-blue-800/30' : 'hover:border hover:border-gray-700'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className={`flex flex-row bg-gray-800/50 rounded-lg text-white py-2 px-4 font-normal border border-gray-700 hover:border-secondary/50 transition-all duration-300`}>
                                            <div className="flex-shrink-0 my-auto">
                                                {getTransactionIcon(activity.activity)}
                                            </div>
                                            <div className="flex-1 ml-3 my-auto min-w-0">
                                                <p className="text-sm font-semibold text-white truncate">
                                                    {getTransactionTypeText(activity.activity)}
                                                    {activity.activity === "bet" && (
                                                        <span className={`text-sm ml-2 ${activity.type === 'claim' ? 'text-green-400 font-medium' : 'text-gray-300'}`}>
                                                            {activity.betAmount} USDC
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-end flex-row">
                                            <p className="text-sm my-auto text-gray-400 font-medium">
                                                {formatRelativeTime(Math.floor(new Date(activity.createdAt).valueOf() / 1000))}
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="py-8 text-center">
                            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                                <Clock className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                                <p className="text-gray-400 font-medium">No activity yet in this market</p>
                                <p className="text-gray-500 text-sm mt-1">Be the first to place a bet!</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

const OutcomeText = ({ outcomeId }: any) => {
    const { getOutcomeById } = useDatabase()
    const [text, setText ] = useState("")

    useEffect(() => {
        outcomeId && getOutcomeById(outcomeId).then(
            ({ title }: any) => {
                setText(title)
            }
        )
    },[outcomeId])

    return (
        <p className="text-sm text-gray-300 line-clamp-1 bg-gray-800/30 px-2 py-1 rounded">
            {text}
        </p>
    )
}

export default MarketActivity