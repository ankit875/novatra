import Link from "next/link";
import { Clock, ArrowRight, DollarSign } from "react-feather";

interface IMarketCard {
  market_name: string;
  icon: string;
  popular_outcome?: string;
  close_in?: string;
  chains?: any;
  tag?: string;
}

const MarketCard = ({
  market_name,
  icon,
  popular_outcome,
  close_in,
  chains,
  tag,
}: IMarketCard) => {
  return (
    <Link href="/markets/coinmarketcap">
      <div className="group cursor-pointer w-full h-full">
        <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-xl p-6 border border-primary/20 hover:border-primary/40 transition-all duration-500 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/10 overflow-hidden h-full min-h-[180px] hover:scale-[1.02]">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent opacity-50"></div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-xl"></div>
          <div className="relative flex flex-col h-full">
            <div className="flex items-start space-x-3 mb-4">
              <div className="flex-shrink-0 relative">
                <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-primary/30 group-hover:scale-105 transition-transform duration-300">
                  <img 
                    src={icon || '/assets/images/question-mark.png'} 
                    className="w-9 h-9 rounded-lg object-cover" 
                    alt={market_name || 'Market icon'}
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      if (img.src !== '/assets/images/question-mark.png') {
                        img.src = '/assets/images/question-mark.png';
                      }
                    }}
                  />
                </div>
                {tag && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse border border-black"></div>
                )}
              </div>

              {/* Header with Arrow */}
              <div className="flex-1 flex items-start justify-between min-w-0">
                <h3 className="text-white font-bold text-lg leading-tight group-hover:text-primary/90 transition-colors duration-300 flex-1 pr-2">
                  {market_name}
                </h3>
                <ArrowRight 
                  size={20} 
                  className="text-gray group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 flex-shrink-0 mt-1" 
                />
              </div>
            </div>
            
            {/* Bottom Stats - Fixed at bottom */}
            <div className="mt-auto flex items-center justify-between text-sm pt-2">
              <div className="flex items-center space-x-1.5">
                <Clock size={16} className="text-secondary" />
                <span className="text-gray-300 font-medium">
                  {close_in ? `${close_in}d` : 'TBD'}
                </span>
              </div>

              <div className="flex items-center space-x-1.5">
                <DollarSign size={16} className="text-green-400" />
                <img 
                  src="https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png" 
                  className="h-5 w-5" 
                  alt="USDC"
                />
                <span className="text-primary font-semibold">
                  {popular_outcome || '0'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MarketCard;
