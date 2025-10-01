import { useContext, useReducer, useEffect, useCallback } from "react";
import BaseModal from "@/modals/Base";
import { Puff } from "react-loading-icons";
import { Authenticator, View } from "@aws-amplify/ui-react";
import Link from "next/link";
import Image from "next/image";
import useDatabase from "@/hooks/useDatabase";
import { OptionBadge } from "@/components/Badge";
import ListGroup from "@/components/ListGroup";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { SpinningCircles } from "react-loading-icons";
import useAptos from "@/hooks/useAptos";
import { NovatraContext } from "@/hooks/useNovatra";

const PlaceBetModal = ({ visible, close, bet, onchainMarketId = 1 }: any) => {
  const { placeBet } = useAptos();
  const { addPosition, increaseOutcomeBetAmount } = useDatabase();

  const { balance, loadBalance } = useContext(NovatraContext);

  const { getOutcomes } = useDatabase();
  const { account, network } = useWallet();
  const address = account && account.address;

  const { currentProfile }: any = useContext(NovatraContext);
  const [values, dispatch] = useReducer(
    (curVal: any, newVal: any) => ({ ...curVal, ...newVal }),
    {
      amount: 0,
      errorMessage: undefined,
      loading: false,
      outcome: undefined,
      outcomes: [],
    }
  );

  const { outcome, amount, loading, errorMessage, outcomes } = values;

  useEffect(() => {
    dispatch({ outcome: undefined, outcomes: [] });
    bet &&
      getOutcomes(bet.marketId, bet.roundId).then((outcomes) => {
        const entry = outcomes.find(
          (item: any) => item.onchainId === bet.outcomeId
        );
        dispatch({
          outcome: entry,
          outcomes,
        });
      });
  }, [bet]);

  const onAmountChange = (amount: number) => {
    dispatch({
      amount,
    });
  };

  const onBet = useCallback(async () => {
    dispatch({ errorMessage: undefined });

    if (!bet) {
      return;
    }

    if (!amount || amount < 0.1) {
      dispatch({ errorMessage: "Invalid amount" });
      return;
    }

    dispatch({ loading: true });

    try {
      const roundId = bet.roundId;
      const outcomeId = bet.outcomeId;

      await placeBet(onchainMarketId, roundId, outcomeId, amount);

      const userId = currentProfile.id;
      const marketId = bet.marketId;
      const walletAddress = address;

      await addPosition({
        marketId,
        userId,
        roundId,
        outcomeId,
        amount,
        walletAddress,
      });
      await increaseOutcomeBetAmount({ marketId, roundId, outcomeId, amount });

      dispatch({ amount: 0 });
      close();

      setTimeout(() => {
        address && loadBalance(address);
      }, 2000);
    } catch (e: any) {
      console.log(e);
      dispatch({ errorMessage: `${e.message}`, loading: false });
    }

    dispatch({ loading: false });
  }, [amount, bet, address, currentProfile, onchainMarketId]);

  const totalPool = outcomes.reduce((output: number, item: any) => {
    if (item && item.totalBetAmount) {
      output = output + item.totalBetAmount;
    }
    return output;
  }, 0);

  let minPayout = 0;
  let maxPayout = 0;
  let minOdds = 0;
  let maxOdds = 0;

  if (amount > 0 && outcome && outcomes) {
    const totalPoolAfter = totalPool + amount;

    // Assumes all outcomes won
    const totalShares = outcomes.reduce((output: number, item: any) => {
      if (item && item.totalBetAmount) {
        output = output + item.totalBetAmount * item.weight;
      }
      if (item.onchainId === outcome.onchainId) {
        output = output + amount * item.weight;
      }
      return output;
    }, 0);
    const outcomeShares = (outcome.totalBetAmount + amount) * outcome.weight;
    const ratio = outcomeShares / totalShares;

    minPayout =
      ratio * totalPoolAfter * (amount / (outcome.totalBetAmount + amount));

    // when only selected outcome won
    maxPayout = totalPoolAfter * (amount / (outcome.totalBetAmount + amount));
  }

  if (outcome && outcomes) {
    const totalPoolAfter = totalPool + 1;

    // Assumes all outcomes won
    const totalShares = outcomes.reduce((output: number, item: any) => {
      if (item && item.totalBetAmount) {
        output = output + item.totalBetAmount * item.weight;
      }
      if (item.onchainId === outcome.onchainId) {
        output = output + 1 * item.weight;
      }
      return output;
    }, 0);
    const outcomeShares = (outcome.totalBetAmount + 1) * outcome.weight;
    const ratio = outcomeShares / totalShares;

    minOdds = ratio * totalPoolAfter * (1 / (outcome.totalBetAmount + 1));
    maxOdds = totalPoolAfter * (1 / (outcome.totalBetAmount + 1));
  }

  return (
    <BaseModal
      visible={visible}
      close={close}
      title={"Place Your Bet"}
      maxWidth="max-w-xl"
    >
      {currentProfile && (
        <View>
          <Authenticator>
            {!outcome && (
              <div className="flex flex-col h-[100px] justify-center items-center">
                <SpinningCircles className="h-7 w-7" />
              </div>
            )}

            {outcome && (
              <>
                <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl overflow-hidden mt-4">
                  {/* Header */}
                  <div className="relative bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 p-6 border-b border-white/10">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/[0.08] to-transparent"></div>
                    <div className="relative">
                      <h3 className="text-xl font-bold text-white mb-3">{outcome.title}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-300">Resolution Date:</span>
                          <span className="text-sm text-white font-medium">
                            {new Date(Number(outcome.resolutionDate) * 1000).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-300">Current Odds:</span>
                            <span className="text-sm text-green-400 font-medium">
                              {outcome.weight ? `${minOdds.toLocaleString()}-${maxOdds !== -1 ? maxOdds.toLocaleString() : "10"}` : "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-300">Pool Size:</span>
                            <span className="text-sm text-blue-400 font-medium">{totalPool} USDC</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  {/* Bet Amount Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-lg font-semibold text-white">Enter bet amount</label>
                      <div className="text-sm text-gray-300">
                        Available: <span className="text-white font-medium">{Number(balance).toFixed(3)} USDC</span>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <input
                        value={amount}
                        onChange={(e) => {
                          onAmountChange(Number(e.target.value));
                        }}
                        type="number"
                        placeholder="0.00"
                        className="block w-full p-4 pr-20 text-lg bg-gray-800/50 border border-gray-600/50 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                      />
                      <div className="absolute right-0 top-0 h-full flex items-center pr-4">
                        <div className="flex items-center space-x-2 bg-gray-700/50 px-3 py-1.5 rounded-lg">
                          <Image
                            className="h-5 w-5 rounded-full"
                            src="https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png"
                            alt="USDC"
                            width={20}
                            height={20}
                          />
                          <span className="text-white font-medium text-sm">USDC</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end space-x-2">
                      <OptionBadge
                        onClick={() => onAmountChange(1)}
                        className="cursor-pointer hover:bg-blue-500/20 hover:border-blue-400 hover:text-blue-300 transition-all"
                      >
                        1 USDC
                      </OptionBadge>
                      <OptionBadge
                        onClick={() =>
                          onAmountChange(
                            Math.floor(Number(balance) * 500) / 1000
                          )
                        }
                        className="cursor-pointer hover:bg-blue-500/20 hover:border-blue-400 hover:text-blue-300 transition-all"
                      >
                        50%
                      </OptionBadge>
                      <OptionBadge
                        onClick={() =>
                          onAmountChange(
                            balance > 100
                              ? 100
                              : Math.floor(Number(balance) * 1000) / 1000
                          )
                        }
                        className="cursor-pointer hover:bg-blue-500/20 hover:border-blue-400 hover:text-blue-300 transition-all"
                      >
                        Max
                      </OptionBadge>
                    </div>
                  </div>

                  {/* Potential Payout Information */}
                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-400/20">
                    <div className="space-y-3">
                      <ListGroup
                        items={[
                          [
                            "Potential payout",
                            `${minPayout.toLocaleString()}-${maxPayout.toLocaleString()} USDC`,
                          ],
                          ["Winning fee", "10%"],
                        ]}
                      />
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="space-y-3">
                    {address && (
                      <button
                        onClick={onBet}
                        disabled={loading}
                        type="button"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        {loading ? (
                          <Puff stroke="#fff" className="w-5 h-5" />
                        ) : (
                          <span>Place Bet</span>
                        )}
                      </button>
                    )}

                    {!address && (
                      <div className="w-full">
                        <WalletSelector />
                      </div>
                    )}

                    {errorMessage && (
                      <div className="bg-red-500/10 border border-red-400/20 rounded-xl p-3">
                        <div className="text-red-400 text-sm font-medium text-center">
                          {errorMessage}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </Authenticator>
        </View>
      )}
      {!currentProfile && (
        <div className="h-[150px] flex flex-col">
          <Link href="/auth/profile" className="m-auto">
            <button
              type="button"
              className="btn m-auto mb-0 bg-white text-sm flex rounded-lg px-8 py-3 hover:scale-100  flex-row hover:text-black hover:bg-white "
            >
              Sign In
            </button>
            <p className="text-center m-auto mt-2 text-gray">
              You need to sign in to continue
            </p>
          </Link>
        </div>
      )}
    </BaseModal>
  );
};

export default PlaceBetModal;
