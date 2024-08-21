import {
    action,
    makeAutoObservable,
    runInAction,
    computed,
    reaction,
    toJS,
} from "mobx";

import { ethers } from "ethers";
import {
    createContractWithProvider,
    getSaveWallet,
    showWallet,
    formatUnitsUtil,
    parseUnitsUtil,
    operateError,
} from "src/utils/util";

import _ from 'lodash'
import { BigNumber0, ERC20ABI, OPERATE_RESULT, SIGNATURE_PREF, USER_REJECTED, address0 } from "src/constants";
import { parseEther } from "ethers/lib/utils";
import { createOnBoard } from "src/utils/wallet";
import { StoreData, TransactionRecord } from "src/types";
import { Explorer_API } from "src/rpc-config";

export async function queryTokenAmount(provider, token, walletAddress) {
    if (!provider || !walletAddress) return;
    const contract = createContractWithProvider(
        ERC20ABI,
        token,
        provider
    );

    const result: any = await contract.balanceOf(walletAddress);
    return result;
}

export interface MessageItem {
    _id: string;
    url: string;
    msg: string;
    bTokenId: string;
    nftTokenId: string;
    blockNumber: string;
    nftTokenAddress: string;
}
export default class EvmStore {
    inited = false;
    chainId = 0;
    
    walletAddress = "";
    provider: ethers.providers.Web3Provider = null as any;
    onboard = null as unknown as any;

    balance = "0";

    blockNumber = 0;
    blockTimestamp = 0;
    explorer = '';

    chainList: Array<any> = [];
    chainMap: { [chainId: string]: any } = {};
    tokenList: Array<any> = [];

    allowCurrencyDecimals = 18;

    transactionRecords: Array<TransactionRecord> = [];

    available = "0";

    data: StoreData = {
        abis: {}
    };

    @computed get formatWalletAddress() {
        const { walletAddress } = this;
        if (!walletAddress) return "";
        return showWallet(walletAddress);
    }

    @action.bound
    formatUnits(val) {
        return formatUnitsUtil(val, this.allowCurrencyDecimals);
    }

    @action.bound
    parseUnits(val) {
        return parseUnitsUtil(val, this.allowCurrencyDecimals);
    }

    constructor(initData?) {
        if (initData) {
            this.data = Object.assign(this.data, initData);
        }
        makeAutoObservable(this, {}, { autoBind: true });
        reaction(() => [this.walletAddress, this.provider], this.queryBalance);
        reaction(() => [this.provider], this.queryLatestBlockInfo);
    }

    getState() {
        return toJS(this.data);
    }

    @action.bound
    setState(level1Key: string, state: {[key: string]: any}) {
        runInAction(() => {
            this.data[level1Key] = Object.assign({}, this.data[level1Key], state);
        })
    }

    @action.bound
    async init() {
        const onboard = createOnBoard();

        runInAction(() => {
            this.onboard = onboard;
            this.inited = true;
        });
    }

    @action.bound
    async queryBalance() {
        const { walletAddress, provider } = this;
        if (!provider || !walletAddress) return;
        const [balance] =
            await Promise.all([
                provider.getBalance(walletAddress)
            ]);

        runInAction(() => {
            this.balance = ethers.utils.formatEther(balance);
        });
    }

    @action.bound
    async handleConnectWallet() {
        if (!this.onboard || this.walletAddress) return;
        try {
            const wallet = getSaveWallet();
            let ret;
            if (wallet) {
                ret = await this.onboard.connectWallet({ autoSelect: wallet });
            } else {
                ret = await this.onboard.connectWallet();
            }
            console.log('wallet connected', ret)
            return ret;
        } catch (e) {
            // do nothing
            console.log(e);
        }
    }

    @action.bound
    async handleChangeWallet() {
        if (!this.onboard) return;
        return await this.onboard.connectWallet();
    }

    @action.bound
    async switchChain(chainId: number) {
        return await this.onboard.setChain({ chainId: '0x' + (chainId).toString(16) })
    }

    @action.bound
    initProviderConfig(provider?: ethers.providers.ExternalProvider) {
        runInAction(() => {
            if (provider) {
                const _provider = new ethers.providers.Web3Provider(provider);
                this.provider = _provider;
            }
        });
    }

    @action.bound
    handleNetWorkChange(chains: Array<{ id: string }>) {
        runInAction(() => {
            this.chainId = +(chains[0]?.id || "0");
            this.explorer = Explorer_API[this.chainId];
        });
    }

    @action.bound
    handleAccountChange(accounts: Array<{ address: string }>) {
        runInAction(() => {
            this.walletAddress = accounts[0]?.address || "";
        });
    }

    @action.bound
    setBalance(balance) {
        runInAction(() => {
            this.balance = balance;
        })
    }

    @action.bound
    async queryLatestBlockInfo() {
        if (!this.provider) return;
        try {
            const block = (await this.provider.getBlock("latest"));
            const {timestamp, number} = block;
            runInAction(() => {
                this.blockNumber = number;
                this.blockTimestamp = timestamp;
            });
        } catch {
            // handle error;
        }
    }

    @action.bound
    async queryTransaction(hash: string) {
        const { provider } = this;
        try {
            const result = await provider.waitForTransaction(hash);
            return {
                status: +(result?.status || 0),
                hash: result.transactionHash,
            };
        } catch {
            return { status: 0, hash: "" };
        }
    }

    @action.bound
    async getAvailable(token, decimals) {
        let amount = BigNumber0;
        if (token === address0) {
            amount = await this.provider.getBalance(this.walletAddress);
        } else {
            amount = await queryTokenAmount(this.provider, token, this.walletAddress);
        }
        if (amount) {
            const available = formatUnitsUtil(amount, decimals);
            runInAction(() => {
                this.available = available;
            })
            return available;
        }
    }
}
