import { useState } from 'react';
import AnimateHeight from 'react-animate-height';
import { FaTwitter, FaMedium, FaGithub } from 'react-icons/fa6';
 


const DATA = [
    {
        id: 1,
        question: 'What is the status of the project?',
        answer: 'We are at the early stage and continuously improving the platform, your support by using even a small amount of tokens is crucial to our growth journey.',
    },
    {
        id: 2,
        question: 'What blockchain are you supporting?',
        answer: 'We support Aptos chains as of now. We may consider expanding to other blockchains, especially Move-based blockchains.',
    },
    {
        "id": 3,
        "question": "Is the new version live?",
        "answer": "Yes! The latest version is currently live on Aptos Testnet. You can try the AI-powered prediction markets and help us improve before the mainnet launch."
    },
    {
        "id": 4,
        "question": "How does AI work in DeFi?",
        "answer": "AI is used to generate dynamic variables for DeFi services. For example, in prediction markets, the AI analyzes real-time market data and proposes outcomes with weighted probabilities, enhancing fair market resolution."
    },
    {
        "id": 5,
        "question": "Can anyone create a market?",
        "answer": "Yes! You can propose new outcomes by interacting with the AI-Agent, which will validate and assign weights before finalization."
    },
    {
        id: 6,
        question: 'How can I contact your team?',
        answer: 'DM us on Twitter/X account.',
    },
]

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
                <Icon url="https://x.com/ankita340">
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