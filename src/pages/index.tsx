import Head from 'next/head';
import Link from 'next/link'; 
// import About from '@/components/Home/About';
// import AboutNew from '@/components/Home/AboutNew';
// import Blog from '@/components/Home/Blog';

import dynamic from 'next/dynamic'
 
const Faq = dynamic(() => import('@/components/Home/Faq'), { ssr: false })
const Hero = dynamic(() => import('@/components/Home/Hero'), { ssr: false })

import Features from "@/components/Home/Features";

export default function Index() {
    return (
        <div>
             <Head>
                <title>
                    Novatra - The Most Interactive AI-Powered Prediction Markets
                </title>
            </Head>

            <div className="h-20 lg:h-[104px]" style={{ backgroundColor: '#000000' }}></div>
            <Hero />

            <Features />
            {/* <AboutNew/> */}
            
            {/* <About /> */}
            {/*
            <Blog />
*/}
            <section className="pb-8" style={{ backgroundColor: '#000000' }}>
                <Faq/>
            </section>  

        </div>
    )
}