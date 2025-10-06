import { useState } from 'react';
import AnimateHeight from 'react-animate-height';
import { FaTwitter, FaMedium, FaGithub } from 'react-icons/fa6';
 


const DATA = [
  {
    id: 1,
    question: "What makes Novatra’s AI-Agent different from other prediction platforms?",
    answer:
      "Unlike traditional prediction markets, Novatra uses an AI-Agent that analyzes refines data, probabilities, and ensures fair, transparent market outcomes — all without manual bias.",
  },
  {
    id: 2,
    question: "How does Novatra ensure fairness in predictions?",
    answer:
      "The AI-Agent continuously reviews live market data and assigns outcome weights algorithmically, minimizing manipulation and maintaining a level playing field for all participants.",
  },
  {
    id: 3,
    question: "Do I need crypto to start predicting?",
    answer:
      "Yes, a small amount of tokens is required to place predictions. Your participation contributes to the prize pool and helps strengthen the ecosystem.",
  },
  {
    id: 4,
    question: "Can I create my own prediction topic?",
    answer:
      "Absolutely! You can propose your own outcomes — from token prices and rankings to event-driven predictions. The AI-Agent validates and weights them instantly.",
  },
  {
    id: 5,
    question: "How often does the AI-Agent update its analysis?",
    answer:
      "The AI-Agent periodically fetches data, re-evaluates market outcomes, and updates probabilities to reflect the latest market trends and conditions.",
  },
  {
    id: 6,
    question: "What data sources does the AI-Agent use?",
    answer:
      "It gathers insights from trusted on-chain and off-chain sources, including market feeds and analytic APIs, to ensure predictions remain accurate and transparent.",
  },
  {
    id: 7,
    question: "How are rewards distributed to winners?",
    answer:
      "Once a round concludes, the AI-Agent determines the winning outcome based on verified data, and payouts are automatically distributed according to each user’s stake.",
  },
  {
    id: 8,
    question: "What’s next for Novatra?",
    answer:
      "Our roadmap includes mainnet deployment, multi-chain support, and advanced AI integrations that will enable automated market creation and real-time social predictions.",
  },
];

const Faq = () => {

    const [active, setActive] = useState<any>(0);

    return (
        <section className="py-14 pb-8 lg:pt-[100px]">
            <style jsx>{`
                @keyframes gradient-x {
                    0%, 100% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                }
                .animate-gradient-x {
                    animation: gradient-x 3s ease infinite;
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }
            `}</style>
            <div className="container">
                <div className="heading text-center">
                    <div className="flex items-center justify-center mb-4">
                        <span className="inline-flex items-center bg-gradient-to-r from-secondary/20 to-secondary/10 px-4 py-2 rounded-full text-white font-semibold text-sm tracking-wide backdrop-blur-sm border border-secondary/20 animate-float">
                            ❓ FAQS
                        </span>
                    </div>
                    <h4 className="text-4xl lg:text-5xl font-black mb-6">
                        <span className="bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
                            Frequently Asked
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-secondary via-primary to-secondary bg-[length:200%_200%] bg-clip-text text-transparent animate-gradient-x">
                            Questions
                        </span>
                    </h4>
                </div>
                <div className="mx-2 sm:mx-auto lg:w-[730px]">
                    {DATA.map((faq: any, i: number) => {
                        return (
                            <div key={i} className="mt-6 border-0 border-b-2 border-gray-700 bg-transparent">
                                <button
                                    type="button"
                                    className="relative !flex w-full items-center justify-between gap-2 py-2.5 text-lg font-bold text-white ltr:text-left rtl:text-right"
                                    onClick={() => setActive(active === i ? null : i)}
                                >
                                    <div>{faq.question}</div>
                                    <div
                                        className={`grid h-6 w-6 flex-shrink-0 place-content-center rounded-full border-2 border-gray-400 text-gray-400 transition ${active === i ? '!border-white !text-white' : ''
                                            }`}
                                    >
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                className={active === i ? 'hidden' : ''}
                                                d="M6.09961 0.500977C6.65189 0.500977 7.09961 0.948692 7.09961 1.50098L7.09961 10.501C7.09961 11.0533 6.65189 11.501 6.09961 11.501H5.89961C5.34732 11.501 4.89961 11.0533 4.89961 10.501L4.89961 1.50098C4.89961 0.948692 5.34732 0.500977 5.89961 0.500977H6.09961Z"
                                                fill="currentColor"
                                            />
                                            <path
                                                d="M0.5 5.90039C0.5 5.34811 0.947715 4.90039 1.5 4.90039H10.5C11.0523 4.90039 11.5 5.34811 11.5 5.90039V6.10039C11.5 6.65268 11.0523 7.10039 10.5 7.10039H1.5C0.947715 7.10039 0.5 6.65268 0.5 6.10039V5.90039Z"
                                                fill="currentColor"
                                            />
                                        </svg>
                                    </div>
                                </button>
                                <AnimateHeight duration={600} height={active === i ? 'auto' : 0}>
                                    <div className="lg:w-4/5">
                                        <p className="px-0 pb-5 pt-0 text-sm font-bold leading-[18px] text-gray-300">{faq.answer}</p>
                                    </div>
                                </AnimateHeight>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className='grid grid-cols-3 mt-[40px] p-2 mx-auto w-full max-w-[250px] '>
                <Icon url="https://x.com/Novatra06">
                    <FaTwitter size={24} />
                </Icon>
                <Icon url="https://github.com/ankit875/novatra">
                    <FaGithub size={24} />
                </Icon>
            </div>

        </section>
    )
}


const Icon = ({ children, url }: any) => (
    <a href={url} target="_blank">
        <span className=" flex h-[48px] w-[48px] min-w-[48px] items-center cursor-pointer justify-center my-auto rounded-full bg-secondary/80 hover:bg-secondary/100 font-semibold text-sm text-white">
            {children}
        </span>
    </a>
)

export default Faq