import Head from 'next/head';
import dynamic from 'next/dynamic'

const MarketDetails = dynamic(() => import('@/components/Market/MarketDetails'), { ssr: false })


const MarketDetailsPage = () => {
    return (
        <div>
            <Head>
                <title>Novatra | CoinMarketCap.com Market</title>
            </Head>
            <section className="relative py-12 lg:py-24 min-h-[90vh]" style={{ backgroundColor: '#000000' }}>
                <div className="container pt-6 lg:pt-4  mb-[40px]">
                    <MarketDetails />
                </div>
            </section>
        </div>
    )
}

export default MarketDetailsPage