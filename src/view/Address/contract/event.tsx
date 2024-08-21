import { Button, Collapse, Form, Input, InputNumber, Slider } from "antd";
import { EventFragment, FormatTypes } from "ethers/lib/utils";
import _ from "lodash";
import React, { useEffect, useState } from "react";

import ContractView from "src/components/ContractView";
import { BigNumber, ethers } from "ethers";
import { observer } from "mobx-react";
import { useStore } from "src/hooks";
import { formatWallet, topic2Short } from "src/utils/util";
import { Link } from "react-router-dom";
import Address from "src/components/Address";
import BlockRangeLogs from "src/containers/Event/blockRangeEvents";

const { Panel } = Collapse;

export default observer(function ({ events, address, contract }: {
  events: { [ name: string ]: EventFragment },
  address: string,
  contract?: ethers.Contract
}) {
  const { store: { provider }} = useStore();
  const [latestBlockNumber, setLatestBlockNumber] = useState<ethers.BigNumber>(BigNumber.from(0));

  const onChange = (key: string | string[]) => {
    console.log(key);
  };

  return (
    <>
    <Form.Item label="latest block">
      <ContractView provider={provider} FunctionName={'getBlockNumber'} args={[]} onChange={setLatestBlockNumber} />
    </Form.Item>
    {events ? <Collapse defaultActiveKey={['1']} onChange={onChange}>
      {_.map(events, item => {
        const topic = topic2Short(ethers.utils.Interface.getEventTopic(item));
        return (
          <Panel header={`${item.name} (${topic})`} key={item.name}>
            <BlockRangeLogs eventFunc={item} blockNumber={+latestBlockNumber} address={address}/>
          </Panel>
        )
      })}
    </Collapse> : <BlockRangeLogs blockNumber={+latestBlockNumber} address={address} showEventName />}
    </>
  )
});
