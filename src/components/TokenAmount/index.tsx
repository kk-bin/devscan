import { formatUnitsUtil, getKey } from "src/utils/util";

export default function TokenAmount({ decimals, chain, tokenAddress, amount, tokenMap }: {
  decimals: number,
  amount: string | number,
  chain?: string,
  tokenAddress?: string,
  tokenMap?: any,
} | {
  decimals?: number,
  chain: string,
  tokenAddress: string,
  tokenMap: any,
  amount: string | number,
}) {
  if (decimals) {
    return (
      <>{formatUnitsUtil(amount, decimals)} points</>
    )
  }
  const key = getKey(chain, tokenAddress);
  const token = tokenMap[key] || {};
  return (
    <>{formatUnitsUtil(amount, token.decimals)} {token.name}</>
  )
}