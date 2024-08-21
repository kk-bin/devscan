import { observer } from "mobx-react";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";

import s from "./index.module.scss";

import discordSVG from 'src/asset/common/discord.svg'
import twitterSVG from 'src/asset/common/twitter.svg'

export const SocialLinks = [
    {
        icon: discordSVG,
        url: "#",
    },
    {
        icon: twitterSVG,
        url: "#",
    },
];

export default observer(function Footer() {
    return (
        <div className={s.warp}>
            <div className={s.footerInner}>
                <div className={s.footerMiddle}>
                    <div className={s.right}>
                        {SocialLinks.map((icon, i) => (
                            <a
                                key={i}
                                target="_blank"
                                href={icon.url}
                            >
                                <img src={icon.icon} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
});
