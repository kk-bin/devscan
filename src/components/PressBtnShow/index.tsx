import { Button } from "antd"
import { useState } from "react"

export default function PressBtnShow({ children, buttonText }) {
  const [visible, setVisible] = useState(false)
  return (
      <>
          <Button onClick={e => setVisible(true)}>{buttonText}</Button>
          {visible ? children : null}
      </>
  )
}