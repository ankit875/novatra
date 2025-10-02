
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
        <div className="max-w-2xl mx-auto">
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 mb-6">
                <h1 className="text-2xl font-bold text-white mb-2">Profile Settings</h1>
                <p className="text-gray-400">Manage your Novatra account and preferences</p>
            </div>
            
            <div className="space-y-6">
                <Overview profile={currentProfile} />
                
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Account Actions</h3>
                    <button 
                        onClick={handleSignOut} 
                        type="button" 
                        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProfileContainer