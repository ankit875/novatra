import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BarChart, TrendingUp, Package, User, Activity } from 'react-feather';
import { NovatraContext } from '@/hooks/useNovatra';
import { getCurrentUser } from 'aws-amplify/auth';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

const Sidebar = ({ isOpen = true, onClose }: SidebarProps) => {
    const [user, setUser] = useState<any>(undefined);
    const { currentNetwork } = useContext(NovatraContext);
    const router = useRouter();

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
        },
        {
            name: 'Vault',
            href: `/vault/${currentNetwork}`,
            icon: Package,
            active: router.pathname === '/vault' || router.pathname.includes('vault')
        },
        {
            name: 'User Activity',
            href: '/activity',
            icon: Activity,
            active: router.pathname === '/activity'
        }
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={onClose}
                />
            )}
            
            {/* Sidebar */}
            <div className={`fixed left-0 top-0 h-full w-64 bg-black border-r border-gray flex flex-col z-40 transform transition-transform duration-300 lg:translate-x-0 ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                {/* Logo Section */}
                <div className="p-6 border-b border-gray">
                    <Link href="/" className="flex items-center space-x-3">
                        <img src="/assets/images/logo-novatra-31.png" alt="Novatra" className="w-8 h-8" />
                        <span className="text-xl font-bold text-white">Novatra</span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {navigationItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => onClose && onClose()}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                    item.active
                                        ? 'bg-primary text-white'
                                        : 'text-gray hover:bg-gray-dark hover:text-white'
                                }`}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </>
    );
};

export default Sidebar;