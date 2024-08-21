import { Button, Form, InputNumber, Slider } from "antd";
import { ethers } from "ethers";
import { EventFragment } from "ethers/lib/utils";
import _ from "lodash";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Address from "src/components/Address";
import { useStore } from "src/hooks";

import s from "./index.module.scss";
import { observer } from "mobx-react";
import { EventsTable } from ".";
import { LoadingOutlined } from "@ant-design/icons";

export default observer(function BlockRangeLogs({ blockNumber = 20, address, eventFunc, showEventName }: {
  blockNumber?: number,
  address?: string,
  eventFunc?: EventFragment,
  showEventName?: boolean
}) {

  const { store: { provider, explorer }} = useStore();

  const [loading, setLoading] = useState(false);
  const [max, setMax] = useState(blockNumber || 20);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(max);

  const [err, setErr] = useState('');

  const [logs, setLogs] = useState<ethers.providers.Log[]>();

  useEffect(() => {
    if (blockNumber > 0) {
      setMax(blockNumber);
    }
  }, [blockNumber])

  const onChange = ([val1, val2]) => {
    setFrom(val1);
    setTo(val2);
  };

  const onLogs = async e => {
    setLoading(true);
    const topic = eventFunc ? ethers.utils.Interface.getEventTopic(eventFunc): '';

    try {

      const res = await provider.getLogs({
        address: address,
        topics: topic ? [topic] : [],
        fromBlock: from,
        toBlock: to,
      });
  
      console.log(res);
  
      if (res && res.length > 0) {
        const reversedLogs = _.sortBy(res, "blockNumber", "transactionIndex", "logIndex").reverse();
        setLogs(reversedLogs);
      } else {
        setLogs(undefined);
      }
      setErr('')
    } catch (e: any) {
      setLogs(undefined);
      setErr(e.message)
    }
    setLoading(false)
  }

  return (
    <div>
      <Form.Item label="from-to block">
        <div className={s.blockNumberRange}>
          <InputNumber
            min={0}
            max={max}
            style={{ margin: '0 16px' }}
            value={from}
            onChange={val => setFrom(val||0)}
          />
          <Slider
            min={0}
            max={max}
            range
            onChange={onChange}
            value={[from, to]}
            className={s.main}
          />
          <InputNumber
            min={0}
            max={max}
            style={{ margin: '0 16px' }}
            value={to}
            onChange={val => setTo(val||0)}
          />
        </div>
      </Form.Item>
      <Button onClick={onLogs}>logs</Button>

      <div className="mt10">
        { loading ? <LoadingOutlined /> : err ? err : logs && <EventsTable eventFunc={eventFunc} logs={logs} showColumnAddress={!address} showEventName={showEventName} /> }
      </div>
    </div>
  )
})