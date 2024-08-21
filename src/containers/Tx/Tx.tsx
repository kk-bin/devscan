import { Divider, Form, Space, Tag } from "antd";
import { ethers } from "ethers";
import _ from "lodash";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Address from "src/components/Address";
import { formItemLayout } from "src/constants";
import { formatNumber, formatUTCTime, topic2Short } from "src/utils/util";

export function TxsTable({
  txs, showBlockNumber, timestamp
}: {
  txs: ethers.providers.TransactionResponse[],
  showBlockNumber?: boolean,
  timestamp?: number,
}) {

  return (
    <>
      <table className="myTable">
        <tbody>
        <tr>
          <th>Idx</th>
          <th>Tx Hash</th>
          <th>Method</th>
          { showBlockNumber ? <th>Block</th> : null }
          { timestamp ? <th>Time</th> : null }
          <th>From</th>
          <th>To</th>
          <th>Value</th>
          <th>Fee</th>
        </tr>
        {_.map(txs, (tx, i) => {
          const { hash, data, blockNumber, from, to, value, gasLimit, gasPrice } = tx;

          return (
            <tr key={i}>
              <td>{txs.length-i}:{tx['transactionIndex']}</td>
              <td>
                <Address address={hash} url="/tx" isShort />
              </td>
              <td>
                {topic2Short(data)}
              </td>
              { showBlockNumber ? <td>
                <Link to={`/block/${blockNumber}`}>{blockNumber}</Link>:{tx['transactionIndex']}
              </td> : null }
              { timestamp ? <td>
                {formatUTCTime(timestamp)}
              </td> : null }
              <td>
                <Address address={from} url="/address" isShort />
              </td>
              <td>
                <Address address={to} url="/address" isShort />
              </td>
              <td>
                {formatNumber(+ethers.utils.formatEther(value), 10)} ETH
              </td>
              <td>
                {formatNumber(+ethers.utils.formatEther(gasLimit.mul(gasPrice||0)), 10)}
              </td>
            </tr>
          )
        })}
        </tbody>
      </table>
    </>
  )
}

function splitFunctionData(data: string) {
  if (data.length < 10) return;
  const sig = data.substring(0, 10);
  let str = data.substring(10);

  let args: string[] = []

  while (str) {
    args.push(str.substring(0, 64));
    str = str.substring(64);
  }

  return {
    sig, args
  }

}

export function TxForm({ tx, txReceipt }: {
  tx: ethers.providers.TransactionResponse,
  txReceipt?: ethers.providers.TransactionReceipt
}) {
  const { hash, blockNumber, timestamp, from, to, gasLimit, gasPrice, maxFeePerGas, maxPriorityFeePerGas, value, data, type, nonce, } = tx;
  const { status, logs, gasUsed, cumulativeGasUsed, effectiveGasPrice } = txReceipt || {};

  const splitData = splitFunctionData(data);
  return (
    <>
      <Form
        {...formItemLayout}
      >
        <Form.Item label="Transaction Hash:">
          <Address address={hash} />
        </Form.Item>
        <Form.Item label="Status:">
          {status}
        </Form.Item>
        <Form.Item label="Block:">
          <Link to={`/block/${blockNumber}`}>{`${blockNumber}`}</Link>
        </Form.Item>
        <Form.Item label="Timestamp:">
          {timestamp && formatUTCTime(timestamp)}
        </Form.Item>
        <hr />
        {/* <Form.Item label="L1 State Batch Index:">
          
        </Form.Item>

        <Form.Item label="L1 State Root Submission Tx Hash:">
          
        </Form.Item>
        <hr /> */}
        <Form.Item label="From:">
          <Address address={from} url="/address" />
        </Form.Item>
        <Form.Item label="Interacted With (To):">
          <Address address={to} url="/address" />
        </Form.Item>
          
        <hr />
        <Form.Item label="Value:">
          {+ethers.utils.formatEther(value)} ETH
        </Form.Item>
        <Form.Item label="Transaction Fee:">
          {+ethers.utils.formatEther(gasLimit.mul(gasPrice||0))} ETH
        </Form.Item>
        <Form.Item label="Gas Price:">
          {ethers.utils.formatUnits(gasPrice||0, 9)} GWei ({ethers.utils.formatEther(gasPrice||0)} ETH)
        </Form.Item>

        <hr />
        <Form.Item label="Gas Limit & Usage by Txn:">
          <Space split={<Divider type="vertical" />}>
            <div>{+gasLimit}</div>
            <div>{gasUsed && +gasUsed}</div>
          </Space>
        </Form.Item>
        <Form.Item label="Gas Fees:">
          <Space split={<Divider type="vertical" />}>
            <div>Max: {ethers.utils.formatUnits(maxFeePerGas||0, 9)} GWei</div>
            <div>Max Priority: {ethers.utils.formatUnits(maxPriorityFeePerGas||0, 9)} GWei</div>
          </Space>
        </Form.Item>
        <Form.Item label="Other Attributes:">
          <Space>
            <Tag>Txn Type: {type}</Tag>
            <Tag>Nonce: {type}</Tag>
            <Tag>Position In Block: {tx['transactionIndex']}</Tag>
          </Space>
        </Form.Item>
        <Form.Item label="Input Data:">
          {splitData ? (
            <pre>
              <div>MethodID: {splitData.sig}</div>
              {_.map(splitData.args, (arg, i) => <div key={i}>[{i}]:{i < 10 ? ' ' : ''} {arg}</div>)}
            </pre>
          ) : data }
        </Form.Item>
      </Form>
    </>
  )
}