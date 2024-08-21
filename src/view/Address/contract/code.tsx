import { Form, Input } from "antd";
import React, { useState } from "react";

export default function ({ code }) {

  return (
    <>
      <Form.Item label="code">
        <Input.TextArea value={code} readOnly />
      </Form.Item>
    </>
  )
}