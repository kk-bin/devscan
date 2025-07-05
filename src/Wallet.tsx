import { useEffect } from 'react';
import { observer } from 'mobx-react';

import { useStore } from 'src/hooks';
import { clearWallet, saveWallet } from './utils/wallet';
import { SubscriptionLike } from 'rxjs'

let subscription: SubscriptionLike;

function Wallet() {

    const { store: { onboard, initProviderConfig, handleAccountChange, handleNetWorkChange, handleConnectWallet } } = useStore();
    
    useEffect(() => {
        if (!onboard) return;
        if (subscription) {
            subscription.unsubscribe();
        }
        console.log('state.subscribe')
        const state = onboard.state.select('wallets');
        subscription = state.subscribe(([wallet]) => {
            console.log('wallet', wallet)
            if (wallet) {
                const { label, accounts, provider, chains } = wallet;
                saveWallet(label);
                initProviderConfig(provider);
                handleNetWorkChange(chains);
                handleAccountChange(accounts);
            } else {
                // clearWallet();
                initProviderConfig();
                handleNetWorkChange([]);
                handleAccountChange([]);
            }
        });
        handleConnectWallet();
    }, [onboard]);

    return null;
}

export default observer(Wallet);
