import { useReducer, useEffect, useCallback } from "react";
import BaseModal from "@/modals/Base";
import { Puff } from 'react-loading-icons';

import useDatabase from "@/hooks/useDatabase";

const NewOutcomeModal = ({ visible, close, outcomes, marketData, currentRound, updateMessages }: any) => {

    const { addOutcome } = useDatabase()

    const [values, dispatch] = useReducer(
        (curVal: any, newVal: any) => ({ ...curVal, ...newVal }),
        {
            current: 0,
            errorMessage: undefined,
            loading: false
        }
    )

    const { current, errorMessage, loading } = values

    useEffect(() => {
        outcomes.length > 0 && dispatch({ current: 0, errorMessage: undefined })
    }, [outcomes])

    const onAdd = useCallback(async () => {

        dispatch({ errorMessage: undefined })

        if (!marketData || !marketData.id) {
            dispatch({ errorMessage: "Invalid market entry" })
            return
        }

        if (!currentRound) {
            dispatch({ errorMessage: "Invalid current round" })
            return
        }

        dispatch({ loading: true })

        try {

            const marketId = marketData.id
            const roundId = currentRound
            const outcome = outcomes[current]

            await addOutcome({
                marketId,
                roundId,
                title: outcome.title,
                resolutionDate: outcome.resolutionDate
            })

            await updateMessages()

        } catch (e: any) {
            console.log(e)
            dispatch({ errorMessage: `${e.message}`, loading: false })
        }

        dispatch({ loading: false })

        if (current === outcomes.length - 1) {
            dispatch({ current: 0, errorMessage: undefined })
            close()
            return
        }

        dispatch({ current: current + 1 })

    }, [current, outcomes, marketData, currentRound])

    const onNext = useCallback(async () => {

        if (current === (outcomes.length - 1)) {
            close()
            return
        }

        dispatch({ current: current + 1 })

    }, [current])

    return (
        <BaseModal
            visible={visible}
            close={close}
            title={`Add New Outcomes (${outcomes.length})`}
            maxWidth="max-w-xl"
        >
            <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl overflow-hidden mt-4">
                {outcomes.map((outcome: any, index: number) => {

                    if (current !== index) {
                        return
                    }

                    return (
                        <div key={index}>
                            {/* Header */}
                            <div className="relative bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 p-6 border-b border-white/10">
                                <div className="absolute inset-0 bg-gradient-to-r from-white/[0.08] to-transparent"></div>
                                <div className="relative text-center space-y-3">
                                    <h3 className="text-xl font-bold text-white leading-tight">
                                        {outcome.title}
                                    </h3>
                                    <div className="flex items-center justify-center space-x-2">
                                        <span className="text-sm text-gray-300">Resolution Date:</span>
                                        <span className="text-sm text-blue-400 font-medium">
                                            {outcome.resolutionDate}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}

                {/* Action Section */}
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={onAdd} 
                            disabled={loading} 
                            type="button" 
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {loading ? (
                                <Puff stroke="#fff" className="w-5 h-5" />
                            ) : (
                                <>
                                    <span>✅</span>
                                    <span>Add</span>
                                </>
                            )}
                        </button>
                        <button 
                            onClick={onNext} 
                            disabled={loading} 
                            type="button" 
                            className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            <span>❌</span>
                            <span>Skip</span>
                        </button>
                    </div>

                    {errorMessage && (
                        <div className="bg-red-500/10 border border-red-400/20 rounded-xl p-3">
                            <div className="text-red-400 text-sm font-medium text-center">
                                {errorMessage}
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </BaseModal>
    )

}

export default NewOutcomeModal