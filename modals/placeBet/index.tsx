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
      isAnimating: false,
      showSuccess: false,
    }
  );

  const { outcome, amount, loading, errorMessage, outcomes, isAnimating, showSuccess } = values;

  useEffect(() => {
    dispatch({ outcome: undefined, outcomes: [], isAnimating: true });
    bet &&
      getOutcomes(bet.marketId, bet.roundId).then((outcomes) => {
        const entry = outcomes.find(
          (item: any) => item.onchainId === bet.outcomeId
        );
        setTimeout(() => {
          dispatch({
            outcome: entry,
            outcomes,
            isAnimating: false,
          });
        }, 300);
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

      dispatch({ showSuccess: true });
      setTimeout(() => {
        dispatch({ amount: 0, showSuccess: false });
        close();
      }, 1500);

      setTimeout(() => {
        address && loadBalance(address.toString());
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
      <div className={`transition-all duration-500 ${visible ? 'animate-fade-in-up' : ''}`}>
      {currentProfile && (
        <View>
          <Authenticator>
            {!outcome && (
              <div className="flex flex-col h-[100px] justify-center items-center animate-pulse">
                <SpinningCircles className="h-7 w-7 animate-spin-slow" />
                <p className="text-gray-400 text-sm mt-3 animate-pulse-slow">Loading bet details...</p>
              </div>
            )}

            {outcome && (
              <div className={`transition-all duration-500 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl overflow-hidden mt-4 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300">
                  {/* Header */}
                  <div className="relative bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 p-6 border-b border-white/10 animate-gradient-shift" style={{ backgroundSize: '200% 200%' }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/[0.08] to-transparent animate-shimmer"></div>
                    <div className="relative">
                      <h3 className="text-xl font-bold text-white mb-3 animate-fade-in-up">{outcome.title}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 animate-slide-in-tab animate-stagger-1">
                          <span className="text-sm text-gray-300">Resolution Date:</span>
                          <span className="text-sm text-white font-medium">
                            {new Date(Number(outcome.resolutionDate) * 1000).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2 animate-slide-in-tab animate-stagger-2">
                            <span className="text-sm text-gray-300">Current Odds:</span>
                            <span className="text-sm text-green-400 font-medium animate-pulse-slow">
                              {outcome.weight ? `${minOdds.toLocaleString()}-${maxOdds !== -1 ? maxOdds.toLocaleString() : "10"}` : "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 animate-slide-in-tab animate-stagger-3">
                            <span className="text-sm text-gray-300">Pool Size:</span>
                            <span className="text-sm text-blue-400 font-medium animate-pulse-slow">{totalPool} USDC</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-6 animate-fade-in-up animate-stagger-2">
                  {/* Bet Amount Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between animate-slide-in-tab">
                      <label className="text-lg font-semibold text-white">Enter bet amount</label>
                      <div className="text-sm text-gray-300">
                        Available: <span className="text-white font-medium animate-pulse-slow">{Number(balance).toFixed(3)} USDC</span>
                      </div>
                    </div>
                    
                    <div className="relative animate-slide-in-tab animate-stagger-1">
                      <input
                        value={amount}
                        onChange={(e) => {
                          onAmountChange(Number(e.target.value));
                        }}
                        type="number"
                        placeholder="0.00"
                        className="block w-full p-4 pr-20 text-lg bg-gray-800/50 border border-gray-600/50 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:bg-gray-800/70 hover:border-gray-500 transform hover:scale-[1.01]"
                      />
                      <div className="absolute right-0 top-0 h-full flex items-center pr-4">
                        <div className="flex items-center space-x-2 bg-gray-700/50 px-3 py-1.5 rounded-lg hover:bg-gray-700/70 transition-all duration-200 animate-pulse-slow">
                          <Image
                            className="h-5 w-5 rounded-full animate-bounce-subtle"
                            src="https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png"
                            alt="USDC"
                            width={20}
                            height={20}
                          />
                          <span className="text-white font-medium text-sm">USDC</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end space-x-2 animate-slide-in-tab animate-stagger-2">
                      <OptionBadge
                        onClick={() => onAmountChange(1)}
                        className="cursor-pointer hover:bg-blue-500/20 hover:border-blue-400 hover:text-blue-300 transition-all duration-200 hover:scale-105 active:scale-95"
                      >
                        1 USDC
                      </OptionBadge>
                      <OptionBadge
                        onClick={() =>
                          onAmountChange(
                            Math.floor(Number(balance) * 500) / 1000
                          )
                        }
                        className="cursor-pointer hover:bg-blue-500/20 hover:border-blue-400 hover:text-blue-300 transition-all duration-200 hover:scale-105 active:scale-95"
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
                        className="cursor-pointer hover:bg-blue-500/20 hover:border-blue-400 hover:text-blue-300 transition-all duration-200 hover:scale-105 active:scale-95"
                      >
                        Max
                      </OptionBadge>
                    </div>
                  </div>

                  {/* Potential Payout Information */}
                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-400/20 hover:border-green-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 animate-slide-in-tab animate-stagger-3">
                    <div className="space-y-3">
                      <ListGroup
                        items={[
                          [
                            "Potential payout",
                            `${(minPayout || 0).toLocaleString()}-${(maxPayout || 0).toLocaleString()} USDC`,
                          ],
                          ["Winning fee", "10%"],
                        ]}
                      />
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="space-y-3 animate-slide-in-tab animate-stagger-4">
                    {showSuccess && (
                      <div className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center space-x-2 animate-bounce-subtle">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Bet Placed Successfully!</span>
                      </div>
                    )}
                    {address && !showSuccess && (
                        <button
                        onClick={onBet}
                        disabled={loading}
                        type="button"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl hover:shadow-blue-500/25 border-2 border-blue-500/50 hover:border-blue-400/70"
                        >
                        {loading ? (
                          <Puff stroke="#fff" className="w-5 h-5 animate-spin" />
                        ) : (
                          <span>Place Bet</span>
                        )}
                        </button>
                    )}

                    {!address && !showSuccess && (
                      <div className="w-full animate-slide-in-tab">
                        <WalletSelector />
                      </div>
                    )}

                    {errorMessage && (
                      <div className="bg-red-500/10 border border-red-400/20 rounded-xl p-3 animate-slide-in-tab hover:bg-red-500/15 transition-all duration-200">
                        <div className="text-red-400 text-sm font-medium text-center animate-bounce-subtle">
                          {errorMessage}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Authenticator>
        </View>
      )}
      {!currentProfile && (
        <div className="h-[150px] flex flex-col animate-fade-in-up">
          <Link href="/auth/profile" className="m-auto">
            <button
              type="button"
              className="btn m-auto mb-0 bg-white text-sm flex rounded-lg px-8 py-3 hover:scale-105 active:scale-95 flex-row hover:text-black hover:bg-white transition-all duration-300 hover:shadow-xl animate-bounce-subtle"
            >
              Sign In
            </button>
            <p className="text-center m-auto mt-2 text-gray animate-pulse-slow">
              You need to sign in to continue
            </p>
          </Link>
        </div>
      )}
      </div>
    </BaseModal>
  );
};

export default PlaceBetModal;
