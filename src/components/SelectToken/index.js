import { Modal } from "@nextui-org/react";
import styled from "styled-components";
import { Column, DefaultImage, Row } from "../Element";
import {
  Ethereum2,
  ETH,
  USDC,
  USDT,
  DAI,
  MATIC,
  ETH2,
  USDC2,
  USDT2,
  DAI2,
  MATIC2,
  Frenchain,
} from "../Images";
import { AiOutlineClose } from "react-icons/ai";
import { TOKENS } from "../../constants";
import { useAccount, useBalance } from "wagmi";

const data = [
  {
    name: "ETH",
    url: ETH,
    url2: ETH2,
    balance: "0.00",
    content: "Ether",
  },
  {
    name: "USDC",
    url: USDC,
    url2: USDC2,
    balance: "0.00",
    content: "USD Coin",
  },
  {
    name: "FREN",
    url: Frenchain,
    url2: Frenchain,
    balance: "0.00",
    content: "FREN",
  },
];

const SelectToken = (props) => {
  const { chainId, setVisible, visible, setSelectedToken } = props;
  const { address, isConnected } = useAccount();

  const closeHandler = () => {
    setVisible(false);
  };

  const tokenSelect = (data) => {
    setSelectedToken(data);
    setVisible(false);
  };

  const { data: USDCBalance } = useBalance({
    address,
    chainId,
    token: TOKENS[chainId]?.["USDC"],
    enabled: !!address && !!TOKENS[chainId]?.["USDC"],
    cacheTime: 2_000,
  });

  const { data: ETHBalance } = useBalance({
    address,
    chainId,
    token: TOKENS[chainId]?.["ETH"],
    enabled: !!address && !!TOKENS[chainId]?.["ETH"],
    cacheTime: 2_000,
  });

  const { data: FRENBalance } = useBalance({
    address,
    chainId,
    token: TOKENS[chainId]?.["FREN"],
    enabled: !!address && !!TOKENS[chainId]?.["FREN"],
    cacheTime: 2_000,
  });

  const keys = {
    ETH: ETHBalance?.formatted || "0",
    USDC: USDCBalance?.formatted || "0",
    FREN: FRENBalance?.formatted || "0",
  }

  return (
    <Modal
      aria-labelledby="modal-title"
      open={visible}
      width="450px"
      onClose={closeHandler}
      css={{
        border: "8px solid #000000",
        borderRadius: "17px",
        padding: "30px 5px",
      }}
    >
      <Modal.Header css={{ justifyContent: "space-between", fontSize: "20px" }}>
        <SelectWrapper>
          <PlainBoldText>Select Token on</PlainBoldText>
          <SetChain>
            <DefaultImage src={Ethereum2} />
            <PlainBoldText>{props.chainName}</PlainBoldText>
          </SetChain>
        </SelectWrapper>
        <AiOutlineClose onClick={closeHandler} />
      </Modal.Header>
      <Modal.Body css={{ gap: "20px" }}>
        <SearchInput placeholder="Search token name or address" />
        {data.map((item, key) => (
          <TokenWrapper key={key} onClick={() => tokenSelect(item)}>
            <DefaultImage src={item.url} />
            <TokenWrapperContent>
              <PlainBoldText>{item.name}</PlainBoldText>
              <TokenWrapperBalance>
                <PlainText>{item.content}</PlainText>
                <PlainBoldText>{(+keys[item.name]).toFixed(4)}</PlainBoldText>
              </TokenWrapperBalance>
            </TokenWrapperContent>
          </TokenWrapper>
        ))}
      </Modal.Body>
      <Modal.Footer
        css={{
          justifyContent: "flex-end",
          fontSize: "10px",
          fontFamily: "Poppins",
          fontWeight: "$bold",
        }}
      >
        <></>
      </Modal.Footer>
    </Modal>
  );
};

const PlainText = styled.div`
  font-size: 16px;
  line-height: 22px;
  font-family: "Poppins";
`;

const PlainBoldText = styled.span`
  font-family: "Poppins";
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
`;
const SelectWrapper = styled(Row)`
  gap: 20px;
  @media screen and (max-width: 400px) {
    gap: 10px;
  }
`;
const SetChain = styled(Row)`
  gap: 10px;

  @media screen and (max-width: 400px) {
    gap: 5px;
  }
`;
const SearchInput = styled.input`
  background: #000000;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  color: white;
`;

const TokenWrapper = styled(Row)`
  gap: 20px;
`;
const TokenWrapperContent = styled(Column)`
  gap: 3px;
  align-items: flex-start;
  width: 100%;
`;
const TokenWrapperBalance = styled(Row)`
  justify-content: space-between;
  width: 100%;
`;

export default SelectToken;
