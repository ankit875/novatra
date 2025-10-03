import Head from 'next/head';

import dynamic from 'next/dynamic'

const ProfileContainer = dynamic(() => import('@/components/Profile'), { ssr: false })

const ProfilePage = () => {
    return (
        <div>
            <Head>
                <title>Novatra | Profile</title>
            </Head>
            <section className="relative py-12 lg:py-24 min-h-[90vh]" style={{ backgroundColor: '#000000' }}>
                <div className="container pt-6 lg:pt-4  mb-[40px]">
                    <ProfileContainer />
                </div>
            </section>
        </div>
    )
}

export default ProfilePage