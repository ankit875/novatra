import { useState, useEffect, useReducer } from "react"
import { ArrowLeft, ArrowRight } from "react-feather"
import Image from "next/image"
import useDatabase from "@/hooks/useDatabase"
import { secondsToDDHHMMSS, titleToIcon } from "@/helpers"
import BigNumber from "bignumber.js"
import BaseModal from "@/modals/Base"
import Skeleton from 'react-loading-skeleton'


enum SortBy {
    MostPopular = "MostPopular",
    HighestOdds = "HighestOdds",
    LowestOdds = "LowestOdds",
    Newest = "Newest"
}

const AvailableBets = ({ currentRound, marketData, onchainMarket, openBetModal }: any) => {
    console.log('AvailableBets Rendered', marketData,'-----', currentRound) // --- IGNORE ---
    const { getOutcomes } = useDatabase()

    const [outcomes, setOutcomes] = useState([])
    const [loading, setLoading] = useState(false)
    const [current, setCurrent] = useState(0)
    const [tick, setTick] = useState<number>(0)

    const [values, dispatch] = useReducer(
        (curVal: any, newVal: any) => ({ ...curVal, ...newVal }),
        {
            sorted: SortBy.MostPopular,
            infoModal: undefined
        })

    const { sorted, infoModal } = values

    useEffect(() => {
        currentRound && setCurrent(currentRound)
    }, [currentRound])

    useEffect(() => {

        setLoading(true)

        if (current > 0 && marketData) {
            getOutcomes(marketData.id, current).then(
                (outcomes) => {
                    const outcomesWithOdds = outcomes.map((outcome: any, index: number) => {
                        let minOdds = 0
                        let maxOdds = 0
                        let odds = "Medium"

                        if (outcome && outcomes) {
                            const totalPoolAfter = totalPool + 1

                            // Assumes all outcomes won
                            const totalShares = outcomes.reduce((output: number, item: any) => {
                                if (item && item.totalBetAmount) {
                                    output = output + (item.totalBetAmount * (item.weight))
                                }
                                if (item.onchainId === outcome.onchainId) {
                                    output = output + (1 * (item.weight))
                                }
                                return output
                            }, 0)
                            const outcomeShares = (outcome.totalBetAmount + 1) * (outcome.weight)
                            const ratio = outcomeShares / totalShares

                            minOdds = ((ratio) * totalPoolAfter) * (1 / (outcome.totalBetAmount + 1))
                            maxOdds = outcome.totalBetAmount > 0 ? (totalPoolAfter) * (1 / (outcome.totalBetAmount + 1)) : -1

                            if (minOdds >= 3) {
                                odds = "Very High"
                            } else if (minOdds >= 2) {
                                odds = "High"
                            } else if (minOdds >= 1) {
                                odds = "Medium"
                            } else {
                                odds = "Low"
                            }
                        }

                        return {
                            minOdds,
                            maxOdds,
                            odds,
                            ...outcome,
                            totalBetAmount: outcome.totalBetAmount ? outcome.totalBetAmount : 0
                        }
                    })

                    setOutcomes(outcomesWithOdds)
                    setLoading(false)
                }
            )
        } else {
            setOutcomes([])
            setLoading(false)
        }
    }, [marketData, current, tick])

    const totalPool = outcomes.reduce((output: number, item: any) => {
        if (item && item.totalBetAmount) {
            output = output + item.totalBetAmount
        }
        return output
    }, 0)


    let outcomesSorted = []

    if (sorted === SortBy.MostPopular) {
        outcomesSorted = outcomes.sort(function (a: any, b: any) {
            return Number(b.totalBetAmount) - Number(a.totalBetAmount)
        })
    } else if (sorted === SortBy.HighestOdds) {
        outcomesSorted = outcomes.sort(function (a: any, b: any) {
            return Number(b.minOdds) - Number(a.minOdds)
        })
    } else if (sorted === SortBy.LowestOdds) {
        outcomesSorted = outcomes.sort(function (a: any, b: any) {
            return Number(a.minOdds) - Number(b.minOdds)
        })
    } else if (sorted === SortBy.Newest) {
        outcomesSorted = outcomes.sort(function (a: any, b: any) {
            return Number(b.onchainId) - Number(a.onchainId)
        })
    } else {
        outcomesSorted = outcomes
    }

    const poolSize = onchainMarket ? Number(BigNumber(onchainMarket.balance).dividedBy(10 ** 6)) : 0
    const endTimestamp = onchainMarket ? (Number(onchainMarket.createdTime) * 1000) + (current * (Number(onchainMarket.interval) * 1000)) : 0

    let endIn = "0d"
    if (endTimestamp) {
        const now = new Date().valueOf()
        const diff = endTimestamp - now
        if (diff > 0) {
            const totals = Math.floor(diff / 1000)
            const { days, hours } = secondsToDDHHMMSS(totals)
            if (days !== "0") {
                endIn = `${days}d`
            } else {
                endIn = `${hours}h`
            }

        }
    }

    return (
        <>

            <BaseModal
                visible={infoModal}
                close={() => dispatch({ infoModal: undefined })}
                title={"Outcome Results"}
                maxWidth="max-w-xl"
            >
                {infoModal && (
                    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl overflow-hidden mt-4">
                        <div className="relative bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 p-6 border-b border-white/10">
                            <div className="absolute inset-0 bg-gradient-to-r from-white/[0.08] to-transparent"></div>
                            <div className="relative">
                                <h3 className="text-xl font-bold text-white mb-3">{infoModal.title}</h3>
                                
                                {!infoModal.revealedTimestamp && (
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-300">Resolution Date:</span>
                                            <span className="text-sm text-white font-medium">
                                                {new Date(Number(infoModal.resolutionDate) * 1000).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="bg-yellow-500/10 border border-yellow-400/20 rounded-xl p-4">
                                            <div className="flex items-center justify-center space-x-2">
                                                <span className="text-yellow-400">⏳</span>
                                                <span className="text-white font-semibold">The result is not yet revealed</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {infoModal.revealedTimestamp && (
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-300">Checked At:</span>
                                            <span className="text-sm text-white font-medium">
                                                {new Date(Number(infoModal.revealedTimestamp) * 1000).toLocaleDateString()}
                                            </span>
                                        </div>
                                        
                                        <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-gray-600/30">
                                            <div className="grid grid-cols-2 gap-4 mb-3">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm text-gray-300">Result:</span>
                                                    <span className="text-lg">{infoModal.isWon ? "✅" : "❌"}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm text-gray-300">Disputed:</span>
                                                    <span className="text-lg">{infoModal.isDisputed ? "✅" : "❌"}</span>
                                                </div>
                                            </div>
                                            {infoModal.result && (
                                                <div className="text-white text-sm bg-gray-700/30 rounded-lg p-3">
                                                    {infoModal.result}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

            </BaseModal>

            <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl overflow-hidden my-4">
                <div className="relative bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 p-6 border-b border-white/10">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/[0.08] to-transparent"></div>
                    <div className="relative flex items-center justify-between">
                        <button 
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                                current > 1 
                                    ? 'text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 cursor-pointer' 
                                    : 'text-gray-500 cursor-not-allowed'
                            }`}
                            onClick={() => current > 1 && setCurrent(current - 1)}
                            disabled={current <= 1}
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="font-medium">Previous Round</span>
                        </button>
                        
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-white">
                                Round {current} {current === currentRound && <span className="text-green-400">🆕</span>}
                            </h2>
                        </div>
                        
                        {currentRound > current ? (
                            <button 
                                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 transition-all cursor-pointer"
                                onClick={() => setCurrent(current + 1)}
                            >
                                <span className="font-medium">Next Round</span>
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        ) : (
                            <div className="w-[140px]"></div>
                        )}
                    </div>
                </div>

                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                            <span className="text-white font-semibold">Sort by:</span>
                            <select 
                                value={sorted} 
                                onChange={(e: any) => dispatch({ sorted: e.target.value })}
                                className="p-3 px-4 rounded-xl text-sm bg-gray-800/50 border border-gray-600/50 text-black focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                            >
                                <option value={SortBy.MostPopular}>Most Popular</option>
                                <option value={SortBy.HighestOdds}>Highest Odds</option>
                                <option value={SortBy.LowestOdds}>Lowest Odds</option>
                                <option value={SortBy.Newest}>Newest</option>
                            </select>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <span className="text-yellow-400">🏦</span>
                            <span className="text-white font-semibold">
                                Pool Size: <span className="text-green-400">{poolSize.toLocaleString() || 0} USDC</span>
                            </span>
                        </div>
                    </div>
                    
                    <div className="text-center">
                        {currentRound === current && (
                            <div className="inline-flex items-center space-x-2 bg-green-500/10 border border-green-400/20 rounded-full px-4 py-2">
                                <span className="text-green-400">🟢</span>
                                <span className="text-white font-medium">
                                    Accepting bets for the next {endIn}
                                </span>
                            </div>
                        )}
                        {currentRound > current && (
                            <div className="inline-flex items-center space-x-2 bg-yellow-500/10 border border-yellow-400/20 rounded-full px-4 py-2">
                                {(currentRound - current === 1) ? (
                                    <>
                                        <span className="text-yellow-400">🟡</span>
                                        <span className="text-white font-medium">
                                            Determining winning outcomes
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-blue-400">🔵</span>
                                        <span className="text-white font-medium">
                                            All outcomes have been revealed and verified
                                        </span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="my-4 grid grid-cols-3 gap-3">
                {loading === false && outcomesSorted.map((entry: any, index: number) => {

                    return (
                        <div key={index}>
                            <OutcomeCard
                                index={index}
                                item={entry}
                                openBetModal={openBetModal}
                                openInfoModal={() => dispatch({ infoModal: entry })}
                                marketData={marketData}
                                current={current}
                                minOdds={entry.minOdds}
                                maxOdds={entry.maxOdds}
                                odds={entry.odds}
                                isPast={currentRound > current}
                            />
                        </div>
                    )
                })}

                {loading === true && <>
                    <div className='overflow-hidden   opacity-60'>
                        <Skeleton height={120} />
                    </div>
                    <div className='overflow-hidden  opacity-60'>
                        <Skeleton height={120} />
                    </div>
                    <div className='overflow-hidden  opacity-60'>
                        <Skeleton height={120} />
                    </div>
                    <div className='overflow-hidden   opacity-60'>
                        <Skeleton height={120} />
                    </div>
                    <div className='overflow-hidden  opacity-60'>
                        <Skeleton height={120} />
                    </div>
                    <div className='overflow-hidden  opacity-60'>
                        <Skeleton height={120} />
                    </div> 
                    <div className='overflow-hidden   opacity-60'>
                        <Skeleton height={120} />
                    </div>
                    <div className='overflow-hidden  opacity-60'>
                        <Skeleton height={120} />
                    </div>
                    <div className='overflow-hidden  opacity-60'>
                        <Skeleton height={120} />
                    </div>
                </>

                }

            </div>
        </>
    )
}



const OutcomeCard = ({ index, item, current, marketData, openInfoModal, openBetModal, minOdds, maxOdds, odds, isPast }: any) => {

    const icon = titleToIcon(item?.title)

    return (
        <div 
            onClick={() => {
                !isPast && openBetModal({
                    marketId: marketData.id,
                    roundId: current,
                    outcomeId: item.onchainId,
                })
                isPast && openInfoModal()
            }} 
            className="group relative bg-gradient-to-br from-gray-800/40 via-gray-900/60 to-black/80 rounded-xl p-5 border border-gray-600/30 hover:border-blue-500/50 transition-all duration-300 cursor-pointer hover:transform hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/10"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative space-y-4">
                <div className="flex items-start space-x-3">
                    <Image 
                        className="h-10 w-10 rounded-full flex-shrink-0" 
                        src={icon} 
                        alt={item?.title || "Outcome"}
                        width={40}
                        height={40}
                    />
                    <div className="min-w-0 flex-1">
                        <h4 className="text-white font-semibold text-sm line-clamp-2 leading-tight">
                            {item?.title}
                        </h4>
                    </div>
                </div>

                <div className="text-xs text-gray-400">
                    <span className="font-medium">Resolves:</span> {new Date(Number(item.resolutionDate) * 1000).toLocaleDateString()}
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-700/30 rounded-lg p-3">
                        <div className="flex items-center space-x-1">
                            <span className="text-sm">🔥</span>
                            <span className="text-white font-semibold text-sm">{item.totalBetAmount || 0} USDC</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">Bet Volume</div>
                    </div>
                    
                    <div className="bg-gray-700/30 rounded-lg p-3">
                        <div className="flex items-center space-x-1">
                            <span className="text-sm">🔢</span>
                            <span className="text-white font-semibold text-sm">
                                {item.weight ? `${item.weight.toLocaleString()}%` : "N/A"}
                            </span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">Weight</div>
                    </div>
                </div>

                {isPast && (
                    <div className="flex justify-center">
                        {item.revealedTimestamp && (
                            <div className="flex items-center space-x-1">
                                <span className="text-lg">
                                    {item.isWon ? "✅" : item.isDisputed ? "⚠️" : "❌"}
                                </span>
                                <span className="text-sm text-gray-300">
                                    {item.isWon ? "Won" : item.isDisputed ? "Disputed" : "Lost"}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}


export default AvailableBets