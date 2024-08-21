import { Form } from "antd";
import { ethers } from "ethers";
import _ from "lodash";
import { useEffect, useState } from "react";
import { ERC20ABI } from "src/constants";
import { useStore } from "src/hooks";
import MyForm from "../MyForm";
import { FunctionFragment } from "ethers/lib/utils";
import { LoadingOutlined } from "@ant-design/icons";

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
}) {
  const [val, setVal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (args && provider) {
      init();
    }
  }, [provider, args]);

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

  const outs = _.map(readFunc.outputs, item => item.name ? `${item.name}(${item.type})` : item.type);

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