import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="mt-auto bg-gray-800 border-t border-gray-700">
            <div className="py-6 px-6">
                <div className="container mx-auto">
                    <div className="items-center justify-between font-medium text-white flex flex-col md:flex-row space-y-4 md:space-y-0">
                        <div className='text-sm text-center md:text-left'>
                            <span className='hidden md:inline-flex'>Copyright </span>© {new Date().getFullYear()} {' '}
                            <Link href="https://novatra.finance" className="text-secondary transition hover:text-primary font-semibold">
                                Novatra
                            </Link>
                            <span className="text-gray-400 ml-2">- AI-Powered Prediction Markets</span>
                        </div>
                        <div className='flex flex-row justify-center space-x-6'>
                            <div className="text-sm">
                                <Link href="/privacy-policy" className="text-gray-300 transition hover:text-secondary">
                                    Privacy Policy
                                </Link>
                            </div>
                            <div className="text-sm">
                                <Link href="/terms-of-service" className="text-gray-300 transition hover:text-secondary">
                                    Terms of Service
                                </Link>
                            </div>
                            <div className="text-sm">
                                <Link href="/about" className="text-gray-300 transition hover:text-secondary">
                                    About
                                </Link>
                            </div>
                        </div> 
                    </div>
                    
                    {/* Additional Footer Content */}
                    <div className="mt-4 pt-4 border-t border-gray-700">
                        <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
                            <div className="text-xs text-gray-400">
                                Built on Aptos • Powered by AI • Secured by Blockchain
                            </div>
                            <div className="flex space-x-4">
                                <Link href="/docs" className="text-xs text-gray-400 hover:text-secondary transition">
                                    Documentation
                                </Link>
                                <Link href="/support" className="text-xs text-gray-400 hover:text-secondary transition">
                                    Support
                                </Link>
                                <Link href="/community" className="text-xs text-gray-400 hover:text-secondary transition">
                                    Community
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
