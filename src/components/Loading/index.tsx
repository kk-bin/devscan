import React, { useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";

export default function Loading({ loading = true }) {

  return (
    loading ? <LoadingOutlined /> : null
  )
}