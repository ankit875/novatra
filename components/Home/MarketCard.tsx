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
        <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-xl p-4 border border-primary/20 hover:border-primary/40 transition-all duration-500 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/10 overflow-hidden h-full min-h-[140px]">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent opacity-50"></div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-xl"></div>
          
          <div className="relative flex items-start space-x-3">
            <div className="flex-shrink-0 relative">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-primary/30 group-hover:scale-105 transition-transform duration-300">
                <img 
                  src={icon || '/assets/images/question-mark.png'} 
                  className="w-8 h-8 rounded-lg object-cover" 
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

            {/* Content Section */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-white font-bold text-base line-clamp-2 group-hover:text-primary/90 transition-colors duration-300 leading-tight max-w-[140px]">
                  {market_name}
                </h3>
                <ArrowRight 
                  size={18} 
                  className="text-gray group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 flex-shrink-0 mt-0.5" 
                />
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1">
                  <Clock size={14} className="text-secondary" />
                  <span className="text-gray-300 font-medium">
                    {close_in ? `${close_in}d` : 'TBD'}
                  </span>
                </div>

                <div className="flex items-center space-x-1">
                  <DollarSign size={14} className="text-green-400" />
                  <img 
                    src="https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png" 
                    className="h-4 w-4" 
                    alt="USDC"
                  />
                  <span className="text-primary font-semibold text-sm">
                    {popular_outcome || '0'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MarketCard;
