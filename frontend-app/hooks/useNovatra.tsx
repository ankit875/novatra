import { createContext, useCallback, ReactNode, useMemo, useReducer } from "react"
import useDatabase from "./useDatabase";
import useAptos from "./useAptos";


type novatraContextType = {
    currentNetwork: string
    balance: number,
    setToAptos: () => void
    setNetwork: (network: string) => void
    loadDefault: () => void
    loadProfile: (userId: string) => void
    currentProfile: any,
    loadBalance: (userAddress: string) => void
};

const novatraContextDefaultValues: novatraContextType = {
    currentNetwork: "aptos",
    currentProfile: undefined,
    balance: 0,
    setToAptos: () => { },
    loadDefault: () => { },
    setNetwork: (network: string) => { },
    loadProfile: (userId: string) => { },
    loadBalance: (userAddress: string) => { }
};

type Props = {
    children: ReactNode;
};


export const NovatraContext = createContext<novatraContextType>(novatraContextDefaultValues)

const Provider = ({ children }: Props) => {

    const { getBalanceUSDC } = useAptos()

    const { getProfile } = useDatabase()

    const [values, dispatch] = useReducer(
        (curVal: any, newVal: any) => ({ ...curVal, ...newVal }),
        {
            ...novatraContextDefaultValues
        }
    )

    const { currentNetwork, currentProfile, balance } = values

    const loadDefault = useCallback(() => {
        if (localStorage.getItem("novatraDefaultNetwork")) {
            dispatch({
                currentNetwork: localStorage.getItem("novatraDefaultNetwork")
            })
        } else {
            dispatch({
                currentNetwork: "aptos"
            })
        }
    }, [])

    const loadProfile = useCallback((userId: string) => {

        getProfile(userId).then(
            (currentProfile: any) => {
                dispatch({
                    currentProfile
                })
            }
        )

    }, [])

    const loadBalance = useCallback((userAddress: string) => {
        getBalanceUSDC(userAddress).then(
            (balance: number) => {
                dispatch({
                    balance
                })
            }
        )
    }, [])

    const novatraContext: any = useMemo(
        () => ({
            currentNetwork,
            currentProfile,
            setNetwork: (network: string) => {
                dispatch({
                    currentNetwork: network
                })
            },
            loadDefault,
            loadProfile,
            balance,
            loadBalance
        }),
        [
            currentNetwork,
            currentProfile,
            balance
        ]
    )

    return (
        <NovatraContext.Provider value={novatraContext}>
            {children}
        </NovatraContext.Provider>
    )
}

export default Provider
