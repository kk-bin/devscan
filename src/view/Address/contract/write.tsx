import { Collapse } from "antd";
import { ethers } from "ethers";
import { FunctionFragment } from "ethers/lib/utils";
import _ from "lodash";
import MyForm from "src/components/MyForm";
const { Panel } = Collapse;

export default function ({ functions, contract, provider }: {
  functions: { [ name: string ]: FunctionFragment }
  contract: ethers.Contract,
  provider: ethers.providers.Web3Provider
}) {


  const onChange = (key: string | string[]) => {
    console.log(key);
  };

  
  const writeFunctions = _.filter(functions, func => {
    return func.stateMutability !== 'view' && func.stateMutability !== 'pure';
  });

  const onFinish = async (writeFunc: FunctionFragment, values) => {
    const signer = provider.getUncheckedSigner();
    const signContract = contract.connect(signer);
    const tx = await signContract[writeFunc.name](...values);
    const receipt = await tx.wait();
    console.log('receipt', receipt);
  }

  return (
    <>
    <Collapse defaultActiveKey={['1']} onChange={onChange}>

      {_.map(writeFunctions, item => {
        const sig = ethers.utils.Interface.getSighash(item);
        return (
          <Panel header={`${item.name} (${sig})`} key={item.name}>
            <MyForm inputs={item.inputs} onFinish={values => onFinish(item, values)} buttonText="Write" />
          </Panel>
        )
      })}
    </Collapse>
    </>
  )
}
