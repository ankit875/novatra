
import { BadgePurple } from "@/components/Badge";


const Overview = ({ profile }: any) => {
    return (
        <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-xl p-6 border border-primary/20 hover:border-primary/40 transition-all duration-500 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent opacity-50 animate-shimmer"></div>
            <div className="relative">
                <div className="flex items-center mb-6">
                    <span className="text-2xl mr-3">📊</span>
                    <h2 className="text-xl font-bold text-white">Profile Information</h2>
                </div>

                <div className="space-y-4">
                    <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-gray-600/30">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                                <span className="text-lg">👤</span>
                                <p className="text-sm font-medium text-gray-300">Username</p>
                            </div>
                            <div className="text-right">
                                <span className="text-white font-semibold text-lg">
                                    {profile?.username || 'Not set'}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-gray-600/30">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                                <span className="text-lg">🎆</span>
                                <p className="text-sm font-medium text-gray-300">Role</p>
                            </div>
                            <div className="text-right">
                                <BadgePurple>
                                    {profile?.role || "USER"}
                                </BadgePurple>
                            </div>
                        </div>
                    </div>

                    {/* Additional Stats Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <span className="text-lg">🏆</span>
                                    <span className="text-xs text-gray-400">Total Bets</span>
                                </div>
                                <span className="text-green-400 font-semibold text-lg">
                                    {profile?.totalBets || '0'}
                                </span>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <span className="text-lg">💰</span>
                                    <span className="text-xs text-gray-400">Win Rate</span>
                                </div>
                                <span className="text-blue-400 font-semibold text-lg">
                                    {profile?.winRate ? `${profile.winRate}%` : 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Overview