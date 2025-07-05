import { observer } from "mobx-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import s from "./index.module.scss";
import ContractView from "src/components/ContractView";
import { useStore } from "src/hooks";
import Spinning from "src/components/Loading/spin";

// import discordSVG from 'src/asset/common/discord.svg'
// import twitterSVG from 'src/asset/common/twitter.svg'

// export const SocialLinks = [
//     {
//         icon: discordSVG,
//         url: "#",
//     },
//     {
//         icon: twitterSVG,
//         url: "#",
//     },
// ];

export default observer(function Footer() {
    const { store: {
        provider,
    }} = useStore();

    const [loading, setLoading] = useState(true);
    const [blockNum, setBlockNum] = useState(0);

    const clearTimer = () => {
        provider.off('block');
    }

    useEffect(() => {
        return () => {
         clearTimer()
        }
     }, []);

    useEffect(() => {
        if (provider) {
            clearTimer();
            provider.on('block', (blockNumber) => {
                setBlockNum(blockNumber);
                setLoading(false);
            });
        }
    }, [provider]);

    setTimeout(() => {
        setLoading(true);
    }, 1000);
      
    return (
        <div className={s.warp}>
            <div className={s.footerInner}>
                <div className={s.footerMiddle}>
                    <Spinning loading={loading} delay={500}>
                        {blockNum}
                    </Spinning>
                    {/* <div className={s.right}>
                        {SocialLinks.map((icon, i) => (
                            <a
                                key={i}
                                target="_blank"
                                href={icon.url}
                            >
                                <img src={icon.icon} />
                            </a>
                        ))}
                    </div> */}
                </div>
            </div>
        </div>
    );
});
