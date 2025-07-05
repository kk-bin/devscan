import { LoadingOutlined } from "@ant-design/icons";

export default function LoadingValue({ val, loading, valueRender = (val, loading?) => loading || val}) {

  if (val !== null || loading) {
    try {
      return <>{valueRender(val, loading && <LoadingOutlined />)}</>;
    } catch (e: any) {
      console.error('LoadingValue', e);
    }
  }

  return null;
}