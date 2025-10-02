import "@/styles/tailwind.css";
import type { AppProps } from "next/app";
import "@aws-amplify/ui-react/styles.css";
import 'react-loading-skeleton/dist/skeleton.css'

import { Suspense } from 'react';
import Head from 'next/head';
// import TxProvider from "../hooks/useTx"
import NovatraProvider from "@/hooks/useNovatra";
// import SuiLayout from "@/components/Layouts/Sui";
import AptosLayout from "@/components/Layouts/Aptos";
import MainLayout from "@/components/Layouts/Main";
import AuthProvider from "@/hooks/useAuth";
import { SkeletonTheme } from 'react-loading-skeleton';
import { configureAmplify } from "@/lib/amplify";

// Configure Amplify as soon as possible
configureAmplify();

export default function App({ Component, pageProps }: AppProps) {

  return (
    <Suspense>
      <Head>
        <title>
          Novatra - The Most Interactive AI-Powered Prediction Markets
        </title>
        <meta charSet="UTF-8" />
        <meta
          name="description"
          content="Novatra provides AI-powered DeFi solutions on the MoveVM, including a prediction market, decentralized exchange (DEX), and a liquid staking system for Aptos and Sui blockchains."
        />
        <meta
          name="keywords"
          content="AI DeFi, polymarket, market prediction, blockchain finance, Aptos, Sui, Aptos DeFi, MoveVM, Sui staking, MoveVM blockchain, decentralized prediction market, liquid staking, crypto staking rewards, DeFi protocols, decentralized finance solutions, blockchain-powered prediction markets"
        />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <AuthProvider>
        <NovatraProvider>
          {/* <TxProvider> */}
            {/* <SuiLayout> */}
              <AptosLayout>
                <MainLayout>
                <SkeletonTheme baseColor="#141F32" highlightColor="#444">
                  <Component {...pageProps} />
                  </SkeletonTheme>
                </MainLayout>
              </AptosLayout>
            {/* </SuiLayout> */}
          {/* </TxProvider> */}
        </NovatraProvider>
      </AuthProvider> 
    </Suspense>
  )
}
// 