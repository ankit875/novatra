 
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
            <div className="relative mb-12 mt-3 flex justify-center animate-fade-in-up">
                      <video 
                        className="w-12 h-12 object-cover animate-float hover:scale-105 transition-all duration-500 rounded-full shadow-2xl shadow-primary/20" 
                        autoPlay 
                        muted 
                        loop
                        playsInline
                      >
                        <source src="/assets/hero_video.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    {/* Optional overlay for better visual integration */}
                    <div className="absolute inset-0 animate-shimmer rounded-full"></div>
                  </div>  );
    },
    Footer() {
        const { tokens } = useTheme();

        return (
            <View textAlign="center" padding={tokens.space.large}>
                <Text color={tokens.colors.neutral[80]}>
                    <span className='hidden md:inline-flex'>Copyright</span>© {new Date().getFullYear() + ' '}
                    <Link href="https://www.nova-tra.xyz/" className=" underline transition text-primary font-semibold">
                        Novatra
                    </Link> 
                </Text>
            </View>
        );
    },
 
};

const Wrapper = ({ children }: Props) => {

    const { tokens } = useTheme();

     
    const theme: Theme = {
        name: 'Auth Theme',
        tokens: {
            components: {
                authenticator: {
                    router: {
                        boxShadow: `0 0 16px ${tokens.colors.overlay['10']}`,
                        borderWidth: '0',
                    }
                },

                tabs: {
                    item: {
                        backgroundColor: "#08111566",
                        borderColor: "#08111566"
                    },
                },
            },
        },
    };

    const router = useRouter()

    const isAuth = router.pathname.includes("auth")

    if (isAuth) {
        return (
            <ThemeProvider theme={theme} >
                <View backgroundColor={"#08111F"} className="min-h-screen">
                    <Authenticator components={components} >
                        {children}
                    </Authenticator>
                </View>
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