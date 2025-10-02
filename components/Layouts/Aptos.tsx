import { PropsWithChildren } from 'react';

import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';

const AptosLayout = ({ children }: PropsWithChildren) => {

    return (
        <AptosWalletAdapterProvider
            autoConnect={true}
        >
            {children}
        </AptosWalletAdapterProvider>
    )
}

export default AptosLayout