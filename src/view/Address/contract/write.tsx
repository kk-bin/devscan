import { Collapse } from "antd";
import { ethers } from "ethers";
import { FunctionFragment } from "ethers/lib/utils";
import _ from "lodash";
import { useState } from "react";
import { ContractWriteFormAndStaticView } from "src/components/ContractView";
import MyForm from "src/components/MyForm";
const { Panel } = Collapse;

export default function ({ functions, contract, provider, iface }: {
  functions: { [ name: string ]: FunctionFragment }
  contract: ethers.Contract,
  provider: ethers.providers.Web3Provider,
  iface?: ethers.utils.Interface
}) {

  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const [openSigash, setOpenSighash] = useState<string>('');
  const [functionData, setFunctionData] = useState<any>();

  const onChange = (key: string | string[]) => {
    if (typeof key === 'string') {
      setActiveKeys(activeKeys.concat(key));
    } else {
      setActiveKeys(key);
    }
  };

  const onParseInputData = values => {
    const data = values[0];
    const sighash = data.substring(0, 10);
    setOpenSighash(sighash);
    setActiveKeys(activeKeys.concat(sighash));
    const iface = contract.interface;
    const ret = iface.decodeFunctionData(sighash, data);
    setFunctionData(ret);
  }
  
  const writeFunctions = _.filter(functions, func => {
    return func.stateMutability !== 'view' && func.stateMutability !== 'pure';
  });

  return (
    <>
      <MyForm inputs={[{
        name: 'Input Data',
        type: 'area'
      }]} onFinish={onParseInputData} buttonText="Parse" formItemLayout={{}} />

      <Collapse activeKey={activeKeys} onChange={onChange}>

        {_.map(writeFunctions, writeFunc => {
          const sig = ethers.utils.Interface.getSighash(writeFunc);
          return (
            <Panel header={`${writeFunc.name} (${sig})`} key={sig}>
              <ContractWriteFormAndStaticView contract={contract} provider={provider} writeFunc={writeFunc} values={sig === openSigash ? functionData : undefined }/>
            </Panel>
          )
        })}
      </Collapse>
    </>
  )
}
