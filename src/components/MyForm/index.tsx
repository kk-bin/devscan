import { Button, Form, Input, Space } from "antd";
import { useForm } from "antd/lib/form/Form";
import { ethers } from "ethers";
import _, { values } from "lodash";
import React, { useEffect, useState } from "react";
import { formItemLayout as defaultFormItemLayout, formItemLayoutWithOutLabel } from "src/constants";

export interface ParamType {
  name: string;
  type: string;
  components?: ParamType[]
}

function evalInput(item: ParamType, val) {
  if (/\[\]/.test(item.type)) {
    val = eval(val);
  } else if (item.type === 'bool') {
    val = (val === 'true' ? true : false);
  }
  return val;
}

export default function ({ inputs, onFinish, buttonText, buttons, values, formItemLayout }: {
  formItemLayout?: any,
  inputs: ParamType[],
  onFinish: (values: any[]) => void,
  values?: [],
  buttonText?: string,
  buttons?: { buttonText: string, onFinish: (values: any[]) => void }[]
}) {

  const [form] = useForm();

  useEffect(() => {
    if (values) {
      const fieldsValue = {};
      _.each(inputs, (item, i) => {
        if (_.isArray(values[i])) {
          fieldsValue[`key-${i}`] = JSON.stringify(values[i], null, 2);
        } else {
          fieldsValue[`key-${i}`] = values[i] || '';
        }
      });
      form.setFieldsValue(fieldsValue);
    }
  }, [values])

  const transValues = values => {
    const rets: any[] = [];
    _.map(inputs, (item, i) => {
      let val = values[`key-${i}`];
      if (item.type === 'tuple') {
        _.map(item.components, component => {
          val[component.name] = evalInput(component, val[component.name]);
        });
      } else {
        val = evalInput(item, val);
      }
      rets.push(val);
    });
    return rets;
  }

  const handleFinish = (values) => {
    const rets = transValues(values);
    onFinish(rets);
  }

  const handleBtnClick = () => {
    const values = form.getFieldsValue();
    const rets = transValues(values);
    return rets;
  }

  return (
    <Form onFinish={handleFinish} {...(formItemLayout || defaultFormItemLayout)} form={form}>
      {_.map(inputs, (item, i) => {
        const label = item.name ? `${item.name}(${item.type})` : item.type;
        const name = `key-${i}`;

        if (item.type === 'tuple' && item.components) {
          return _.map(item.components, (component, index) => {
            const subname = component.name;
            const subtype = component.type;
            const sublabel = `${component.name}(${component.type})`;
            return (
              <Form.Item
                {...{/*(index === 0 ? (formItemLayout || defaultFormItemLayout) : formItemLayoutWithOutLabel)*/}}
                label={label+'.'+sublabel}
                name={[name, subname]}
                key={name + '-' + subname}
              >
                { /\[\]/.test(subtype) || subtype === 'area' ? <Input.TextArea autoSize={{ minRows: 3, maxRows: 9 }} placeholder={sublabel} /> : <Input placeholder={sublabel} /> }
              </Form.Item>
            )
          });
        }
        return (
          <Form.Item label={label} name={name} key={name}>
            { /\[\]/.test(item.type) || item.type === 'area' ? <Input.TextArea autoSize={{ minRows: 3, maxRows: 9 }} placeholder={label} /> : <Input placeholder={label} /> }
          </Form.Item>
        )
      })}

      <Form.Item wrapperCol={{ span: 18, offset: 5 }}>
        <Space>
          <Button type="primary" htmlType="submit">
            {buttonText || 'Submit'}
          </Button>
          {_.map(buttons, item => {
            return (
              <Button key={item.buttonText} onClick={() => item.onFinish(handleBtnClick())}>
                {item.buttonText}
              </Button>
            )
          })}
        </Space>
      </Form.Item>
      
    </Form>
  )
}