import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import cx from "classnames";
import _ from 'lodash';
import { Button, DatePicker, Form, Input, InputNumber, Modal, Select, Space, Switch, message, Avatar, Card, Row, Col, Descriptions, Statistic, Tag, PageHeader, notification, Table, Tabs } from 'antd';
import s from './index.module.scss';
import { useEffect, useState } from 'react';
import TextArea from 'antd/lib/input/TextArea';

import moment from 'moment'
import { formatUTCTime, fromTime, fromTimeRange, showWallet, sleep, timeColor, timeMiddle, toTime, toTimeRange } from 'src/utils/util';
import { EditOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useStore } from 'src/hooks';
import { useForm } from 'antd/lib/form/Form';
import { render } from 'react-dom';
import Address from 'src/components/Address';
import { BigNumber, ethers } from 'ethers';
import ContractView from 'src/components/ContractView';
import { Link } from 'react-router-dom';
import BlockRangeEvents from 'src/containers/Event/blockRangeEvents';
import Txs from 'src/containers/Tx/blocksTxs';

export default observer(function Home() {

  const { store: {
    chainId,
    provider,
    blockNumber,
    walletAddress,
    switchChain,
    handleConnectWallet,
  }} = useStore();

  const [latestBlockNumber, setLatestBlockNumber] = useState<ethers.BigNumber>(BigNumber.from(0));

  useEffect(() => {
    
  }, [])

  useEffect(() => {
    if (provider) {
      init();
    }
  }, [provider])

  const init = async () => {
    // provider.getTransactionCount()
    console.log(111111111111)
  }


  return (
    <div className={s.wrap}>
      <PageHeader
        className={s.sitepageheader}
        onBack={() => null}
        backIcon={''}
        title=""
      >
        <Row className='gap'>
          <Statistic title="ChainId" value={chainId} valueRender={node => chainId} />

          {/* <Statistic title="Block Number" value={blockNumber} valueRender={node => <Link to={`/block/${blockNumber}`}>{node}</Link>} /> */}

          <Statistic title="Block Number" valueRender={node => <ContractView provider={provider} onChange={setLatestBlockNumber} FunctionName='getBlockNumber' args={[]} callback={val => <Link to={`/block/${val}`}>{Number(val)}</Link>}/>} />

          {/* <ContractView FunctionName='getBlockNumber' args={[]} valueRender={(val, loading) => <Statistic title="Block Number" value={Number(val)} valueRender={node => loading || <Link to={`/block/${val}`}>{node}</Link>} />} /> */}

          <ContractView provider={provider} FunctionName='getFeeData' args={[]} valueRender={(vals, loading) => {
            return (
              <>
                { loading ? (
                  <Statistic title="Fee Data" valueRender={node => loading} />
                ) : _.map(vals, (val, key) => {
                  return <Statistic title={key} value={Number(val)} key={key} />
                })}
              </>
            )
          }}/>
        </Row>
      </PageHeader>

      <div className='mt10'>
        <Tabs
          defaultActiveKey='events'
          items={[
            {
              label: 'events',
              key: 'events',
              children: <BlockRangeEvents blockNumber={+latestBlockNumber} />
            },
            {
              label: 'txs',
              key: 'txs',
              children: walletAddress && <Txs txFilters={[]}/>
            }
          ]}
        />
      </div>
    </div>
  );
});
