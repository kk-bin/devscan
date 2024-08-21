import React, { useEffect, useState } from "react";
import {
  Block, BlockTag, BlockWithTransactions, EventType, Filter, FilterByBlockHash, ForkEvent,
  Listener, Log, Provider, TransactionReceipt, TransactionRequest, TransactionResponse
} from "@ethersproject/abstract-provider";
import { observer } from "mobx-react";
import { useStore } from "src/hooks";
import _ from "lodash";
import { isSameString } from "src/utils/util";
import { ethers } from "ethers";
import Loading from "src/components/Loading";
import { TxsTable } from "./Tx";
import { Button } from "antd";

// txFilters: [{}, {}]
// {} and
// {} or {}
export default observer(function ({ txFilters }) {
  const { store: {
    provider,
  }} = useStore();

  const [loading, setLoading] = useState(false);

  const [blockTag, setBlockTag] = useState<BlockTag>('latest');

  const [txs, setTxs] = useState<TransactionResponse[]>([]);

  // useEffect(() => {
  //   getBlockWithTransactions(blockTag);
  // }, [])

  const getBlockWithTransactions = async (blockTag) => {
    setLoading(true);
    if (blockTag < 0) {
      setLoading(false)
      return
    }
    const block = await provider.getBlockWithTransactions(blockTag);

    const nextBlockTag = block.number - 1;
    setBlockTag(nextBlockTag);

    if (block.transactions && block.transactions.length > 0) {
      const filteredTxs = _.filter(block.transactions, tx => {
        if (!txFilters || txFilters.length === 0) {
          return true;
        }
        const matchedFilter = _.find(txFilters, txFilter => {
          for (var param in txFilter) {
            if (!isSameString(tx[param], txFilter[param])) {
              return false
            }
          }
          return true;
        });
        if (matchedFilter) {
          return true;
        }
        return false
      })

      if (filteredTxs && filteredTxs.length > 0) {
        const reversedTxs = [...filteredTxs].reverse();
        const newTxs = txs.concat(reversedTxs);
        setLoading(false);
        setTxs(newTxs);
      } else {
        await getBlockWithTransactions(nextBlockTag);
      }
    } else {
      await getBlockWithTransactions(nextBlockTag);
    }
  }

  const loadMore = async () => {
    await getBlockWithTransactions(blockTag);
  }

  return (
    <>
      <TxsTable txs={txs} showBlockNumber />
      { loading ? <div>{blockTag} <Loading /></div> :
      (typeof blockTag === 'string' || blockTag >= 0) ? <Button onClick={loadMore}>LoadMore</Button> : null }
    </>
  )
})