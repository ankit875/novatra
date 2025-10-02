import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Search, Bell, User } from 'react-feather';
import { NovatraContext } from '@/hooks/useNovatra';
import { getCurrentUser } from 'aws-amplify/auth';

const Header = (props: any) => {
    const [user, setUser] = useState<any>(undefined);
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

    return (
        <header className={`${props.className || ''}`}>
            <div className="flex items-center space-x-4">
                {/* Search Bar */}
                {/* <div className="relative">
                    <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray" />
                    <input
                        type="text"
                        placeholder="Search markets..."
                        className="w-64 pl-10 pr-4 py-2 bg-gray-dark border border-gray rounded-lg text-white placeholder-gray focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div> */}  


                {/* Profile */}
                <Link href="/auth/profile">
                    {!user ? (
                        <button type="button" className="bg-primary hover:bg-secondary text-white font-medium py-2 px-4 rounded-lg transition-colors">
                            Sign In
                        </button>
                    ) : (
                        <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-dark transition-colors">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                <User size={16} className="text-white" />
                            </div>
                        </div>
                    )}
                </Link>
            </div>
        </header>
    );
};

export default Header;