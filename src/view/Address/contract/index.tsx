import { Form, Input, Select, Tabs, message } from "antd";
import React, { useEffect, useState } from "react";
import Code from "./code";
import Read from "./read";
import Write from "./write";
import { ethers } from "ethers";
import _ from "lodash";
import { observer } from "mobx-react";
import { useStore } from "src/hooks";
import { EXAMPLE_ABI, ERC20_ABI, ERC721_ABI, WETH_ABI, PAIR_ABI, FACTORY_ABI, ROUTER02_ABI }  from "localnm/blockchain/constants";
import Event from "./event";
import Txs from "src/containers/Tx/blocksTxs";

const { Option } = Select;

const DEFAULT_ABIS = {
  ERC20: ERC20_ABI,
  ERC721: ERC721_ABI,
  WETH: WETH_ABI,
  UNISWAP: PAIR_ABI,
  FACTORY: FACTORY_ABI,
  ROUTER02: ROUTER02_ABI,
  EXAMPLE: EXAMPLE_ABI
}

export default observer(function ({ address, code}: {
  address: string,
  code: string
}) {

  const { store: {
    provider,
    walletAddress,
    data: { abis },
    setState
  }} = useStore();

  const [abi, setAbi] = useState(abis[address] || '');
  const [humanReadableAbi, setHumanReadableAbi] = useState<any>('');

  const [contract, setContract] = useState<ethers.Contract>();


  const [functions, setFunctions] = useState<any>();
  const [events, setEvents] = useState<any>();

  useEffect(() => {
    if (abi) {
      try {
        let iface: ethers.utils.Interface;
        if (/[\[\]]/.test(abi)) {
          const abiObj = eval('(' + abi + ')');
          iface = new ethers.utils.Interface(abiObj);
        } else if (/["]/.test(abi)) {
          const abiObj = eval('([' + abi + '])');
          iface = new ethers.utils.Interface(abiObj);
        } else {
          const abiObj = eval('(["' + abi + '"])');
          iface = new ethers.utils.Interface(abiObj);
        }
        setHumanReadableAbi(iface.format(ethers.utils.FormatTypes.full));
        setFunctions(iface.functions);
        setEvents(iface.events);
        setState('abis', {
          [address]: abi
        });
      } catch (e: any) {
        setHumanReadableAbi('');
        message.error(e.message);
      }
    } else {
      setHumanReadableAbi('');
      setFunctions(undefined);
      setEvents(undefined);
      setState('abis', {
        [address]: abi
      });
    }
  }, [abi])

  useEffect(() => {
    if (provider && humanReadableAbi) {
      const contract = new ethers.Contract(address, humanReadableAbi, provider);
      setContract(contract);
    } else {
      setContract(undefined)
    }
  }, [provider, humanReadableAbi])

  const handleSelectABI = val => {
    setAbi(JSON.stringify(DEFAULT_ABIS[val]));
  }

  return (
    <>
      <div className="mt10">
        <Form.Item label="ABI">
          <Select onChange={handleSelectABI} placeholder="please select or input abi">
            {_.map(DEFAULT_ABIS, (k, key) => <Option value={key} key={key}>{key}</Option>)}
          </Select>
          <Input.TextArea value={abi} onChange={e => setAbi(e.target.value)} rows={3} placeholder="please input abi" />
        </Form.Item>

        <Form.Item label="Human-Readable ABI">
          <pre>{humanReadableAbi && JSON.stringify(humanReadableAbi, null, 2)}</pre>
        </Form.Item>
      </div>

      <Tabs>
        <Tabs.TabPane tab="code" key="item-1">
          <Code code={code} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="txs" key="txs">
          { walletAddress && <Txs txFilters={[
            { to: address }
          ]}/> }
        </Tabs.TabPane>
        { contract && <Tabs.TabPane tab="read contract" key="item-2">
          <Read contract={contract} functions={functions} />
        </Tabs.TabPane> }
        { contract && <Tabs.TabPane tab="write contract" key="item-3">
          <Write contract={contract} functions={functions} provider={provider} />
        </Tabs.TabPane> }
        <Tabs.TabPane tab="event" key="item-4">
          <Event events={events} address={address} contract={contract} />
        </Tabs.TabPane>
      </Tabs>
    </>
  )
})