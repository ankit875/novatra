import {
  useContext,
  useReducer,
  useEffect,
  useState,
  useCallback,
} from "react";
import { Puff } from "react-loading-icons";
import Link from "next/link";
import useDatabase from "@/hooks/useDatabase";
import { BadgePurple } from "@/components/Badge";
import { shortAddress } from "@/helpers";
import BaseModal from "@/modals/Base";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import useAptos from "@/hooks/useAptos";
import { NovatraContext } from "@/hooks/useNovatra";

enum SortBy {
  All = "All",
  Active = "Active",
  Resolved = "Resolved",
}

const MyBetPositions = ({ marketData, onchainMarket, currentRound }: any) => {
  const { account, network } = useWallet();
  const address = account && account.address;

  const { currentProfile }: any = useContext(NovatraContext);

  const { getMyPositions, updatePosition } = useDatabase();
  const { claim, refund } = useAptos();
  const [positions, setPositions] = useState<any>([]);

  const [values, dispatch] = useReducer(
    (curVal: any, newVal: any) => ({ ...curVal, ...newVal }),
    {
      sorted: SortBy.All,
      rounds: [],
      modal: undefined,
      loading: false,
      errorMessage: undefined,
      tick: 1,
    }
  );

  const { sorted, rounds, modal, loading, errorMessage, tick } = values;

  useEffect(() => {
    currentProfile &&
      marketData &&
      getMyPositions(currentProfile.id, marketData.id).then(setPositions);
  }, [currentProfile, marketData, tick]);

  useEffect(() => {
    positions && fetchRounds(positions);
  }, [positions]);

  const fetchRounds = useCallback(
    async (positions: any) => {
      const roundIds = positions.reduce((output: any, item: any) => {
        if (output.indexOf(item.roundId) === -1) {
          output.push(item.roundId);
        }
        return output;
      }, []);
      const rounds = await marketData.rounds();
      const thisRounds: any = rounds.data.filter((item: any) =>
        roundIds.includes(item.onchainId)
      );
      dispatch({
        rounds: thisRounds,
      });
    },
    [marketData]
  );

  const totalAmount = positions.reduce((output: number, item: any) => {
    return output + item.betAmount;
  }, 0);

  let filter = [];

  if (sorted === SortBy.Active) {
    filter = positions.filter((item: any) => item.roundId === currentRound);
  } else if (sorted === SortBy.Resolved) {
    filter = positions.filter((item: any) => currentRound - 1 > item.roundId);
  } else {
    filter = positions;
  }

  const onClaim = useCallback(async () => {
    dispatch({ errorMessage: undefined });

    if (!modal) {
      return;
    }

    dispatch({ loading: true });

    try {
      const positionId = modal.position.id;
      const onchainId = modal.position.onchainId;

      if (!modal.outcome.isDisputed) {
        await claim(onchainId);
      } else {
        await refund(onchainId);
      }

      await updatePosition(positionId);

      dispatch({ modal: undefined, tick: tick + 1 });
    } catch (e: any) {
      console.log(e);
      dispatch({ errorMessage: `${e}`, loading: false });
    }

    dispatch({ loading: false });
  }, [modal, tick]);

  return (
    <div>
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
      {currentProfile && (
        <>
          <BaseModal
            visible={modal}
            close={() => dispatch({ modal: undefined })}
            title={"Position Details"}
            maxWidth="max-w-xl"
          >
            {modal && (
              <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl overflow-hidden mt-4">
                <div className="relative bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 p-6 border-b border-white/10">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/[0.08] to-transparent"></div>
                  <div className="relative">
                    <h3 className="text-xl font-bold text-white mb-3">{modal?.outcome?.title}</h3>
                    
                    {!modal?.outcome?.revealedTimestamp && (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-300">Resolution Date:</span>
                          <span className="text-sm text-white font-medium">
                            {new Date(Number(modal?.outcome?.resolutionDate) * 1000).toLocaleDateString()}
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

                    {modal?.outcome?.revealedTimestamp && (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-300">Checked At:</span>
                          <span className="text-sm text-white font-medium">
                            {new Date(Number(modal?.outcome?.revealedTimestamp) * 1000).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-gray-600/30">
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-300">Result:</span>
                              <span className="text-lg">{modal?.outcome?.isWon ? "✅" : "❌"}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-300">Disputed:</span>
                              <span className="text-lg">{modal?.outcome?.isDisputed ? "✅" : "❌"}</span>
                            </div>
                          </div>
                          {modal?.outcome?.result && (
                            <div className="text-white text-sm bg-gray-700/30 rounded-lg p-3">
                              {modal?.outcome?.result}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {modal?.outcome?.revealedTimestamp && (
                  <div className="p-6 space-y-4">
                    <div className="space-y-3">
                      {address && (
                        <button
                          onClick={onClaim}
                          disabled={
                            loading ||
                            (!modal?.outcome?.isWon &&
                              !modal?.outcome?.isDisputed)
                          }
                          type="button"
                          className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 ${
                            !modal?.outcome?.isWon && !modal?.outcome?.isDisputed && "opacity-60"
                          }`}
                        >
                          {loading ? (
                            <Puff stroke="#fff" className="w-5 h-5" />
                          ) : (
                            <span>
                              {modal?.outcome?.isDisputed ? "Refund" : "Claim"}
                            </span>
                          )}
                        </button>
                      )}

                      {!address && (
                        <div className="w-full">
                          <WalletSelector />
                          <style jsx>{`
                            :global(.wallet-button) {
                              width: 100% !important;
                              z-index: 1;
                              border-width: 0px;
                              background: linear-gradient(to right, #2563eb, #9333ea) !important;
                              color: white !important;
                              border-radius: 0.75rem !important;
                              padding: 1rem 1.5rem !important;
                              font-weight: 600 !important;
                            }
                            :global(.wallet-button:hover) {
                              background: linear-gradient(to right, #1d4ed8, #7c3aed) !important;
                            }
                          `}</style>
                        </div>
                      )}

                      {errorMessage && (
                        <div className="bg-red-500/10 border border-red-400/20 rounded-xl p-3">
                          <div className="text-red-400 text-sm font-medium text-center">
                            {errorMessage}
                          </div>
                        </div>
                      )}

                      {!errorMessage && (
                        <div className="bg-blue-500/10 border border-blue-400/20 rounded-xl p-3">
                          <div className="text-blue-400 text-sm font-medium text-center">
                            Ensure your wallet is {shortAddress(modal?.position?.walletAddress)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </BaseModal>

          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl overflow-hidden my-4">
            <div className="relative bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 p-6 border-b border-white/10">
              <div className="absolute inset-0 bg-gradient-to-r from-white/[0.08] to-transparent"></div>
              <div className="relative flex items-center justify-center">
                <h2 className="text-2xl font-bold text-white">All Positions</h2>
              </div>
            </div>

            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-white font-semibold">Filters:</span>
                  <select
                    value={sorted}
                    onChange={(e: any) => {
                      dispatch({ sorted: e.target.value });
                    }}
                    className="p-3 px-4 rounded-xl text-sm bg-gray-800/50 border border-gray-600/50 text-black focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  >
                    <option value={SortBy.All}>All</option>
                    <option value={SortBy.Active}>Active</option>
                    <option value={SortBy.Resolved}>Resolved</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-400">💰</span>
                  <span className="text-white font-semibold">
                    Total Bet: <span className="text-green-400">{totalAmount.toLocaleString()} USDC</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="my-4 grid grid-cols-3 gap-3">
            {filter
              .sort((a: any, b: any) => {
                return a.roundId - b.roundId;
              })
              .map((position: any, index: number) => {
                return (
                  <div key={index}>
                    <PositionCard
                      position={position}
                      rounds={rounds}
                      market={onchainMarket}
                      openModal={(modal: any) => dispatch({ modal })}
                    />
                  </div>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
};

const PositionCard = ({ position, rounds, market, openModal }: any) => {
  const [data, setData] = useState<any>(undefined);
  const { getOutcomeById } = useDatabase();
  const { checkPayoutAmount } = useAptos();

  useEffect(() => {
    position && getOutcomeById(position.predictedOutcome).then(setData);
  }, [position]);

  const currentRound = rounds.find(
    (item: any) => item.onchainId === position.roundId
  );

  const startPeriod =
    Number(market.createdTime) * 1000 +
    position.roundId * (Number(market.interval) * 1000);
  const endPeriod = startPeriod + Number(market.interval) * 1000;

  const isEnded = new Date().valueOf() > endPeriod;
  const isActive = startPeriod > new Date().valueOf();

  useEffect(() => {
    currentRound &&
      currentRound.resolvedTimestamp &&
      checkPayoutAmount(position.onchainId);
  }, [currentRound, position]);

  const getStatusInfo = () => {
    if (isActive) return { icon: "🟢", text: "Active", color: "text-green-400" };
    if (!isActive && !isEnded) return { icon: "🔵", text: "Outcome Pending", color: "text-blue-400" };
    if (data && isEnded) {
      if (data.isWon || data.isDisputed) {
        return { icon: "🟡", text: "Resolved – Claimable", color: "text-yellow-400" };
      }
      return { icon: "🔴", text: "Resolved – Lost", color: "text-red-400" };
    }
    return { icon: "⏳", text: "Pending", color: "text-gray-400" };
  };

  const status = getStatusInfo();

  return (
    <div
      onClick={() => {
        data &&
          openModal({
            round: currentRound,
            position: position,
            outcome: data,
          });
      }}
      className="group relative bg-gradient-to-br from-gray-800/40 via-gray-900/60 to-black/80 rounded-xl p-5 border border-gray-600/30 hover:border-blue-500/50 transition-all duration-300 cursor-pointer hover:transform hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/10"
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <h4 className="text-white font-semibold text-sm line-clamp-2 leading-tight">
            {data?.title}
          </h4>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-300">
              Round ({position.roundId})
            </span>
            <span className="text-gray-400">
              {new Date(startPeriod).toLocaleDateString()} - {new Date(endPeriod).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Bet Amount */}
        <div className="bg-gray-700/30 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Bet Amount:</span>
            <span className="text-white font-semibold">{position.betAmount.toLocaleString()} USDC</span>
          </div>
        </div>

        {/* Status and Claimed indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{status.icon}</span>
            <span className={`text-sm font-medium ${status.color}`}>
              {status.text}
            </span>
          </div>
          
          {position.isClaimed && (
            <div className="bg-green-500/20 border border-green-400/30 rounded-full px-2 py-1">
              <span className="text-green-400 text-xs font-semibold uppercase">Claimed</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default MyBetPositions;
