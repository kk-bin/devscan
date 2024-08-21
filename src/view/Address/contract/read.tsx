import { Collapse } from "antd";
import { ethers } from "ethers";
import { FunctionFragment } from "ethers/lib/utils";
import _ from "lodash";
import React, { useState } from "react";
import ContractView, { ContractFormAndView, ContractOnlyView } from "src/components/ContractView";
import Form from "src/components/MyForm";
const { Panel } = Collapse;

export default function ({ functions, contract }: {
  functions: { [ name: string ]: FunctionFragment }
  contract: ethers.Contract
}) {


  const onChange = (key: string | string[]) => {
    console.log(key);
  };

  
  const readFunctions = _.filter(functions, func => {
    return func.stateMutability === 'view' || func.stateMutability === 'pure';
  });

  return (
    <>
    <Collapse defaultActiveKey={['1']} onChange={onChange}>

      {_.map(readFunctions, readFunc => {
        return (
          <Panel header={readFunc.name} key={readFunc.name}>
            <ContractFormAndView contract={contract} readFunc={readFunc} />
          </Panel>
        )
      })}
    </Collapse>
    </>
  )
}
