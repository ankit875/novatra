import { useEffect, useCallback, useReducer, useContext } from "react"
import BaseModal from "@/modals/Base"
import type { Schema } from "../amplify/data/resource"
import { Amplify } from "aws-amplify"
import { generateClient } from "aws-amplify/api"
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Puff } from 'react-loading-icons'
import { NovatraContext } from "@/hooks/useNovatra"

const client = generateClient<Schema>()

const Faucet = ({
    visible,
    close
}: any) => {

    const { loadBalance } = useContext(NovatraContext)

    const { account, network } = useWallet()

    const address = account && account.address

    const [values, dispatch] = useReducer(
        (curVal: any, newVal: any) => ({ ...curVal, ...newVal }),
        {
            name: undefined,
            errorMessage: undefined,
            loading: false
        }
    )

    const { name, errorMessage, loading } = values

    useEffect(() => {
        if (address) {
            dispatch({ name: address.toString() })
        }
    }, [address])

    const onMint = useCallback(async () => {

        dispatch({ errorMessage: undefined })

        if (!name || name.length !== 66) {
            dispatch({ errorMessage: "Invalid address" })
            return
        }

        dispatch({ loading: true })
        try {
            const { data } = await client.queries.Faucet({
                name,
            })
            console.log(data)
            dispatch({ loading: false })
            close()

            setTimeout(() => {
                address && loadBalance(address.toString())
            }, 2000)
        } catch (error: any) {
            console.log(error)
            dispatch({ loading: false })
            dispatch({ errorMessage: error.message })
        }
    }, [name, address])

    return (
        <BaseModal
            visible={visible}
            close={close}
            title=""
            maxWidth="max-w-lg"
        >
            <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 p-6 border-b border-white/10">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/[0.08] to-transparent"></div>
                    <div className="relative flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 11 5.16-1.261 9-5.45 9-11V7l-10-5z"/>
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Testnet Faucet</h2>
                            <p className="text-sm text-gray-300 mt-1">Get Mock USDC for testing predictions</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Faucet Info Card */}
                    <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-400/20">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">$</span>
                            </div>
                            <div>
                                <div className="text-white font-semibold">10 Mock USDC</div>
                                <div className="text-xs text-gray-400">Per wallet address</div>
                            </div>
                        </div>
                    </div>

                    {/* Wallet Address Input */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-300">
                            Wallet Address
                        </label>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={name} 
                                onChange={(e) => dispatch({ name: e.target.value })} 
                                placeholder="0x..."
                                className="w-full p-4 bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                        <div className="text-xs text-gray-400">
                            Enter your Aptos wallet address to receive test tokens
                        </div>
                    </div>

                    {/* Claim Button */}
                    <button 
                        disabled={loading} 
                        onClick={onMint} 
                        className="w-full relative group overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center justify-center space-x-3">
                            {loading ? (
                                <>
                                    <Puff stroke="#fff" className="w-5 h-5" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 11 5.16-1.261 9-5.45 9-11V7l-10-5z"/>
                                    </svg>
                                    <span>Claim 10 Mock USDC</span>
                                </>
                            )}
                        </div>
                    </button>

                    {/* Error Message */}
                    {errorMessage && (
                        <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-400/20 rounded-xl p-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-white text-xs">!</span>
                                </div>
                                <p className="text-red-300 text-sm">{errorMessage}</p>
                            </div>
                        </div>
                    )}

                    {/* Help Text */}
                    <div className="bg-gradient-to-r from-white/5 to-white/[0.02] rounded-xl p-4 border border-white/10">
                        <h4 className="text-white font-medium mb-2">How to use:</h4>
                        <ul className="space-y-1 text-sm text-gray-400">
                            <li>• Connect your Aptos wallet</li>
                            <li>• Enter your wallet address above</li>
                            <li>• Click "Claim" to receive test tokens</li>
                            <li>• Use tokens to place predictions</li>
                        </ul>
                    </div>
                </div>
            </div>
        </BaseModal>
    )
}

export default Faucet