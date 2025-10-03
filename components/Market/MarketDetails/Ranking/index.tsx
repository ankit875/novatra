import WalletBalance from "@/components/Market/MarketDetails/WalletBalance";
import useDatabase from "@/hooks/useDatabase";
import { useState, useEffect } from "react";
import { Award, TrendingUp, DollarSign } from "react-feather";

const Ranking = ({ currentRound, marketData }: any) => {
  const { getOutcomes } = useDatabase();

  const [outcomes, setOutcomes] = useState([]);

  useEffect(() => {
    currentRound > 0 && marketData
      ? getOutcomes(marketData.id, currentRound).then(setOutcomes)
      : setOutcomes([]);
  }, [marketData, currentRound]);

  const allOutcomes = outcomes
    .filter((item: any) => item.totalBetAmount)
    .sort(function (a: any, b: any) {
      return Number(b.totalBetAmount) - Number(a.totalBetAmount);
    });

  const getRankIcon = (index: number) => {
    switch(index) {
      case 0: return "🥇";
      case 1: return "🥈";
      case 2: return "🥉";
      default: return "🏆";
    }
  };

  const getRankColor = (index: number) => {
    const colors = [
      "from-yellow-500/20 to-yellow-600/20 border-yellow-400/30",
      "from-gray-400/20 to-gray-500/20 border-gray-400/30", 
      "from-orange-500/20 to-orange-600/20 border-orange-400/30",
      "from-blue-500/20 to-blue-600/20 border-blue-400/30",
      "from-purple-500/20 to-purple-600/20 border-purple-400/30",
      "from-green-500/20 to-green-600/20 border-green-400/30",
      "from-red-500/20 to-red-600/20 border-red-400/30",
      "from-indigo-500/20 to-indigo-600/20 border-indigo-400/30"
    ];
    return colors[index % colors.length];
  };
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex items-center space-x-2 mb-4">
          <Award size={16} className="text-yellow-400" />
          <h3 className="text-sm font-bold text-white">Top Predictions</h3>
        </div>
        
        {allOutcomes.length > 0 ? (
          <div className={`space-y-2 ${allOutcomes.length > 3 ? 'max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800' : ''}`}>
            {allOutcomes.map((item: any, index: number) => (
              <div 
                key={index}
                className={`bg-gradient-to-r ${getRankColor(index)} rounded-lg p-3 border`}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 text-lg">
                    {getRankIcon(index)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white line-clamp-2 leading-tight">
                      {item.title}
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center space-x-1">
                        <DollarSign size={12} className="text-green-400" />
                        <span className="text-xs text-gray-300">
                          ${Number(item.totalBetAmount).toFixed(1)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp size={12} className="text-blue-400" />
                        <span className="text-xs text-gray-300">
                          #{index + 1}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gradient-to-r from-gray-500/10 to-gray-600/10 rounded-lg p-4 border border-gray-400/20 text-center">
            <Award size={24} className="text-gray-400 mx-auto mb-2" />
            <p className="text-xs text-gray-400">No predictions yet</p>
          </div>
        )}
      </div>

      <WalletBalance />
    </div>
  );
};

export default Ranking;
