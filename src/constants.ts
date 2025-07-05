import { ethers } from "ethers";

export const ALL_TAG_STRING = "";

export enum Operations {
    TransferBrc20
}

export const Operation_TEXT = {
    [Operations.TransferBrc20]: 'Transfer Brc20',
}

export const AllOptions = [
    {
        value: ALL_TAG_STRING,
        name: 'All'
    }
]

export const DEFAULT_PAGE_SIZE = 10;

export const enum OPERATE_RESULT {
    IDLE,
    SUCCESS,
    FAILED
}

export const USER_REJECTED = 'ACTION_REJECTED';

export const BigNumber0 = ethers.BigNumber.from(0);

export const pricePrecision = 3;

export const address0 = "0x0000000000000000000000000000000000000000";

export const enum TRANSACTION_STATUS {
    OPEN,
    SUCCESS,
    FAILED,
    SYSTEM_RECEIVED,
    SYSTEM_RECEIVED_FAILED,
}

export const WALLET_TYPE = {
    UNISAT: 'unisat',
    METAMASK: 'metamask'
}

export const SIGNATURE_PREF = 'REQUEST SIGNATURE ';

export const Status = {
    Pending: 1,
    Success: 2,
    Claimed: 3,
    Failed: 4,
}

export const Status_TEXT = {
    [Status.Pending]: 'Pending',
    [Status.Success]: 'Success',
    [Status.Claimed]: 'Success',
    [Status.Failed]: 'Fail'
}
export const NETWORK_TYPE = {
    BTC: 1,
    EVM: 2,
    L3: 3,
    SOL: 4
}


export const NETWORK_TYPE_TO_WALLET_TYPE = {
    [NETWORK_TYPE.BTC]: WALLET_TYPE.UNISAT,
    [NETWORK_TYPE.EVM]: WALLET_TYPE.METAMASK,
    [NETWORK_TYPE.L3]: WALLET_TYPE.METAMASK,
}

export const ERC20ABI = [
    // Read-Only Functions
    'function balanceOf(address owner) view returns (uint256)',
    'function decimals() view returns (uint8)',
    'function symbol() view returns (string)',
    'function allowance(address owner, address spender) external view returns (uint256)',
    
    // Authenticated Functions
    'function transfer(address to, uint amount) returns (bool)',
    'function approve(address _spender, uint256 _value) returns (bool)',
    'function transferFrom(address sender, address recipient, uint256 amount) external returns (bool)',
    
    // Events
    'event Transfer(address indexed from, address indexed to, uint amount)',
]

export const formItemLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 17 },
};

export const formItemLayoutWithOutLabel = {
  wrapperCol: {
    span: 17,
    offset: 7
  },
};

export const networkId = "1";
export const networksParams = {
  '421613': {
    chainId: '0x'+ (421613).toString(16),
    rpcUrls: ['https://endpoints.omniatech.io/v1/arbitrum/goerli/public', 'https://arbitrum-goerli.publicnode.com'],
    chainName: 'Arbitrum Goerli',
    nativeCurrency: { name: 'AGOR', decimals: 18, symbol: 'AGOR' },
    blockExplorerUrls: ['https://goerli-rollup-explorer.arbitrum.io'],
  },
  '42161': {
    chainId: '0x'+ (42161).toString(16),
    rpcUrls: ['https://arb1.arbitrum.io/rpc', 'https://1rpc.io/arb'],
    chainName: 'Arbitrum One',
    nativeCurrency: { name: 'ETH', decimals: 18, symbol: 'ETH' },
    blockExplorerUrls: ['https://arbiscan.io'],
  }
}