import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import cx from "classnames";
import _ from 'lodash';
import { Button, DatePicker, Form, Input, InputNumber, Modal, Select, Space, Switch, message, Avatar, Card, Row, Col, Descriptions, Statistic, Tag, PageHeader, notification, Table, Tabs } from 'antd';
import s from '../Home/index.module.scss';
import { useEffect, useState } from 'react';
import { useStore } from 'src/hooks';
import { ethers } from 'ethers';
import ContractView from 'src/components/ContractView';
import { useParams } from 'react-router-dom';
import Copy from 'src/components/Copy';
import Address from 'src/components/Address';
import Contract from './contract';
import { address0 } from 'src/constants';
import Txs from 'src/containers/Tx/blocksTxs';

export default observer(function() {

  const { store: {
    provider,
    chainId,
    walletAddress,
    switchChain,
    handleConnectWallet,
  }} = useStore();

  const [isContract, setIsContract] = useState(false);
  const [code, setCode] = useState('');


  const { address = address0 } = useParams();

    useEffect(() => {
      if (provider && address) {
        provider.getCode(address).then(code => {
          if (code !== '0x') {
            setIsContract(true);
            setCode(code);
          } else {
            setIsContract(false);
            setCode('');
          }
        });
      }
    }, [address, provider])

    return (
        <div className={s.wrap}>
          <div className='mt10'>{isContract? 'Contract' : "Address"}: <Address address={address} className='flex-inline' /> </div>
          <PageHeader
            className={s.sitepageheader}
            onBack={() => null}
            backIcon={''}
            title=""
          >
            <Row>
              <Statistic
                title="Balance"
                suffix="ETH"
                valueRender={node => <ContractView provider={provider} FunctionName='getBalance' args={[address]} callback={ethers.utils.formatEther} />}
              />
            </Row>
          </PageHeader>

          <strong>TODO: lookup token amounts</strong>

          {isContract ? <Contract code={code} address={address} /> : (
            <Tabs>
              <Tabs.TabPane tab="txs" key="txs">
                { walletAddress && <Txs txFilters={[
                  { from: walletAddress },
                  { to: walletAddress }
                ]}/> }
              </Tabs.TabPane>
            </Tabs>
          )}
        </div>
    );
});
