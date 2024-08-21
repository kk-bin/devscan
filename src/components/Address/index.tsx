import { showWallet } from "src/utils/util"

import cx from 'classnames';

import CopyToClipBoard from "react-copy-to-clipboard";
import { message } from "antd";
import CopySVG from "src/asset/common/file-copy.svg";

import s from './index.module.scss';
import { Link, useNavigate } from "react-router-dom";

const copyDone = () => message.success("Copied", 1);

export default function Address({
  url = '', link = '', address, className = '', icon, isShort = false, ellipsis = false
}: {
  url?: string,
  link?: string,
  address: any,
  isShort?: boolean,
  className?: any,
  ellipsis?: boolean,
  icon?: JSX.Element
}) {
  const short = isShort ? showWallet(address, Math.ceil(address.length / 7)) : address;
  const value = address;

  const nav = useNavigate();
  const isHttpUrl = /https?:\/\//.test(url);

  return (
    <div className={cx(s.wrap, 'flex-box align-center', ellipsis ? 'lrTextEllipsis space-between' : '', className)}>
      {/* <div className={cx('flex-box align-center', ellipsis ? 'lrTextEllipsis space-between' : '')}> */}
        <span className={cx({
          [s.valid]: !!value
        })}>
          { value && url ?
            isHttpUrl
              ? <a href={`${url}${link}/${address}`} target={'_blank'}>{short}</a>
              : <Link to={`${url}${link}/${address}`}>{short}</Link>
            : value ? short : '-' }
        </span>
        { value && <CopyToClipBoard onCopy={copyDone} text={value}>
          { icon ? icon : <img src={CopySVG} style={{ cursor: "copy" }} /> }
        </CopyToClipBoard> }
      {/* </div> */}
    </div>
  );
};
