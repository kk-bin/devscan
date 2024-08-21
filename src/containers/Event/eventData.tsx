import { Form, Tag } from "antd";
import { ethers } from "ethers";
import { EventFragment, FormatTypes } from "ethers/lib/utils";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import Address from "src/components/Address";
import { safeValue } from "src/utils/util";

const formItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 22 },
};


function splitEventData(data: string) {
  if (data.length < 3) return [data];
  let str = data.substring(2);

  let args: string[] = ['0x']

  while (str) {
    args.push(str.substring(0, 64));
    str = str.substring(64);
  }

  return args;

}

export default function ({
  eventFunc, log, showAddress, showEventName,
}: {
  log: ethers.providers.Log,
  eventFunc?: EventFragment,
  showAddress?: boolean,
  showEventName?: boolean
}) {
  const [logDescription, setLogDescription] = useState<ethers.utils.LogDescription>();

  useEffect(() => {
    if (eventFunc) {
      const iface = new ethers.utils.Interface([eventFunc]);
      const logDescription = iface.parseLog(log);
      console.log('logDescription', logDescription);
      setLogDescription(logDescription);
    }
  }, [eventFunc])

  return (
    <div style={{minWidth: 590}}>
      { showAddress && <Form.Item label="Address" {...formItemLayout}>
          <Address address={log.address} url="/address" />
      </Form.Item> }
      { eventFunc && showEventName && <Form.Item label="Name" {...formItemLayout}>
        {eventFunc.format(FormatTypes.full)}
      </Form.Item> }

      <Form.Item label="Topics" {...formItemLayout}>
        <div><Tag>0</Tag><span className="pre">{log.topics[0]}</span></div>
        {eventFunc && logDescription ? _.filter(eventFunc.inputs, item => item.indexed).map((paramType, i) => {
            return (
              <div key={paramType.name}>
                <Tag>{i+1}: {paramType.name}</Tag><span className="pre">{safeValue(logDescription.args[paramType.name])}</span>
              </div>
            )
          }) : _.map(log.topics.slice(1), (topic, i) => {
          return (
            <div key={i}>
              <Tag>{i+1}</Tag><span className="pre">{topic}</span>
            </div>
          )
        })}
      </Form.Item>

      <Form.Item label="Data" {...formItemLayout}>
        <pre>
          {eventFunc && logDescription ? _.filter(eventFunc.inputs, item => !item.indexed).map(paramType => {
            return (
              <div key={paramType.name}>
                {paramType.name}: {safeValue(logDescription.args[paramType.name])}
              </div>
            )
          }) : _.map(splitEventData(log.data), (item, i) => <div key={i}>{item}</div>)}
        </pre>
      </Form.Item>
    </div>
  )
}