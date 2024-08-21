import CopyToClipBoard from "react-copy-to-clipboard";
import { message } from "antd";
import CopySVG from "src/asset/common/file-copy.svg";


const copyDone = () => message.success("Copied", 1);

export default function Copy({
  value, icon
}: {
  value: any,
  icon?: JSX.Element
}) {
    return (
        <CopyToClipBoard onCopy={copyDone} text={value}>
          { icon ? icon : <img src={CopySVG} style={{ cursor: "copy" }} /> }
        </CopyToClipBoard>
    );
};
