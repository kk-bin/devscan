(function (root, factory) {
  // @ts-ignore
  typeof define === 'function' && define.amd ? define([], factory) :
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  root.BlockChainConstants = factory();
}(this, function () { 'use strict';


const SupportedChainId = {
  MAINNET: 1,
  GOERLI: 5,
  ARBITRUM_ONE: 42161,
  ARBITRUM_GOERLI: 421613,
  OPTIMISM: 10,
  OPTIMISM_GOERLI: 420,
  POLYGON: 137,
  POLYGON_MUMBAI: 80001,
  CELO: 42220,
  CELO_ALFAJORES: 44787,
  BNB: 56
}

// Human-Readable Contract ABIs
// https://blog.ricmoo.com/human-readable-contract-abis-in-ethers-js-141902f4d917
// https://docs.ethers.org/v6/api/abi/#InterfaceAbi
const ERC20_ABI = [
  "function name() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",

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

const ERC721_ABI = [
  "event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)",
  "event ApprovalForAll(address indexed owner, address indexed operator, bool approved)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  "function approve(address to, uint256 tokenId)",
  "function balanceOf(address owner) view returns (uint256)",
  "function getApproved(uint256 tokenId) view returns (address)",
  "function isApprovedForAll(address owner, address operator) view returns (bool)",
  "function name() view returns (string)",
  "function safeTransferFrom(address from, address to, uint256 tokenId)",
  "function setApprovalForAll(address operator, bool approved)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function transferFrom(address from, address to, uint256 tokenId)",
  "function transferOwnership(address newOwner)",
  "function mint(address player) returns (uint256)",
  "function burn(uint256 tokenId)",
]

const WETH_ABI = [
  // Wrap ETH
  'function deposit() payable',

  // Unwrap ETH
  'function withdraw(uint wad) public',
].concat(ERC20_ABI);

const PAIR_ABI = [
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
  "event Burn(address indexed sender, uint256 amount0, uint256 amount1, address indexed to)",
  "event Mint(address indexed sender, uint256 amount0, uint256 amount1)",
  "event Swap(address indexed sender, uint256 amount0In, uint256 amount1In, uint256 amount0Out, uint256 amount1Out, address indexed to)",
  "event Sync(uint112 reserve0, uint112 reserve1)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "function DOMAIN_SEPARATOR() view returns (bytes32)",
  "function MINIMUM_LIQUIDITY() view returns (uint256)",
  "function PERMIT_TYPEHASH() view returns (bytes32)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 value) returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function burn(address to) returns (uint256 amount0, uint256 amount1)",
  "function decimals() view returns (uint8)",
  "function factory() view returns (address)",
  "function getReserves() view returns (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast)",
  "function initialize(address _token0, address _token1)",
  "function kLast() view returns (uint256)",
  "function mint(address to) returns (uint256 liquidity)",
  "function name() view returns (string)",
  "function nonces(address) view returns (uint256)",
  "function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)",
  "function price0CumulativeLast() view returns (uint256)",
  "function price1CumulativeLast() view returns (uint256)",
  "function skim(address to)",
  "function swap(uint256 amount0Out, uint256 amount1Out, address to, bytes data)",
  "function symbol() view returns (string)",
  "function sync()",
  "function token0() view returns (address)",
  "function token1() view returns (address)",
  "function totalSupply() view returns (uint256)",
  "function transfer(address to, uint256 value) returns (bool)",
  "function transferFrom(address from, address to, uint256 value) returns (bool)"
]

const FACTORY_ABI = [
  "event PairCreated(address indexed token0, address indexed token1, address pair, uint256)",
  "function allPairs(uint256) view returns (address)",
  "function allPairsLength() view returns (uint256)",
  "function createPair(address tokenA, address tokenB) returns (address pair)",
  "function feeTo() view returns (address)",
  "function feeToSetter() view returns (address)",
  "function getPair(address, address) view returns (address)",
  "function setFeeTo(address _feeTo)",
  "function setFeeToSetter(address _feeToSetter)"
]

const ROUTER02_ABI = [
  "function WETH() view returns (address)",
  "function addLiquidity(address tokenA, address tokenB, uint256 amountADesired, uint256 amountBDesired, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline) returns (uint256 amountA, uint256 amountB, uint256 liquidity)",
  "function addLiquidityETH(address token, uint256 amountTokenDesired, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline) payable returns (uint256 amountToken, uint256 amountETH, uint256 liquidity)",
  "function factory() view returns (address)",
  "function getAmountIn(uint256 amountOut, uint256 reserveIn, uint256 reserveOut) pure returns (uint256 amountIn)",
  "function getAmountOut(uint256 amountIn, uint256 reserveIn, uint256 reserveOut) pure returns (uint256 amountOut)",
  "function getAmountsIn(uint256 amountOut, address[] path) view returns (uint256[] amounts)",
  "function getAmountsOut(uint256 amountIn, address[] path) view returns (uint256[] amounts)",
  "function quote(uint256 amountA, uint256 reserveA, uint256 reserveB) pure returns (uint256 amountB)",
  "function removeLiquidity(address tokenA, address tokenB, uint256 liquidity, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline) returns (uint256 amountA, uint256 amountB)",
  "function removeLiquidityETH(address token, uint256 liquidity, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline) returns (uint256 amountToken, uint256 amountETH)",
  "function removeLiquidityETHSupportingFeeOnTransferTokens(address token, uint256 liquidity, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline) returns (uint256 amountETH)",
  "function removeLiquidityETHWithPermit(address token, uint256 liquidity, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline, bool approveMax, uint8 v, bytes32 r, bytes32 s) returns (uint256 amountToken, uint256 amountETH)",
  "function removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(address token, uint256 liquidity, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline, bool approveMax, uint8 v, bytes32 r, bytes32 s) returns (uint256 amountETH)",
  "function removeLiquidityWithPermit(address tokenA, address tokenB, uint256 liquidity, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline, bool approveMax, uint8 v, bytes32 r, bytes32 s) returns (uint256 amountA, uint256 amountB)",
  "function swapETHForExactTokens(uint256 amountOut, address[] path, address to, uint256 deadline) payable returns (uint256[] amounts)",
  "function swapExactETHForTokens(uint256 amountOutMin, address[] path, address to, uint256 deadline) payable returns (uint256[] amounts)",
  "function swapExactETHForTokensSupportingFeeOnTransferTokens(uint256 amountOutMin, address[] path, address to, uint256 deadline) payable",
  "function swapExactTokensForETH(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline) returns (uint256[] amounts)",
  "function swapExactTokensForETHSupportingFeeOnTransferTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)",
  "function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline) returns (uint256[] amounts)",
  "function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)",
  "function swapTokensForExactETH(uint256 amountOut, uint256 amountInMax, address[] path, address to, uint256 deadline) returns (uint256[] amounts)",
  "function swapTokensForExactTokens(uint256 amountOut, uint256 amountInMax, address[] path, address to, uint256 deadline) returns (uint256[] amounts)"
]

const UNIVERSAL_ROUTER_ABI = [
  "constructor(tuple(address permit2, address weth9, address seaportV1_5, address seaportV1_4, address openseaConduit, address nftxZap, address x2y2, address foundation, address sudoswap, address elementMarket, address nft20Zap, address cryptopunks, address looksRareV2, address routerRewardsDistributor, address looksRareRewardsDistributor, address looksRareToken, address v2Factory, address v3Factory, bytes32 pairInitCodeHash, bytes32 poolInitCodeHash) params)",
  "error BalanceTooLow()",
  "error BuyPunkFailed()",
  "error ContractLocked()",
  "error ETHNotAccepted()",
  "error ExecutionFailed(uint256 commandIndex, bytes message)",
  "error FromAddressIsNotOwner()",
  "error InsufficientETH()",
  "error InsufficientToken()",
  "error InvalidBips()",
  "error InvalidCommandType(uint256 commandType)",
  "error InvalidOwnerERC1155()",
  "error InvalidOwnerERC721()",
  "error InvalidPath()",
  "error InvalidReserves()",
  "error InvalidSpender()",
  "error LengthMismatch()",
  "error SliceOutOfBounds()",
  "error TransactionDeadlinePassed()",
  "error UnableToClaim()",
  "error UnsafeCast()",
  "error V2InvalidPath()",
  "error V2TooLittleReceived()",
  "error V2TooMuchRequested()",
  "error V3InvalidAmountOut()",
  "error V3InvalidCaller()",
  "error V3InvalidSwap()",
  "error V3TooLittleReceived()",
  "error V3TooMuchRequested()",
  "event RewardsSent(uint256 amount)",
  "function collectRewards(bytes looksRareClaim)",
  "function execute(bytes commands, bytes[] inputs) payable",
  "function execute(bytes commands, bytes[] inputs, uint256 deadline) payable",
  "function onERC1155BatchReceived(address, address, uint256[], uint256[], bytes) pure returns (bytes4)",
  "function onERC1155Received(address, address, uint256, uint256, bytes) pure returns (bytes4)",
  "function onERC721Received(address, address, uint256, bytes) pure returns (bytes4)",
  "function supportsInterface(bytes4 interfaceId) pure returns (bool)",
  "function uniswapV3SwapCallback(int256 amount0Delta, int256 amount1Delta, bytes data)"
]

const networksParams = {
  "1": {
    "name": "Ethereum Mainnet",
    "chainId": 1,
    "currencySymbol": "ETH",
    "faucet": "",
    "infoURL": "https://ethereum.org",
    "browser": "https://etherscan.io",
    "rpc": [
      "https://api.mycryptoapi.com/eth",
      "https://cloudflare-eth.com",
      "https://rpc.flashbots.net",
      "https://eth-mainnet.gateway.pokt.network/v1/5f3453978e354ab992c4da79",
      "https://mainnet-nethermind.blockscout.com",
      "https://nodes.mewapi.io/rpc/eth",
      "https://main-rpc.linkpool.io",
      "https://mainnet.eth.cloud.ava.do",
      "https://ethereumnodelight.app.runonflux.io",
      "https://rpc.ankr.com/eth",
      "https://eth-rpc.gateway.pokt.network",
      "https://main-light.eth.linkpool.io",
      "https://eth-mainnet.public.blastapi.io"
    ]
  },
  "4": {
    "name": "Rinkeby",
    "chainId": 4,
    "currencySymbol": "RIN",
    "faucet": "http://fauceth.komputing.org?chain=4&address=${ADDRESS}",
    "infoURL": "https://www.rinkeby.io",
    "browser": "https://rinkeby.etherscan.io",
    "rpc": [
      "https://rinkeby.infura.io/v3/${INFURA_API_KEY}",
      "wss://rinkeby.infura.io/ws/v3/${INFURA_API_KEY}"
    ]
  },
  "10": {
    "name": "Optimism",
    "chainId": 10,
    "currencySymbol": "ETH",
    "faucet": "",
    "infoURL": "https://optimism.io",
    "browser": "https://optimistic.etherscan.io",
    "rpc": [
      "https://mainnet.optimism.io",
      "https://optimism-mainnet.public.blastapi.io"
    ]
  },
  "42": {
    "name": "Kovan",
    "chainId": 42,
    "currencySymbol": "KOV",
    "faucet": "http://fauceth.komputing.org?chain=42&address=${ADDRESS}",
    "infoURL": "https://kovan-testnet.github.io/website",
    "browser": "https://kovan.etherscan.io",
    "rpc": [
      "https://kovan.poa.network",
      "http://kovan.poa.network:8545",
      "https://kovan.infura.io/v3/${INFURA_API_KEY}",
      "wss://kovan.infura.io/ws/v3/${INFURA_API_KEY}",
      "ws://kovan.poa.network:8546"
    ]
  },
  "56": {
    "name": "Binance Smart Chain Mainnet",
    "chainId": 56,
    "currencySymbol": "BNB",
    "faucet": "https://free-online-app.com/faucet-for-eth-evm-chains/",
    "infoURL": "https://www.binance.org",
    "browser": "https://bscscan.com",
    "rpc": [
      "https://bsc-dataseed1.binance.org",
      "https://bsc-dataseed2.binance.org",
      "https://bsc-dataseed3.binance.org",
      "https://bsc-dataseed4.binance.org",
      "https://bsc-dataseed1.defibit.io",
      "https://bsc-dataseed2.defibit.io",
      "https://bsc-dataseed3.defibit.io",
      "https://bsc-dataseed4.defibit.io",
      "https://bsc-dataseed1.ninicoin.io",
      "https://bsc-dataseed2.ninicoin.io",
      "https://bsc-dataseed3.ninicoin.io",
      "https://bsc-dataseed4.ninicoin.io",
      "wss://bsc-ws-node.nariox.org",
      "https://bsc-dataseed.binance.org",
      "https://rpc.ankr.com/bsc",
      "https://bscrpc.com",
      "https://bsc.mytokenpocket.vip",
      "https://binance.nodereal.io",
      "https://rpc-bsc.bnb48.club"
    ]
  },
  "69": {
    "name": "Optimism Kovan",
    "chainId": 69,
    "currencySymbol": "KOR",
    "faucet": "http://fauceth.komputing.org?chain=69&address=${ADDRESS}",
    "infoURL": "https://optimism.io",
    "browser": "https://kovan-optimistic.etherscan.io",
    "rpc": [
      "https://kovan.optimism.io/"
    ]
  },
  "97": {
    "name": "Binance Smart Chain Testnet",
    "chainId": 97,
    "currencySymbol": "tBNB",
    "faucet": "https://testnet.binance.org/faucet-smart",
    "infoURL": "https://testnet.binance.org/",
    "browser": "https://testnet.bscscan.com",
    "rpc": [
      "https://data-seed-prebsc-1-s1.binance.org:8545",
      "https://data-seed-prebsc-2-s1.binance.org:8545",
      "https://data-seed-prebsc-1-s2.binance.org:8545",
      "https://data-seed-prebsc-2-s2.binance.org:8545",
      "https://data-seed-prebsc-1-s3.binance.org:8545",
      "https://data-seed-prebsc-2-s3.binance.org:8545"
    ]
  },
  "137": {
    "name": "Polygon Mainnet",
    "chainId": 137,
    "currencySymbol": "MATIC",
    "faucet": "",
    "infoURL": "https://polygon.technology/",
    "browser": "https://polygonscan.com",
    "rpc": [
      "https://polygon-rpc.com",
      "https://rpc-mainnet.matic.network",
      "https://matic-mainnet.chainstacklabs.com",
      "https://rpc-mainnet.maticvigil.com",
      "https://rpc-mainnet.matic.quiknode.pro",
      "https://matic-mainnet-full-rpc.bwarelabs.com",
      "https://matic-mainnet-archive-rpc.bwarelabs.com",
      "https://poly-rpc.gateway.pokt.network",
      "https://rpc.ankr.com/polygon",
      "https://polygon-mainnet.public.blastapi.io"
    ]
  },
  "250": {
    "name": "Fantom Opera",
    "chainId": 250,
    "currencySymbol": "FTM",
    "faucet": "https://free-online-app.com/faucet-for-eth-evm-chains/",
    "infoURL": "https://fantom.foundation",
    "browser": "https://ftmscan.com",
    "rpc": [
      "https://rpc.ftm.tools",
      "https://fantom-mainnet.gateway.pokt.network/v1/lb/62759259ea1b320039c9e7ac",
      "https://rpc.ankr.com/fantom",
      "https://rpc.fantom.network",
      "https://rpc2.fantom.network",
      "https://rpc3.fantom.network",
      "https://rpcapi.fantom.network",
      "https://fantom-mainnet.public.blastapi.io"
    ]
  },
  "4002": {
    "name": "Fantom Testnet",
    "chainId": 4002,
    "currencySymbol": "FTM",
    "faucet": "https://faucet.fantom.network",
    "infoURL": "https://docs.fantom.foundation/quick-start/short-guide#fantom-testnet",
    "browser": "https://testnet.ftmscan.com",
    "rpc": [
      "https://rpc.testnet.fantom.network"
    ]
  },
  "42161": {
    "name": "Arbitrum One",
    "chainId": 42161,
    "currencySymbol": "ETH",
    "faucet": "",
    "infoURL": "https://arbitrum.io",
    "browser": "https://arbiscan.io",
    "rpc": [
      "https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}",
      "https://arb1.arbitrum.io/rpc",
      "wss://arb1.arbitrum.io/ws",
      "https://rpc.ankr.com/arbitrum"
    ]
  },
  '421613': {
    name: 'Arbitrum Goerli',
    chainId: 421613,
    currencySymbol: 'AGOR',
    nativeCurrency: { name: 'AGOR', decimals: 18, symbol: 'AGOR' },
    faucet: '',
    infoURL: '',
    browser: 'https://goerli-rollup-explorer.arbitrum.io',
    rpc: ['https://endpoints.omniatech.io/v1/arbitrum/goerli/public', 'https://arbitrum-goerli.publicnode.com'],
  },
  "43113": {
    "name": "Avalanche Fuji Testnet",
    "chainId": 43113,
    "currencySymbol": "AVAX",
    "faucet": "https://faucet.avax-test.network/",
    "infoURL": "https://cchain.explorer.avax-test.network",
    "browser": "https://testnet.snowtrace.io",
    "rpc": [
      "https://api.avax-test.network/ext/bc/C/rpc"
    ]
  },
  "43114": {
    "name": "Avalanche C-Chain",
    "chainId": 43114,
    "currencySymbol": "AVAX",
    "faucet": "https://free-online-app.com/faucet-for-eth-evm-chains/",
    "infoURL": "https://www.avax.network/",
    "browser": "https://snowtrace.io",
    "rpc": [
      "https://api.avax.network/ext/bc/C/rpc",
      "https://rpc.ankr.com/avalanche",
      "https://ava-mainnet.public.blastapi.io/ext/bc/C/rpc"
    ]
  },
  "80001": {
    "name": "Mumbai",
    "chainId": 80001,
    "currencySymbol": "MATIC",
    "faucet": "https://faucet.polygon.technology/",
    "infoURL": "https://polygon.technology/",
    "browser": "https://mumbai.polygonscan.com",
    "rpc": [
      "https://matic-mumbai.chainstacklabs.com",
      "https://rpc-mumbai.maticvigil.com",
      "https://matic-testnet-archive-rpc.bwarelabs.com"
    ]
  },
  "421611": {
    "name": "Arbitrum Rinkeby",
    "chainId": 421611,
    "currencySymbol": "ARETH",
    "faucet": "http://fauceth.komputing.org?chain=421611&address=${ADDRESS}",
    "infoURL": "https://arbitrum.io",
    "browser": "https://rinkeby-explorer.arbitrum.io",
    "rpc": [
      "https://rinkeby.arbitrum.io/rpc",
      "wss://rinkeby.arbitrum.io/ws"
    ]
  },
  "11155111": {
    "name": 'Sepolia',
    chainId: 11155111,
    "currencySymbol": "ETH",
    "faucet": "",
    "infoURL": "",
    "browser": "https://sepolia.etherscan.io",
    "rpc": [
      "https://rpc.sepolia.ethpandaops.io",
      "https://rpc2.sepolia.org",
      "https://1rpc.io/sepolia",
      'https://ethereum-sepolia-rpc.publicnode.com',
      'wss://sepolia.gateway.tenderly.co',
      'wss://ethereum-sepolia-rpc.publicnode.com'
    ]
  }
}

const defaultGasLimit = '30000000';

const localHttp = 'http://localhost:7701';
const localWs = 'ws://localhost:7702';

const anvilHttp = 'http://192.168.76.11:8545';
const anvilWs = 'ws://192.168.76.11:8545';

const httpRpcs = [
  anvilHttp,
  // localHttp,
  // 'https://cosmological-wispy-dust.base-mainnet.quiknode.pro/5f3513f42a3fcc7c56318b11d8cdba5a69fc02e9',
  // 'https://go.getblock.io/fe64590699f149178086624ba2e3eefa',
  'https://base.gateway.tenderly.co',
  // 'https://rpc.linea.build',
  // 'https://linea.blockpi.network/v1/rpc/public',
  // 'https://linea.drpc.org',
  // 'https://linea.decubate.com',
  // 'https://1rpc.io/linea',
  'https://api.devnet.solana.com',
]

const wsRpcs = [
  // anvilWs,
  localWs,
  // 'wss://api.devnet.solana.com',
  // 'wss://base-rpc.publicnode.com',
  'wss://base.gateway.tenderly.co',
  'wss://bsc-rpc.publicnode.com',
  'wss://rpc.linea.build'
]

return {
  SupportedChainId,
  ERC20_ABI,
  ERC721_ABI,
  WETH_ABI,
  PAIR_ABI,
  FACTORY_ABI,
  ROUTER02_ABI,
  UNIVERSAL_ROUTER_ABI,
  networksParams,
  defaultGasLimit,

  httpRpcs,
  wsRpcs,
}

}))