import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import cx from "classnames";
import _ from 'lodash';
import { Form, Input, Skeleton, Tabs } from 'antd';
import s from '../Home/index.module.scss';
import { useEffect, useState } from 'react';
import { useStore } from 'src/hooks';
import { Link, useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import MyForm from 'src/components/MyForm';
import Loading from 'src/components/Loading';
import ERC20Contract from 'src/ERC20Token.json';
import { LoadingOutlined } from '@ant-design/icons';
import LoadingValue from 'src/components/LoadingValue';
import { formItemLayout } from "src/constants";

const { abi, bytecode } = ERC20Contract;

export default observer(function() {

  const { store: {
    provider,
    chainId,
    walletAddress,
  }} = useStore();

  const [loading, setLoading] = useState(false);
  const [val, setVal] = useState<string|null>(null);

  const [tokensStr, setTokensStr] = useState('');

  const deployErc20 = async (values: any[]) => {
    try {
      setLoading(true);
      const signer = provider.getSigner(0);
      const factory = new ethers.ContractFactory(abi, bytecode, signer);
      const contract = await factory.deploy(...values);
      await contract.deployed();
      // console.log("Contract deployed to:", contract.address);
      setVal(contract.address);
    } catch (e: any) {
      console.error(e);
      setVal(e.message);
    }

    setLoading(false)
  }

  return (
      <div className={s.wrap}>
        <div className='mt10'>
          <h3>DeployErc20</h3>
          <MyForm inputs={[
            { name: 'Name', type: 'string' },
            { name: 'Symbol', type: 'string' },
            { name: 'Decimals', type: 'number' },
          ]} onFinish={deployErc20} />
          <LoadingValue val={val} loading={loading} />
        </div>

        <div className='mt10'>
          <h3>dexscreener</h3>
          <Form.Item label="Token addresses" {...formItemLayout}>
            <Input value={tokensStr} onChange={e => setTokensStr(e.target.value)} />
          </Form.Item>
          <a target="_blank" href={`https://api.dexscreener.com/latest/dex/tokens/${tokensStr}`}>{`https://api.dexscreener.com/latest/dex/tokens/${tokensStr}`}</a>
        </div>
      </div>
  );
});
