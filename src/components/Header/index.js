import { useState, useEffect } from "react";
import { Modal } from "@nextui-org/react";
import styled from "styled-components";
import { Row } from "../Element";
import { useAccount, useConnect, useDisconnect } from "wagmi";

const Header = () => {
  const { address, isConnected } = useAccount();
  const [visible, setVisible] = useState(false);
  const { connect, connectors, isLoading, pendingConnector, error } =
    useConnect();
  const { disconnect } = useDisconnect();

  return (
    <Wrapper>
      <LogoFont>FRENBRIDGE</LogoFont>
      <ButtonWrapper>
        <a target="_blank" href="https://docs.frenchain.app/" rel="noreferrer"><Button style={{ cursor: 'pointer' }}>DOCS</Button></a>
        <NonMobileButton style={{ cursor: 'pointer' }}><a target="_blank" href="http://Www.frenswap.fun" rel="noreferrer">SWAP</a></NonMobileButton>
        {isConnected ? (
          <Button onClick={() => disconnect()}>
            0x{address.replace(address.slice(0, address.length - 3), "...")}
          </Button>
        ) : (
          <Button style={{ cursor: 'pointer' }} onClick={() => setVisible(true)}>CONNECT</Button>
        )}
      </ButtonWrapper>
      <Modal
        aria-labelledby="modal-title"
        open={visible}
        width="450px"
        onClose={() => setVisible(false)}
        css={{
          border: "8px solid #000000",
          borderRadius: "17px",
          padding: "30px 5px",
        }}
      >
        <Modal.Body css={{ gap: "20px" }}>
          {connectors.map((connector) => (
            <button
              disabled={!connector.ready}
              key={connector.id}
              onClick={() => connect({ connector })}
            >
              {connector.name}
              {!connector.ready && ' (unsupported)'}
              {isLoading &&
                connector.id === pendingConnector?.id &&
                ' (connecting)'}
              {((isConnected && visible) || error) && setVisible(false)}
            </button>
          ))}
        </Modal.Body>
      </Modal>
    </Wrapper >
  );
};
const Wrapper = styled(Row)`
  justify-content: space-between;
  padding: 30px 100px;
  width: 100%;
  @media screen and (max-width: 800px) {
    justify-content: center;
  }
`;
const LogoFont = styled.div`
  font-family: "MonumentExtended-Ultrabold";
  line-height: 38px;
  font-size: 32px;
  @media screen and (max-width: 800px) {
    display: none;
  }
`;
const ButtonWrapper = styled(Row)`
  gap: 40px;
  // @media screen and (max-width: 800px) {
  //   display: none;
  // }
`;
const Button = styled.button`
  border: 3px solid #ffffff;
  border-radius: 15px;
  font-family: "MonumentExtended-Regular";
  font-size: 18px;
  color: white;
  padding: 10px 30px;
`;
const NonMobileButton = styled.button`
  border: 3px solid #ffffff;
  border-radius: 15px;
  font-family: "MonumentExtended-Regular";
  font-size: 18px;
  color: white;
  padding: 10px 30px;
  display: none;
  @media only screen and (min-width: 768px) {
    display:block;
  }
`;
export default Header;
