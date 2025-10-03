import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Search, Bell, User, BarChart, TrendingUp, Menu } from 'react-feather';
import { NovatraContext } from '@/hooks/useNovatra';
import { getCurrentUser } from 'aws-amplify/auth';

const Header = (props: any) => {
    const [user, setUser] = useState<any>(undefined);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { loadDefault, loadProfile } = useContext(NovatraContext);
    const router = useRouter();

    useEffect(() => {
        loadDefault();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const { username, userId, signInDetails } = await getCurrentUser();
                setUser({
                    username,
                    userId,
                    ...signInDetails
                });
            } catch (e) {
                setUser(undefined);
            }
        })();
    }, []);

    useEffect(() => {  
        if (user && user.userId) {
            loadProfile(user.userId);
        }
    }, [user]);

    const navigationItems = [
        {
            name: 'Market Overview',
            href: '/',
            icon: BarChart,
            active: router.pathname === '/'
        },
        {
            name: 'Explore Markets',
            href: '/markets',
            icon: TrendingUp,
            active: router.pathname === '/markets' || router.pathname.includes('/markets')
        }
    ];

    return (
        <>
            <style jsx>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes slide-down {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slide-down {
                    animation: slide-down 0.3s ease-out;
                }
            `}</style>
            <header className={`w-full ${props.className || ''}`}>
            <div className="flex items-center justify-between px-32 py-4">
                <Link href="/" className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-secondary to-primary rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">N</span>
                    </div>
                    <span className="text-xl font-bold text-white">Novatra</span>
                </Link>

                <nav className="hidden md:flex items-center space-x-6">
                    {navigationItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg relative overflow-hidden ${
                                    item.active
                                        ? 'bg-gradient-to-r from-secondary to-primary text-white shadow-lg animate-pulse'
                                        : 'text-gray-300 hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 hover:text-white hover:shadow-md'
                                }`}
                                style={{
                                    animationDelay: `${index * 0.1}s`
                                }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                
                                <div className="relative z-10">
                                    <Icon size={18} className="transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                                </div>
                                
                                <span className="font-medium relative z-10 transition-all duration-300 group-hover:tracking-wide">
                                    {item.name}
                                </span>
                                
                                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg shadow-secondary/25"></div>
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-white hover:text-secondary transition-colors"
                    >
                        <Menu size={24} />
                    </button>

                    
                    <Link href="/auth/profile">
                        {!user ? (
                            <button type="button" className="bg-white text-black font-medium py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2">
                                <span>Sign In</span>
                            </button>
                        ) : (
                            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700 transition-colors">
                                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                    <User size={16} className="text-white" />
                                </div>
                                
                            </div>
                        )}
                    </Link>
                </div>
            </div>

            {mobileMenuOpen && (
                <div className="md:hidden bg-gray-800 border-t border-gray-700 animate-slide-down">
                    <nav className="px-6 py-4 space-y-2">
                        {navigationItems.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`group flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:translate-x-1 ${
                                        item.active
                                            ? 'bg-gradient-to-r from-secondary to-primary text-white'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                                    style={{
                                        animationDelay: `${index * 0.1}s`,
                                        animation: 'fade-in-up 0.3s ease-out forwards'
                                    }}
                                >
                                    <Icon size={18} className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
                                    <span className="font-medium transition-all duration-300 group-hover:tracking-wide">{item.name}</span>
                                </Link>
                            );
                        })}
                        {!user && (
                            <Link href="/auth/profile" onClick={() => setMobileMenuOpen(false)}>
                                <button type="button" className="w-full text-left px-3 py-3 text-white hover:text-secondary transition-all duration-300 font-medium hover:tracking-wide transform hover:translate-x-1">
                                    Get Started
                                </button>
                            </Link>
                        )}
                    </nav>
                </div>
            )}
        </header>
        </>
    );
};

export default Header;