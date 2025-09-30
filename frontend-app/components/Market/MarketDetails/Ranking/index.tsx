import WalletBalance from "@/components/Market/MarketDetails/WalletBalance";
import useDatabase from "@/hooks/useDatabase";
import { useState, useEffect } from "react";

const Ranking = ({ currentRound, marketData }: any) => {
  const { getOutcomes } = useDatabase();

  const [outcomes, setOutcomes] = useState([]);

  useEffect(() => {
    currentRound > 0 && marketData
      ? getOutcomes(marketData.id, currentRound).then(setOutcomes)
      : setOutcomes([]);
  }, [marketData, currentRound]);

  return (
    <div className="p-2 pt-0 flex flex-grow flex-col space-y-3">
      <div className="flex-grow flex flex-col">
        <div
          className={`flex-grow flex flex-col border-2 border-white/[0.1] bg-transparent bg-gradient-to-b from-white/5 to-transparent rounded-lg`}
        >
          <h2 className="text-base my-2 lg:text-lg text-center tracking-tight   font-semibold text-white">
            🔥 Top Outcomes
          </h2>
          <div className="px-2 pb-4">
            <table className="w-full">
              <tbody>
                {outcomes
                  .filter((item: any) => item.totalBetAmount)
                  .sort(function (a: any, b: any) {
                    return Number(b.totalBetAmount) - Number(a.totalBetAmount);
                  })
                  .map((item: any, index: number) => {
                    if (index > 2) {
                      return;
                    }

                    return (
                      <tr key={index} className="border-b">
                        <td className="py-2 pr-2 text-white ">{index + 1}.</td>
                        <td className="py-2 line-clamp-1 text-white overflow-hidden">
                          {item.title}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
        <WalletBalance />
      </div>
    </div>
  );
};

export default Ranking;
