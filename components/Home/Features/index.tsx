import dynamic from 'next/dynamic'

const TabsData = dynamic(() => import('./Tabs'), { ssr: false })

const Features = () => {
    return (
        <section className="relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 animate-pulse"></div>
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="container relative z-10">
                <div className="heading my-auto max-w-4xl mx-auto text-center animate-fade-in-up">
                    <div className="flex items-center justify-center mb-6">
                        <span className="inline-flex items-center bg-gradient-to-r from-secondary/20 to-secondary/10 px-4 py-2 rounded-full text-primary font-semibold text-sm tracking-wide backdrop-blur-sm border border-secondary/20 hover:scale-105 transition-all duration-300">
                            SEE IN ACTION
                        </span>
                    </div>
                    <h4 className="text-3xl lg:text-5xl font-black mb-6">
                        <span className="bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">
                            Anything You Predict,
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_200%] bg-clip-text text-transparent animate-gradient-x">
                            AI Optimizes
                        </span>
                    </h4>
                    <p className="pt-3 sm:pt-5 text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed hover:text-white transition-colors duration-300">
                        Novatra AI-Agent guide your next move — blending real-time insights and intelligent analysis to refine your predictions and maximize your wins.
                    </p>
                </div>
 
                <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <TabsData /> 
                </div>
            </div>
        </section>
    )
}

export default Features