import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import cx from "classnames";
import _ from 'lodash';
import { Skeleton, Tabs } from 'antd';
import s from '../Home/index.module.scss';
import { useEffect, useState } from 'react';
import { useStore } from 'src/hooks';
import { Link, useParams } from 'react-router-dom';
import { isHexString } from 'ethers/lib/utils';
import {
  BlockWithTransactions
} from "@ethersproject/abstract-provider";
import { BlockForm } from 'src/containers/Block';
import { TxsTable } from 'src/containers/Tx/Tx';


export default observer(function() {

  const { store: {
    provider,
    chainId,
    walletAddress,
    switchChain,
    handleConnectWallet,
  }} = useStore();

  const { blockNumberOrHash = 'latest' } = useParams();

  const isHash = isHexString(blockNumberOrHash, 32);

  const [loading, setLoading] = useState(false);
  const [activeKey, setActiveKey] = useState('overview');

  const [block, setBlock] = useState<BlockWithTransactions>();

  useEffect(() => {
    if (provider && blockNumberOrHash) {
      init();
    }
  }, [blockNumberOrHash, provider])

  const init = async () => {
    setLoading(true);
    const block = await provider.getBlockWithTransactions(isHash ?  blockNumberOrHash : Number(blockNumberOrHash));
    setBlock(block);
    setLoading(false);
  }

  return (
      <div className={s.wrap}>
        <div className='mt10'>
          <h3>Block</h3>
          <Tabs activeKey={activeKey} onChange={setActiveKey}>
            <Tabs.TabPane tab="overview" key="overview">
              { loading ? <Skeleton /> : block ? <BlockForm block={block} onClick={e => setActiveKey('logs')}/> : null }
            </Tabs.TabPane>
            { block && block.transactions.length > 0 && <Tabs.TabPane tab={`txs (${block.transactions.length})`} key="logs">
              <TxsTable txs={[...block.transactions].reverse()} />
            </Tabs.TabPane> }
          </Tabs>
        </div>
      </div>
  );
});
