// import { Chain } from '@wagmi/core'

export const frenchain = {
    id: 44444,
    name: 'FrenChain',
    network: 'FrenChain',
    nativeCurrency: {
        decimals: 18,
        name: 'FrenChain',
        symbol: 'FREN',
    },
    rpcUrls: {
        public: { http: ['https://rpc-02.frenscan.io'] },
        default: { http: ['https://rpc-02.frenscan.io'] },
    },
    blockExplorers: {
        etherscan: { name: 'frenscan', url: 'https://frenscan.io' },
        default: { name: 'frenscan', url: 'https://frenscan.io' },
    },
    contracts: {
        // multicall3: {
        //     address: '0xca11bde05977b3631167028862be2a173976ca11',
        //     blockCreated: 11_907_934,
        // },
    },
}
