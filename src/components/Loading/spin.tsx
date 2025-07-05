import React, { useState } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const loadIcon = <LoadingOutlined style={{ fontSize: 16 }} spin />;

export default function Spinning({ loading = true, children, delay = 500 }) {

  return (
    <Spin spinning={loading} indicator={loadIcon} delay={delay}>
      {children}
    </Spin>
  )
}