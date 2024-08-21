import { Tag } from "antd";
import { ethers } from "ethers";
import _ from "lodash";
import React, { useState } from "react";
import EventData from "./eventData";

import s from "./index.module.scss";
import { EventFragment } from "ethers/lib/utils";
import { Link } from "react-router-dom";
import Address from "src/components/Address";

export function EventsInTxReceipt({ logs }: {
  logs: ethers.providers.Log[]
}) {

  return (
    <>
      <h4>Transaction Receipt Event Logs</h4>
      {_.map(logs, (log, i) => {
        const { address: address1, blockNumber, blockHash, removed, data, logIndex, topics, transactionHash, transactionIndex} = log;

        return (
          <div key={`${blockNumber}:${transactionIndex}-${logIndex}`} className={s.txHorizontal}>
            <div><Tag color="blue">{logIndex}</Tag></div>
            <div className={s.main}>
              <EventData log={log} showAddress showEventName />
            </div>
          </div>
        )
      })}
    </>
  )
}


export function EventsTable({ logs, eventFunc, showColumnAddress, showEventName }: {
  logs: ethers.providers.Log[],
  eventFunc?: EventFragment,
  showColumnAddress?: boolean
  showEventName?: boolean
}) {
  return (
    <table className="myTable">
      <tbody>
      <tr>
        <th>Idx</th>
        <th>Block</th>
        <th>Tx</th>
        { showColumnAddress ? <th>Address</th> : null }
        <th>Args</th>
      </tr>
      {_.map(logs, (log, i) => {
        const { address: address1, blockNumber, blockHash, removed, data, logIndex, topics, transactionHash, transactionIndex} = log;

        return (
          <tr key={`${blockNumber}:${transactionIndex}-${logIndex}`}>
            <td>{logs.length - i}</td>
            <td>
              <Link to={`/block/${blockNumber}`}>{blockNumber}</Link>:{transactionIndex}-{logIndex}
            </td>
            <td>
              <Address address={transactionHash} url="/tx" isShort />
            </td>
            { showColumnAddress ? <td>
              <Address address={address1} url="/address" isShort />
            </td> : null }

            <td>
              <EventData log={log} eventFunc={eventFunc} showEventName={showEventName} />
            </td>
          </tr>
        )
      })}
      </tbody>
    </table>
  )
}