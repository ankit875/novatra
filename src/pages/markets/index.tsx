import Head from 'next/head';
import dynamic from 'next/dynamic'

const MarketList = dynamic(() => import('@/components/Market/MarketList'), { ssr: false })


const MarketsPage = () => {
    return (
        <div>
            <Head>
                <title>Novatra | Prediction Market</title>
            </Head>
            <section className="relative py-12 lg:py-24 min-h-[90vh]" style={{ backgroundColor: '#000000' }}>
                <div className="container pt-6 lg:pt-4  mb-[40px]">
                    <MarketList />
                </div>
            </section>
        </div>
    )
}

export default MarketsPage