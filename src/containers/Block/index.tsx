import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Form } from "antd";
import { Link } from "react-router-dom";
import { formatUTCTime } from "src/utils/util";
import {
  BlockWithTransactions
} from "@ethersproject/abstract-provider";
import { formItemLayout } from "src/constants";

export function BlockForm({ block, onClick = (e) => {} }: {
  block: BlockWithTransactions,
  onClick?: (e) => void
}) {
  const { number, timestamp, transactions, miner, difficulty, gasUsed, gasLimit, extraData, hash, parentHash, nonce} = block;
  return (
    <Form
      {...formItemLayout}
    >
      <Form.Item label="Block Height:">
        <span>{number} </span>
        <Link to={`/block/${number-1}`}><Button icon={<LeftOutlined />}></Button></Link>
        <Link to={`/block/${number+1}`}><Button icon={<RightOutlined />}></Button></Link>
      </Form.Item>
      {/* <Form.Item label="Status:">
        {}
      </Form.Item> */}
      <Form.Item label="Timestamp:">
        {formatUTCTime(timestamp)}
      </Form.Item>
      <Form.Item label="Transactions:">
        { transactions.length > 0 ? <a onClick={onClick}>{transactions.length} transactions</a> : '0 transactions' }
      </Form.Item>
      <hr />
      <Form.Item label="Mined by / Fee Recipient:">
        <Link to={`/address/${miner}`}>{miner}</Link>
      </Form.Item>
      {/* <Form.Item label="Block Reward:">
        {}
      </Form.Item> */}
      <Form.Item label="Difficulty:">
        {difficulty}
      </Form.Item>
      {/* <Form.Item label="Size:">
        {}
      </Form.Item> */}
      <hr />
      <Form.Item label="Gas Used:">
        {String(gasUsed)}
      </Form.Item>
      <Form.Item label="Gas Limit:">
        {String(gasLimit)}
      </Form.Item>
      {/* <Form.Item label="Base Fee Per Gas:">
        {}
      </Form.Item>
      <Form.Item label="Burnt Fees:">
        {}
      </Form.Item> */}
      <Form.Item label="Extra Data:">
        <span className="wrap">{extraData}</span>
      </Form.Item>
      <hr />
      <Form.Item label="Hash:">
        {hash}
      </Form.Item>
      <Form.Item label="Parent Hash:">
        <Link to={`/block/${parentHash}`}>{parentHash}</Link>
      </Form.Item>
      {/* <Form.Item label="StateRoot:">
        {}
      </Form.Item>
      <Form.Item label="WithdrawalsRoot:">
        {}
      </Form.Item> */}
      <Form.Item label="Nonce:">
        {nonce}
      </Form.Item>
    </Form>
  )
}