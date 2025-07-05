import { useEffect } from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { observer } from "mobx-react";
import cx from "classnames";
import { ConfigProvider } from "antd";

import Header from "src/containers/Header";
import { useStore } from "src/hooks";

import Wallet from "./Wallet";

import s from './App.module.scss';
import Footer from "./containers/Footer";

import Home from './view/Home'
import Block from "./view/Block";
import Address from "./view/Address";
import Tx from "./view/Tx";
import Tool from "./view/Tool";

import SystemError from './view/System/error';

export default observer(function App() {

    const { store } = useStore();

    useEffect(() => {
        if (window.location.href.includes("/error")) {
            return;
        }

        if (process.env.NODE_ENV === "development") {
            window.store = store;
        }
        store.init();
    }, []);

    return (
        <div className={s.vContainer}>
            <ConfigProvider prefixCls="ant" iconPrefixCls="anticon">
                <BrowserRouter>
                    <Header />
                    <div className={cx(s.baseWrap, 'container')}>
                        <Routes>
                            <Route path={'/home'} element={<Home />} />
                            <Route path={'/address/:address'} element={<Address />} />
                            <Route path={'/block/:blockNumberOrHash'} element={<Block />} />
                            <Route path={'/tx/:hash'} element={<Tx />} />
                            <Route path={'/tools'} element={<Tool />} />
                            <Route path={'/error'} element={<SystemError />} />
                            <Route path="*" element={<Home />} />
                        </Routes>
                    </div>
                    <Footer />
                </BrowserRouter>
                <Wallet />
            </ConfigProvider>
        </div>
    );
});
