
import { signOut } from "aws-amplify/auth";
import { useRouter } from 'next/router';
import { useContext } from "react";
import Overview from "@/components/Profile/Overview";
import { NovatraContext } from "@/hooks/useNovatra";

const ProfileContainer = () => {
    const router = useRouter()
    const { currentProfile } = useContext(NovatraContext)

    const handleSignOut = async () => {
        try {
            await signOut()
            router.push("/")
        } catch (error) {
            console.log('error signing out: ', error);
        }
    }

    return (
        <div className="max-w-4xl mx-auto px-6">
            {/* Header Section */}
            <div className="relative bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent rounded-2xl p-8 border border-primary/20 hover:border-primary/30 transition-all duration-500 backdrop-blur-sm shadow-xl shadow-primary/10 overflow-hidden mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent opacity-50 animate-shimmer"></div>
                <div className="relative">
                    <div className="flex items-center justify-center mb-4">
                        <span className="inline-flex items-center bg-gradient-to-r from-primary/20 to-primary/10 px-4 py-2 rounded-full text-primary font-semibold text-sm tracking-wide backdrop-blur-sm border border-primary/20 hover:scale-105 transition-all duration-300">
                            👤 USER PROFILE
                        </span>
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4 text-center">
                        <span className="bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
                            Profile Settings
                        </span>
                    </h1>
                    <p className="text-gray-400 text-lg text-center max-w-2xl mx-auto">
                        Manage your Novatra account and preferences
                    </p>
                </div>
            </div>
            
            <div className="space-y-8">
                <Overview profile={currentProfile} />
                
                {/* Account Actions Section */}
                <div className="relative bg-gradient-to-br from-secondary/10 via-secondary/5 to-transparent rounded-xl p-6 border border-secondary/20 hover:border-secondary/40 transition-all duration-500 backdrop-blur-sm hover:shadow-xl hover:shadow-secondary/10 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent opacity-50 animate-shimmer"></div>
                    <div className="relative">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                            <span className="text-red-400 mr-2">⚠️</span>
                            Account Actions
                        </h3>
                        <button 
                            onClick={handleSignOut} 
                            type="button" 
                            className="w-full bg-gradient-to-r from-red-600/80 to-red-700/80 hover:from-red-600 hover:to-red-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20 hover:scale-[1.02] border border-red-500/30 hover:border-red-500/50"
                        >
                            <span className="flex items-center justify-center space-x-2">
                                <span>🚪</span>
                                <span>Sign Out</span>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileContainer