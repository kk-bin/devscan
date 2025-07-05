import { Form, Input } from "antd";
import { ethers } from "ethers";
import _, { values } from "lodash";
import { useEffect, useRef, useState } from "react";
import { ERC20ABI } from "src/constants";
import { useStore } from "src/hooks";
import MyForm, { ParamType } from "../MyForm";
import { FormatTypes, FunctionFragment } from "ethers/lib/utils";
import { LoadingOutlined } from "@ant-design/icons";
import Spinning from "../Loading/spin";

// Contract or provider
export default function({
  provider,
  address = '',
  ABI = ERC20ABI,
  FunctionName,
  args,
  onChange = val => {},
  callback = val => val,
  valueRender = (node, loading?) => loading || node,
  interval = 0,
}) {
  const [val, setVal] = useState(null);
  const [loading, setLoading] = useState(true);
  const timer = useRef<any>(null);

  const clearTimer = () => {
    if (timer.current) {
      clearInterval(timer.current);
    }
  }

  useEffect(() => {
    return () => {
      clearTimer();
    }
  }, []);

  useEffect(() => {
    if (args && provider) {
      init();
    }
  }, [provider, args]);

  useEffect(() => {
    if (args && provider && interval > 0) {
      clearTimer();
      timer.current = setInterval(() => {
        init();
      }, interval);
    }
  }, [provider, args, interval]);

  const init = async function () {
    setLoading(true);
    let query;
    try {
      if (address) {
        const contract = new ethers.Contract(address, ABI, provider);
        query = contract[FunctionName](...args);
      } else {
        query = provider[FunctionName](...args);
      }
      const val = await query;
      // console.log(FunctionName, val);
      setVal(val);
      onChange(val);
    } catch (e: any) {
      console.error(e);
      // setVal(e.message);
    }
    setLoading(false);
  }

  if (val !== null || loading) {
    try {
      if (interval > 0) {
        return <Spinning loading={loading}>{val && callback(val)}</Spinning>
      }
      return <>{valueRender(val && callback(val), loading && <LoadingOutlined />)}</>;
    } catch (e: any) {
      console.error('ContractView', FunctionName, e);
    }
  }

  return <>-</>;
}

export const ContractOnlyView = function({
  contract,
  FunctionName,
  args,
  valueRender = (val, loading?) => loading || val.toString()
}) {
  const [val, setVal] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (args && contract) {
      init();
    }
  }, [contract, args]);

  const init = async function () {
    try {
      setLoading(true);
      const val = await contract[FunctionName](...args);
      // console.log(FunctionName, val);
      setVal(val);
    } catch (e: any) {
      console.error(e);
      setVal(e.message);
    }
    setLoading(false);
  }

  if (val !== null || loading) {
    try {
      return <>{valueRender(val, loading && <LoadingOutlined />)}</>;
    } catch (e: any) {
      console.error('ContractOnlyView', FunctionName, e);
    }
  }

  return null;
}

export const ContractFormAndView = function({ contract, readFunc }: {
  contract: ethers.Contract,
  readFunc: ethers.utils.FunctionFragment,
}) {

  const [args, setArgs] = useState<any[]>();

  const outs = _.map(readFunc.outputs, item => item.name ? `${item.name}(${item.type})` : `(${item.type})`);

  const onFinish = async (readFunc: FunctionFragment, values) => {
    const args: any[] = [];
    _.each(readFunc.inputs, (item, i) => {
      args.push(values[i]);
    });
    setArgs(args);
  }

  return (
    <>
      <MyForm inputs={readFunc.inputs} onFinish={values => onFinish(readFunc, values)} buttonText="Query" />
      {outs.join(',')} : <ContractOnlyView contract={contract} args={args} FunctionName={readFunc.name} />
    </>
  )
}

export const ContractWriteFormAndStaticView = function({ contract, writeFunc, provider, values }: {
  writeFunc: ethers.utils.FunctionFragment,
  values?: [],
  contract: ethers.Contract,
  provider: ethers.providers.Web3Provider,
}) {

  const [inputData, setInputData] = useState('');
  const [args, setArgs] = useState<any[]>();
  const [contractStatic, setContractStatic] = useState<any>();

  const outs = _.map(writeFunc.outputs, item => item.name ? `${item.name}(${item.type})` : `(${item.type})`);

  const transArgs = values => {
    const args: any[] = [];
    let i = 0;
    for (; i < writeFunc.inputs.length; i++) {
      args.push(values[i]);
    }
    if (writeFunc.payable && values[i]) {
      args.push({
        value: ethers.BigNumber.from(values[i]),
      })
    }
    return args;
  }

  const onFinish = async (writeFunc: FunctionFragment, values) => {
    const signer = provider.getSigner(0);
    const signContract = contract.connect(signer);
    setContractStatic(signContract.callStatic);

    const args: any[] = transArgs(values);
    setArgs(args);
  }

  const onWrite = async (writeFunc: FunctionFragment, values) => {
    const signer = provider.getSigner(0);
    const signContract = contract.connect(signer);
    const args: any[] = transArgs(values);
    const tx = await signContract[writeFunc.name](...args);
    console.log('hash', tx.hash);
    const receipt = await tx.wait();
    console.log('receipt', receipt);
  }

  const onEncodeFuntionData = values => {
    const args: any[] = transArgs(values);
    try {
      const ret = contract.interface.encodeFunctionData(writeFunc, args);
      setInputData(ret);
    } catch (e: any) {
      setInputData(e.message);
    }
  }

  let inputs: ParamType[] = _.clone(writeFunc.inputs);
  if (writeFunc.payable) {
    inputs = inputs.concat([{
      name: 'payable',
      type: 'number'
    }]);
  }

  const hasReturns = outs.length > 0;

  let functionName = writeFunc.name;
  if (contractStatic && !contractStatic[functionName]) {
    functionName = `${writeFunc.name}(${_.map(writeFunc.inputs, item => item.type).join(',')})`;
  }
  
  return (
    <>
      <MyForm inputs={inputs} values={values} onFinish={values => onWrite(writeFunc, values)} buttonText="Write" buttons={[
        {
          buttonText: 'Encode',
          onFinish: onEncodeFuntionData
        },
        {
          buttonText: 'Static Write',
          onFinish: values => onFinish(writeFunc, values)
        }
      ]} />
      {<>{hasReturns ? outs.join(',') : '(void)'} :</>} <ContractOnlyView contract={contractStatic} args={args} FunctionName={functionName} />
      {inputData && (
        <Form.Item label="Encode">
          <Input.TextArea autoSize={{ minRows: 3, maxRows: 9 }} disabled value={inputData} />
        </Form.Item>
      )}
    </>
  )
}