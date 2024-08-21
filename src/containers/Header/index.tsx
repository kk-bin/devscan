import { observer } from "mobx-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import cx from "classnames";
import { useStore } from "src/hooks";
import { Popover, message, Dropdown, Input } from 'antd';
import CopyToClipBoard from "react-copy-to-clipboard";

import { formatDecimals, getSaveWallet, showWallet } from "src/utils/util";
import { MutableRefObject, useRef } from "react";
import { NETWORK_TYPE, NETWORK_TYPE_TO_WALLET_TYPE, Operation_TEXT, TRANSACTION_STATUS, WALLET_TYPE } from "src/constants";
import { QuestionCircleOutlined, CopyOutlined, AppstoreOutlined, FundOutlined } from "@ant-design/icons";


import s from "./index.module.scss";
import { ethers } from "ethers";
import { hexDataLength } from "ethers/lib/utils";

const { Search } = Input;

export const homeTabs = [
    {
        TabName: "Home",
        path: '/home',
    },

];

const copyDone = () => message.success("Copied", 1);

const MenuComponent = function MenuComponent({
    className,
    menuItemClassName,
}: {
    className?: string;
    menuItemClassName?: string;
}) {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const handleSelect = (e, tab) => {
        e.stopPropagation();
        if (tab.external) {
            window.open(tab.path, '_blank');
            return;
        }
        navigate(tab.path);
    };

    return (
        <div className={cx(s.wrap, 'flex-box', 'align-center', className)}>
            {homeTabs.map((route) => {
                let routelink = route.path || '/';
                let active = routelink === pathname || (routelink !== '/' && pathname.includes(routelink));
                return (
                    <div
                        key={route.path}
                        onClick={(e) => handleSelect(e, route)}
                        className={cx(s.normal, menuItemClassName, { [s.menuActive]: active })}
                    >
                        {route.TabName}
                    </div>
                );
            })}
        </div>
    );
};

const WalletDetail = observer(function WalletDetail() {
    const {
        store: {
            handleChangeWallet, formatWalletAddress, walletAddress
        }
    } = useStore();

    const walletType = NETWORK_TYPE_TO_WALLET_TYPE[NETWORK_TYPE.EVM];

    return (
        <div className={s.walletWrap}>
            <div className={s.walletDetail}>
                <div className={cx(s.connect, "flex-box align-center")}>
                    <div>Connected with {walletType === WALLET_TYPE.METAMASK ? getSaveWallet() : walletType}</div>
                    <div className={s.btnWrap}>
                        <div className={s.btn} onClick={handleChangeWallet}>Change</div>
                    </div>
                </div>
                <div className="flex-box align-center">
                    <div className={cx("mr10", s.address)}>{formatWalletAddress}</div>
                    <CopyToClipBoard onCopy={copyDone} text={walletAddress}>
                        <CopyOutlined />
                    </CopyToClipBoard>
                </div>
            </div>
        </div>
    )
})

export default observer(function Header() {
    const {
        store: {
            walletAddress, balance, formatWalletAddress, handleConnectWallet
        }
    } = useStore();

    const navigate = useNavigate();


    const handleClickBrand = () => {
        window.location.href = '#'
    };

    const handleSearch = val => {
        if (ethers.utils.isAddress(val)) {
            navigate(`/address/${val}`);
        } else if (hexDataLength(val) === 32) {
            navigate(`/tx/${val}`);
        }
    }

    const popoverRef: MutableRefObject<any> = useRef();
    
    return (
        <div className={s.container}>
            <div
                className={cx(
                    s.header,
                    'container',
                    "flex-box",
                    "align-center",
                    "space-between"
                )}
            >
                <div
                    className={cx(s.left, "flex-box align-center")}
                    onClick={handleClickBrand}
                >
                    <FundOutlined className={s.logo} />
                </div>

                <div className={cx("flex-box align-center space-between", s.right)}>
                    <div className={s.menuWrap}>
                        <MenuComponent className={s.menu} menuItemClassName={s.menuItem} />
                    </div>
                    
                    <div className="flex-box align-center">
                        <div>
                            <Search placeholder="address, tx, token" onSearch={handleSearch} />
                        </div>
                        {
                            walletAddress ? (
                                <Dropdown
                                    overlay={<WalletDetail />} 
                                    getPopupContainer={() => popoverRef.current}
                                    trigger={["click"]} placement="bottomRight" 
                                    overlayClassName={s.walletMenu}
                                >
                                    <div>
                                        <div className={s.addressWrap}>
                                            <div className={cx(
                                                s.engine,
                                                "flex-box",
                                                "align-center",
                                                "justify-center"
                                            )}>
                                                <p className={s.balance}>       
                                                    {formatDecimals(balance, 5)}
                                                </p>
                                                <p className={s.address}>
                                                    {formatWalletAddress}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Dropdown>
                            ) : (
                                <div
                                    className={cx(
                                        s.addressWrap,
                                        "flex-box",
                                        "align-center",
                                        "justify-center"
                                    )}
                                    onClick={handleConnectWallet}
                                >
                                    connect wallet
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
            <div className={s.popover} ref={popoverRef}></div>
        </div>
    );
});
