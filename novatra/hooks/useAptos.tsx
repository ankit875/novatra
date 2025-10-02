import { Aptos, AptosConfig, Network, InputViewFunctionData } from "@aptos-labs/ts-sdk"
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import BigNumber from "bignumber.js"
import { useCallback } from "react";

const useAptos = () => {

    const { account, signAndSubmitTransaction} = useWallet()
    const getAptosConfig = (isMainnet = true) => {
        // const aptosConfig = new AptosConfig({ network: isMainnet ? Network.MAINNET : Network.TESTNET })
        const aptosConfig = new AptosConfig({ network: Network.TESTNET })
        const aptos = new Aptos(aptosConfig)
        return aptos
    }

    const getBalanceAPT = useCallback(async (address: any, isMainnet = true) => {

        const aptos = getAptosConfig(false)
        
        try {
            const resource = await aptos.getAccountResource({
                accountAddress: address,
                resourceType: "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>",
            });

            // Now we have access to the response type property
            const value = resource.coin.value;

            return Number((BigNumber(value)).dividedBy(BigNumber(10 ** 8)))
        } catch (e) {
            const payload: InputViewFunctionData = {
                function: `0x1::primary_fungible_store::balance`,
                typeArguments: [
                    "0x1::fungible_asset::Metadata"
                ],
                functionArguments: [
                    address,
                    "0xA"
                ],
            };
            const result = await aptos.view({ payload });
            return result[0] ? Number((BigNumber(`${result[0]}`)).dividedBy(BigNumber(10 ** 8))) : 0;
        }

    }, [])

    const getBalanceUSDC = useCallback(async (address: any) => {

        const aptos = getAptosConfig(false)

        const payload: InputViewFunctionData = {
            function: `0x1::primary_fungible_store::balance`,
            typeArguments: [
                "0x1::fungible_asset::Metadata"
            ],
            functionArguments: [
                address,
                "0x74432d8fdde5be368d1fe3b717046e78bd712cc143000ccba136d2a16eb273be"
            ],
        };
        const result = await aptos.view({ payload });
        return result[0] ? Number((BigNumber(`${result[0]}`)).dividedBy(BigNumber(10 ** 6))) : 0;

    }, [])

    const getMarketInfo = useCallback(async (marketId: number) => {

        const aptos = getAptosConfig(false)

        const payload: InputViewFunctionData = {
            function: `0x896f7c28432dc223478a0ff3e9325d23f97e8bc261c1896eab85ee20c1f66183::generalized::get_market_data`,
            functionArguments: [
                marketId
            ],
        };

        const result = await aptos.view({ payload });
        console.log(result,'result')
        const entry = {
            balance: result[0],
            maxBet: result[1],
            createdTime: result[2],
            interval: result[3]
        }

        const diff = (new Date().valueOf()) - (Number(entry.createdTime) * 1000)
        const interval = Number(entry.interval) * 1000
        const round = Math.floor(diff / interval) + 1

        return {
            round,
            ...entry
        }

    }, [])

    const checkPayoutAmount = useCallback(async (positionId: number) => {

        const aptos = getAptosConfig(false)

        const payload: InputViewFunctionData = {
            function: `0x896f7c28432dc223478a0ff3e9325d23f97e8bc261c1896eab85ee20c1f66183::generalized::check_payout_amount`,
            functionArguments: [
                positionId
            ],
        };

        try {
            const result = await aptos.view({ payload }); 
            return Number(result[0])
        } catch (e) { 
            return 0
        }
 
    }, [])

    

    const placeBet = useCallback(async (marketId: number, roundId: number, outcomeId: number, betAmount: number) => {

        if (!account) {
            return
        }

        const aptos = getAptosConfig(false)

                const tx = {
                    type: "entry_function_payload",
                    function: "0x896f7c28432dc223478a0ff3e9325d23f97e8bc261c1896eab85ee20c1f66183::generalized::place_bet",
                    type_arguments: [],
                    arguments: [
                        String(marketId),                                // u64 as string
                        String(roundId),                                 // u64 as string
                        String(outcomeId),                               // u64 as string
                        BigNumber(betAmount).multipliedBy(1e6).toFixed(0) // amount u64 string
                    ],
            };

            const res = await (window as any).aptos.signAndSubmitTransaction(tx);
            await aptos.waitForTransaction({ transactionHash: res.hash });
            return res.hash

    }, [account])

    const claim = useCallback(async (positionId: number) => {

        if (!account) {
            return
        }

        const aptos = getAptosConfig(false)

        const transaction: any = {
            data: {
                function: `0x896f7c28432dc223478a0ff3e9325d23f97e8bc261c1896eab85ee20c1f66183::generalized::claim_prize`,
                functionArguments: [
                    positionId
                ]
            }
        }

        const response = await signAndSubmitTransaction(transaction);
        // wait for transaction
        await aptos.waitForTransaction({ transactionHash: response.hash });

        return response.hash

    }, [account])

    const refund = useCallback(async (positionId: number) => {

        if (!account) {
            return
        }

        const aptos = getAptosConfig(false)

        const transaction: any = {
            data: {
                function: `0x896f7c28432dc223478a0ff3e9325d23f97e8bc261c1896eab85ee20c1f66183::generalized::refund`,
                functionArguments: [
                    positionId
                ]
            }
        }

        const response = await signAndSubmitTransaction(transaction);
        // wait for transaction
        await aptos.waitForTransaction({ transactionHash: response.hash });

        return response.hash

    }, [account])

    return {
        getBalanceAPT,
        getBalanceUSDC,
        getMarketInfo,
        placeBet,
        checkPayoutAmount,
        claim,
        refund
    }
}

export default useAptos