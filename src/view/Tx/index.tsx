import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import cx from "classnames";
import _ from 'lodash';
import { Skeleton, Tabs } from 'antd';
import s from '../Home/index.module.scss';
import { useEffect, useState } from 'react';
import { useStore } from 'src/hooks';
import { Link, useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import { EventsInTxReceipt } from '../../containers/Event';
import { TxForm } from 'src/containers/Tx/Tx';

export default observer(function() {

  const { store: {
    provider,
    chainId,
    walletAddress,
    switchChain,
    handleConnectWallet,
  }} = useStore();

  const { hash = '' } = useParams();

  const [loading, setLoading] = useState(false);

  const [tx, setTx] = useState<ethers.providers.TransactionResponse>();
  const [txReceipt, setTxReceipt] = useState<ethers.providers.TransactionReceipt>();

  useEffect(() => {
    
  }, [])

  useEffect(() => {
    if (provider && hash) {
      init();
    }
  }, [hash, provider])

  const init = async () => {
    setLoading(true);
    const tx = await provider.getTransaction(hash);
    const txReceipt = await provider.getTransactionReceipt(hash);
    setTx(tx);
    setTxReceipt(txReceipt);
    setLoading(false);
  }

  const handleOpenTx = e => {
    e.preventDefault();
  }

  return (
      <div className={s.wrap}>
        <div className='mt10'>
          <h3>Tx</h3>
          <Tabs>
            <Tabs.TabPane tab="overview" key="overview">
              { loading ? <Skeleton /> : tx ? <TxForm tx={tx} txReceipt={txReceipt} /> : null }
            </Tabs.TabPane>
            { txReceipt && txReceipt.logs.length > 0 && <Tabs.TabPane tab={`logs (${txReceipt.logs.length})`} key="logs">
              <EventsInTxReceipt logs={txReceipt.logs}/>
            </Tabs.TabPane>}
          </Tabs>
        </div>
      </div>
  );
});
