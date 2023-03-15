import "./App.css";
import Layout from "./layouts";
import { BrowserRouter } from "react-router-dom";
import { WagmiConfig, createClient, configureChains, mainnet } from "wagmi";
import { publicProvider } from 'wagmi/providers/public'

import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

import { frenchain } from "./FrenChain";

window.Buffer = window.Buffer || require("buffer").Buffer;

const { chains, provider } = configureChains(
  [mainnet, frenchain],
  [
    publicProvider(),
    jsonRpcProvider({
      rpc: (chain) => ({
        http: 'https://rpc-02.frenscan.io',
      }),
    }),
    jsonRpcProvider({
      rpc: (chain) => ({
        http: 'https://eth.llamarpc.com',
      }),
    }),
  ]
);

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      chains,
      options: {
        name: 'MetaMask',
        shimDisconnect: true,
        shimChainChangedDisconnect: false,
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
  ],
  provider,
})

const App = () => {
  return (
    <WagmiConfig client={client}>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </WagmiConfig>
  );
};

export default App;
