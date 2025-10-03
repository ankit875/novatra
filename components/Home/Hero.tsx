import { ArrowRight, Plus } from "react-feather";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import MarketCard from "./MarketCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { secondsToDDHHMMSS, titleToIcon } from "@/helpers";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar";

// import required modules
import { Navigation, Scrollbar } from "swiper/modules";
import BaseModal from "@/modals/Base";
import useDatabase from "@/hooks/useDatabase";
import Skeleton from "react-loading-skeleton";

interface Outcome {
  title: string;
  totalBetAmount: string;
  resolutionDate: number;
}

const Hero = () => {
  const [modal, setModal] = useState<boolean>(false);
  const [textVisible, setTextVisible] = useState<boolean>(false);

  useEffect(() => {
    if (!localStorage.getItem("new_version")) {
      setModal(true);
    }
    // Trigger text animation after component mounts
    setTimeout(() => setTextVisible(true), 500);
  }, []);

  return (
    <>
      <BaseModal
        title="What’s New?"
        visible={modal}
        close={() => setModal(false)}
        maxWidth="max-w-2xl"
      >
        <p className="text-center text-sm sm:text-lg mt-4 mb-4">
          We&apos;ve made huge updates to make your prediction experience more
          fun:
        </p>
        <div className="text-white/70 text-sm sm:text-lg">
          <li>
            <b>Endlessly Flexible:</b> Propose any outcomes with AI tracking and
            revealing the results automatically
          </li>
          <li>
            <b>Ever-Increasing Payouts:</b> Unclaimed amounts adding to the next
            round&apos;s prize{" "}
          </li>
          <li>
            <b>Robust AI:</b> With OpenAI GPT-4 and supported by AWS AI
            Services{" "}
          </li>
        </div>

        <div className="text-center mt-5">
          <button
            onClick={() => {
              localStorage.setItem("new_version", "true");
              setModal(false);
            }}
            type="button"
            className="btn"
          >
            Close
          </button>
        </div>
        <p className="text-center mx-auto max-w-full sm:max-w-md text-xs sm:text-sm text-secondary/90 font-semibold mt-4 mb-2  ">
          This new version is currently available on the Aptos Testnet, with
          Mainnet and Sui launching soon
        </p>
      </BaseModal>
      <section>
         <div className="relative mb-8 flex justify-center animate-fade-in-up">
          <video 
            className="w-72 h-72 object-cover animate-float hover:scale-105 transition-all duration-500 rounded-full shadow-2xl shadow-primary/20" 
            autoPlay 
            muted 
            loop
            playsInline
          >
            <source src="/assets/hero_video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
        </video>
        {/* Optional overlay for better visual integration */}
        <div className="absolute inset-0 animate-shimmer rounded-full"></div>
      </div>

        <div className="py-2 lg:py-32">
          <div className="container mx-auto px-6">
            {/* Hero Content */}
            <div className="heading mb-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <span className="inline-flex items-center bg-gradient-to-r from-secondary/20 to-secondary/10 px-4 py-2 rounded-full text-white font-semibold text-sm tracking-wide backdrop-blur-sm border border-secondary/20 animate-fade-in-up hover:scale-105 transition-all duration-300">
                  🚀 AI-POWERED PREDICTIONS
                </span>
              </div>
              <h4 className="text-4xl lg:text-5xl font-black mb-6">
                        <span className="bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
                           Predict, Stake, and Earn
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-secondary via-primary to-secondary bg-[length:200%_200%] bg-clip-text text-transparent animate-gradient-x">
                             with Novatra AI
                        </span>
                    </h4>
             
              <p className={`text-xl text-gray-300 font-medium max-w-2xl mx-auto leading-relaxed mb-8 transition-all duration-1000 ${
                textVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4'
              } hover:text-white`}>
                Leverage cutting-edge AI to forecast market outcomes, propose new events, and claim rewards
              </p>
              
              {/* <div className="text-center">
                <button className="btn flex items-center mx-auto">
                  Create New Market
                  <ArrowRight size={18} className="ml-2" />
                </button>
              </div> */}
            </div>
          </div>

          {/* Highlighted Predictions Section */}
          <Highlighted />
        </div>
      </section>
    </>
  );
};

const Highlighted = () => {
  const { getAllOutcomes } = useDatabase();
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);

  useEffect(() => {
    getAllOutcomes().then(setOutcomes);
  }, [getAllOutcomes]);

  return (
    <div className="mt-16 px-6">
      <div className="container mx-auto">
        <div className="heading mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <span className="inline-flex items-center bg-gradient-to-r from-primary/20 to-primary/10 px-4 py-2 rounded-full text-primary font-semibold text-sm tracking-wide backdrop-blur-sm border border-primary/20 animate-fade-in-up hover:scale-105 transition-all duration-300">
             HIGHLIGHTED PREDICTIONS
          </span>
        </div>
        {outcomes.length > 0 && (
          <p className="text-gray-400 text-sm animate-fade-in-up animate-stagger-1 hover:text-gray-300 transition-colors duration-300">
            {outcomes.length} Active Market{outcomes.length !== 1 ? 's' : ''} • {outcomes.length > 5 ? 'Scroll or drag to explore more' : 'Scroll to explore more'}
          </p>
        )}
      </div>

        {/* Simple Swiper with responsive display */}
        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          navigation={{
            enabled: outcomes.length > 3
          }}
          scrollbar={{
            hide: false,
            draggable: true
          }}
          modules={[Navigation, Scrollbar]}
          className="mySwiper highlighted-swiper"
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            1280: {
              slidesPerView: 5,
              spaceBetween: 20,
            },
          }}
        style={{
          paddingBottom: '20px' // Space for scrollbar
        }}
      >
        {outcomes.length === 0 && (
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
              <div className="overflow-hidden opacity-60 animate-pulse">
                <Skeleton height={140} baseColor="#1C2331" highlightColor="#7780A1" />
              </div>
              <div className="overflow-hidden opacity-60 animate-pulse animate-stagger-1">
                <Skeleton height={140} baseColor="#1C2331" highlightColor="#7780A1" />
              </div>
              <div className="overflow-hidden opacity-60 animate-pulse animate-stagger-2">
                <Skeleton height={140} baseColor="#1C2331" highlightColor="#7780A1" />
              </div>
            </div>
          </div>
        )}

        {outcomes.map((item: Outcome, index: number) => {
          const icon = titleToIcon(item.title || "");

          let countdown = "0";

          const diffTime =
            new Date(Number(item.resolutionDate) * 1000).valueOf() -
            new Date().valueOf();
          const totals = Math.floor(diffTime / 1000);
          const { days } = secondsToDDHHMMSS(totals);

          if (Number(days) > 0) {
            countdown = `${days}`;
          }

          return (
            <SwiperSlide key={`${item.title}-${index}`} className="h-auto">
              <MarketCard
                market_name={item.title}
                icon={icon}
                popular_outcome={item.totalBetAmount}
                close_in={countdown}
              />
            </SwiperSlide>
          );
        })}

        {outcomes.length > 10 && (
          <SwiperSlide className="h-auto">
            <Link href="/markets">
              <div className="group cursor-pointer h-full">
                <div className="relative bg-gradient-to-br from-secondary/10 via-secondary/5 to-transparent rounded-xl p-4 border border-secondary/20 hover:border-secondary/40 transition-all duration-500 backdrop-blur-sm hover:shadow-xl hover:shadow-secondary/10 overflow-hidden h-full min-h-[140px] flex flex-col items-center justify-center hover:scale-105 animate-fade-in-up">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent opacity-50 animate-shimmer"></div>
                  <div className="relative text-center">
                    <Plus size={24} className="text-secondary mx-auto mb-2 group-hover:scale-110 transition-transform duration-300 animate-bounce-subtle" />
                    <h3 className="text-white font-bold text-sm mb-1 group-hover:text-secondary transition-colors duration-300">View All</h3>
                    <p className="text-gray-300 text-xs group-hover:text-white transition-colors duration-300">
                      {outcomes.length - 10}+ more markets
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        )}
              </Swiper>
      </div>
    </div>
  );
};

export default Hero;
