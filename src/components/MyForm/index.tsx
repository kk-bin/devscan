import { Button, Form, Input } from "antd";
import { ethers } from "ethers";
import _, { values } from "lodash";
import React, { useState } from "react";
import { formItemLayout } from "src/constants";

export default function ({ inputs, onFinish, buttonText }: {
  inputs: ethers.utils.ParamType[],
  onFinish: (values: any[]) => void,
  buttonText: string
}) {

  const handleFinish = (values) => {
    const rets: any[] = [];
    _.map(inputs, (item, i) => {
      rets.push(values[`key-${i}`]);
    });
    onFinish(rets);
  }

  return (
    <Form onFinish={handleFinish} {...formItemLayout}>
      {_.map(inputs, (item, i) => {
        const label = item.name ? `${item.name}(${item.type})` : item.type;
        const name = `key-${i}`;
        return (
          <Form.Item label={label} name={name} key={name}>
            <Input placeholder={label} />
          </Form.Item>
        )
      })}

      <Form.Item wrapperCol={{ span: 18, offset: 5 }}>
        <Button type="primary" htmlType="submit">
          {buttonText}
        </Button>
      </Form.Item>
      
    </Form>
  )
}