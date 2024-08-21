import { useEffect } from 'react';
import { observer } from 'mobx-react';

import { saveWallet, clearWallet } from 'src/utils/util';
import { useStore } from 'src/hooks';

function Wallet() {

    const { store: { onboard, initProviderConfig, handleAccountChange, handleNetWorkChange } } = useStore();
    
    useEffect(() => {
        if (!onboard) return;
        const state = onboard.state.select('wallets');
        const { unsubscribe } = state.subscribe(([wallet]) => {
            if (wallet) {
                const { label, accounts, provider, chains } = wallet;
                saveWallet(label);
                initProviderConfig(provider);
                handleNetWorkChange(chains);
                handleAccountChange(accounts);
            } else {
                clearWallet();
                initProviderConfig();
                handleNetWorkChange([]);
                handleAccountChange([]);
            }
        });
        return () => {
            try {
                unsubscribe();
            } catch (e) {}
        };
    }, [onboard, initProviderConfig, handleNetWorkChange, handleAccountChange]);

    return null;
}

export default observer(Wallet);
