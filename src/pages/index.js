import { Route, Routes } from "react-router-dom";
import Home from "./home";

import { useConnect } from 'wagmi'

export function Profile() {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();

  return (
    <div>
      {connectors.map((connector) => (
        <button
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect({ connector })}
          style={{ color: 'white' }}
        >
          {connector.name}
          {!connector.ready && ' (unsupported)'}
          {isLoading &&
            connector.id === pendingConnector?.id &&
            ' (connecting)'}
        </button>
      ))}

      {error && <div>{error.message}</div>}
    </div>
  )
}

const PageIndex = () => (
  <Routes>
    <Route index element={<Home />} />
    {/* <Route index element={<Profile />} /> */}
  </Routes>
);
export default PageIndex;
