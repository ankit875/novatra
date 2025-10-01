import { ArrowRight, Plus } from "react-feather";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import MarketCard from "./MarketCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { secondsToDDHHMMSS, titleToIcon } from "@/helpers";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Navigation } from "swiper/modules";
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

  useEffect(() => {
    if (!localStorage.getItem("new_version")) {
      setModal(true);
    }
  }, []);

  return (
    <>
      <BaseModal
        title="🚀 What’s New?"
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
            className="btn rounded-lg  bg-white py-3.5 w-[120px]  hover:text-black hover:bg-white "
          >
            close
          </button>
        </div>
        <p className="text-center mx-auto max-w-full sm:max-w-md text-xs sm:text-sm text-secondary/90 font-semibold mt-4 mb-2  ">
          This new version is currently available on the Aptos Testnet, with
          Mainnet and Sui launching soon
        </p>
      </BaseModal>
      <section className=" bg-no-repeat" style={{ backgroundColor: 'rgb(9 69 162)' }}>
        <div className="py-24 bg-gradient-to-r from-secondary/20 via-primary/10 to-secondary/20 lg:py-32">
          <div className="container mx-auto px-6">
        <div className="flex">
          <div className="mx-auto text-center">
            <h1
          className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl"
          data-aos="fade-up"
          data-aos-duration="1000"
            >
                  <span className="block xl:inline">
                    <span className="mb-1 block">Predict, Stake, and Earn</span>
                    <span className="bg-gradient-to-r from-secondary/80 to-secondary/40 bg-clip-text text-transparent">
                      with Novatra AI
                    </span>
                  </span>
                </h1>
              </div>
            </div>
            <div className="mx-2 sm:mx-6">
              <p className="mt-[20px] sm:mt-[40px] text-center mx-auto mb-[20px] max-w-[700px] text-sm sm:text-lg lg:text-xl font-normal sm:font-semibold text-gray">
                Leverage cutting-edge AI to forecast market outcomes, propose new events, and claim rewards
              </p>
              
              <div className="text-center mt-8">
                <button className="bg-gradient-to-r from-secondary to-primary hover:from-secondary/80 hover:to-primary/80 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center mx-auto">
                  Create New Market
                  <ArrowRight size={18} className="ml-2" />
                </button>
              </div>
            </div>
            
          </div>

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
    <div className="px-6 sm:px-1">
      <div className="text-center text-primary font-normal mb-2 sm:mb-4 text-sm sm:text-base tracking-widest uppercase">
        highlighted markets
      </div>

      <Swiper
        spaceBetween={30}
        centeredSlides={false}
        slidesPerView={5}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={false}
        navigation={true}
        modules={[Autoplay, Navigation]}
        className="mySwiper"
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 5,
            spaceBetween: 30,
          },
        }}
      >
        {outcomes.length === 0 && (
          <div className="grid grid-cols-3 gap-5 max-w-5xl mx-auto">
            <div className="overflow-hidden opacity-60">
              <Skeleton height={120} baseColor="#1C2331" highlightColor="#7780A1" />
            </div>
            <div className="overflow-hidden opacity-60">
              <Skeleton height={120} baseColor="#1C2331" highlightColor="#7780A1" />
            </div>
            <div className="overflow-hidden opacity-60">
              <Skeleton height={120} baseColor="#1C2331" highlightColor="#7780A1" />
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
            <SwiperSlide key={index}>
              <MarketCard
                market_name={item.title}
                icon={icon}
                popular_outcome={item.totalBetAmount}
                close_in={countdown}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default Hero;
