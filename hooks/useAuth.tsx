 
import { ReactNode } from "react"
import { Authenticator, useTheme, View, Image, Text, ThemeProvider, Theme } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { useRouter } from "next/router"
import Link from "next/link"
 

type Props = {
    children: ReactNode
}
 
const components = {
    Header() {
        const { tokens } = useTheme();

        return (
            <div className="relative mb-8 flex flex-col items-center">
                {/* Video Logo */}
                <div className="relative mb-6 flex justify-center animate-fade-in-up">
                    <video 
                        className="w-16 h-16 object-cover animate-float hover:scale-105 transition-all duration-500 rounded-full shadow-2xl shadow-primary/20" 
                        autoPlay 
                        muted 
                        loop
                        playsInline
                    >
                        <source src="/assets/hero_video.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    <div className="absolute inset-0 animate-shimmer rounded-full"></div>
                </div>
                
                {/* Brand Header */}
                <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                        <span className="inline-flex items-center bg-gradient-to-r from-primary/20 to-primary/10 px-4 py-2 rounded-full text-primary font-semibold text-sm tracking-wide backdrop-blur-sm border border-primary/20 animate-fade-in-up hover:scale-105 transition-all duration-300">
                             SECURE ACCESS
                        </span>
                    </div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                        <span className="bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
                            Welcome to Novatra
                        </span>
                    </h1>
                    <p className="text-gray-400 text-sm max-w-md mx-auto">
                        Access your AI-powered prediction market account
                    </p>
                </div>
            </div>
        );
    },
    Footer() {
        const { tokens } = useTheme();

        return (
            <div className="relative mt-8 p-6">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg"></div>
                <div className="relative text-center">
                    <Text color={tokens.colors.neutral[80]} className="text-sm">
                        <span className='hidden md:inline-flex'>Copyright</span>© {new Date().getFullYear() + ' '}
                        <Link href="https://www.nova-tra.xyz/" className="underline transition text-primary font-semibold hover:text-primary/80">
                            Novatra
                        </Link> 
                    </Text>
                    <p className="text-xs text-gray-500 mt-2">
                        AI-Powered Prediction Markets • Secure • Transparent
                    </p>
                </div>
            </div>
        );
    },
};

const Wrapper = ({ children }: Props) => {

    const { tokens } = useTheme();

     
    const theme: Theme = {
        name: 'Novatra Auth Theme',
        tokens: {
            components: {
                authenticator: {
                    router: {
                        boxShadow: `0 0 32px rgba(71, 189, 255, 0.15)`,
                        borderWidth: '1px',
                        borderColor: 'rgba(71, 189, 255, 0.2)',
                    }
                },
                tabs: {
                    item: {
                        backgroundColor: "rgba(71, 189, 255, 0.1)",
                        borderColor: "rgba(71, 189, 255, 0.2)",
                        color: '#ffffff',
                        _hover: {
                            backgroundColor: "rgba(71, 189, 255, 0.15)",
                        },
                        _focus: {
                            backgroundColor: "rgba(71, 189, 255, 0.2)",
                        }
                    },
                },
                button: {
                    primary: {
                        backgroundColor: 'rgba(71, 189, 255, 0.9)',
                        _hover: {
                            backgroundColor: 'rgba(71, 189, 255, 1)',
                        }
                    }
                },
                fieldcontrol: {
                    borderColor: 'rgba(71, 189, 255, 0.2)',
                    _focus: {
                        borderColor: 'rgba(71, 189, 255, 0.5)',
                    }
                }
            },
        },
    };

    const router = useRouter()

    const isAuth = router.pathname.includes("auth")

    if (isAuth) {
        return (
            <ThemeProvider theme={theme}>
                <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
                    {/* Background Elements */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    
                    {/* Content */}
                    <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
                        <div className="w-full max-w-md">
                            <Authenticator components={components}>
                                <div className="relative bg-gradient-to-br from-gray-800/40 via-gray-900/60 to-black/80 rounded-2xl p-8 border border-primary/20 hover:border-primary/30 transition-all duration-500 backdrop-blur-sm shadow-xl shadow-primary/10 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent opacity-50 animate-shimmer"></div>
                                    <div className="relative">
                                        {children}
                                    </div>
                                </div>
                            </Authenticator>
                        </div>
                    </div>
                </div>
            </ThemeProvider>
        )
    } else {
        return (
            <>
                {children}
            </>
        )
    }
}

export default Wrapper