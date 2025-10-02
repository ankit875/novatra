import Head from 'next/head';
import dynamic from 'next/dynamic'

const MarketDetailsMoveAgentKit = dynamic(() => import('@/components/Market/MoveAgentKit'), { ssr: false })

const MarketDetailsPage = () => {
    return (
        <div>
            <Head>
                <title>Novatra | Aptos DeFi Ecosystem Market</title>
            </Head>
            <section className="relative py-12 lg:py-24 min-h-[90vh]" style={{ backgroundColor: 'rgb(9 69 162)' }}>
                <div className="container pt-6 lg:pt-4  mb-[40px]">
                    <MarketDetailsMoveAgentKit />
                </div>
            </section>
        </div>
    )
}

export default MarketDetailsPage