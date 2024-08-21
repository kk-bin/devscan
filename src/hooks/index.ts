import { useContext } from "react";

import { MobXProviderContext } from "mobx-react";

import Store from "../stores";

export function useStore() {
    return useContext(MobXProviderContext) as {
        store: Store,
    }
}
