import Onboard from "@web3-onboard/core";
import injectedModule from "@web3-onboard/injected-wallets";
import walletConnectModule from "@web3-onboard/walletconnect";
import _ from "lodash";
import { CHAIN_CURRENCY, CHAIN_MAP, CHAIN_NAME, CHAIN_RPC, Explorer_API } from "src/rpc-config";
import { hexString } from "./util";


const WalletSavedKey = "selectedWallet";

export const getSaveWallet = () => {
    return window.localStorage.getItem(WalletSavedKey) || "";
};

export const saveWallet = (wallet: string) => {
    window.localStorage.setItem(WalletSavedKey, wallet);
};

export const clearWallet = () => {
    window.localStorage.removeItem(WalletSavedKey);
};

export const createOnBoard = () => {
    const onboard = Onboard({
        wallets: [injectedModule(), walletConnectModule({
            // @ts-ignore
            version: 2,
            projectId: "6c18eb8e9ddf2e90fa20b48c09993067",
        })],
        chains: _.map(CHAIN_MAP,  chainId => {
          return {
              id: hexString(chainId),
              label: CHAIN_NAME[chainId],
              token: CHAIN_CURRENCY[chainId],
              rpcUrl: CHAIN_RPC[chainId],
              blockExplorerUrl: Explorer_API[chainId]
          }
        }),
        appMetadata: {
            name: "Onboard",
            description: "Onboard",
            recommendedInjectedWallets: [
                { name: "MetaMask", url: "https://metamask.io" },
                { name: "WalletConnect", url: "https://walletconnect.com" },
            ],
        },
        theme: 'dark',
        accountCenter: {
            desktop: {
                enabled: false,
            },
            mobile: {
                enabled: false,
            },
        },
    });

    return onboard;
};
