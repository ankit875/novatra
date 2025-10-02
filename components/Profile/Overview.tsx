
import { BadgePurple } from "@/components/Badge";


const Overview = ({ profile }: any) => {
    return (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Profile Information</h2>

            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-700">
                    <div className="mb-2 sm:mb-0">
                        <p className="text-sm font-medium text-gray-300">Username</p>
                    </div>
                    <div className="text-right">
                        <span className="text-white font-medium">
                            {profile?.username || 'Not set'}
                        </span>
                    </div>
                </div>
                
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3">
                    <div className="mb-2 sm:mb-0">
                        <p className="text-sm font-medium text-gray-300">Role</p>
                    </div>
                    <div className="text-right">
                        <BadgePurple>
                            {profile?.role || "USER"}
                        </BadgePurple>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Overview