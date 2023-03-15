import React, { useEffect } from "react";

import styled from "styled-components";
import { Column, DefaultImage, Row } from "../components/Element";
import {
  FaTelegramPlane,
  FaTwitter,
  FaDiscord,
  FaAngleDown,
  FaNetworkWired,
} from "react-icons/fa";
import { Frenchain, ETH2, Frenchain as FrenchainLogo } from "../components/Images";
import ChangeRadio from "../components/Element/radio";
import { useState } from "react";
import SelectToken from "../components/SelectToken";
import {
  useAccount,
  useBalance,
  useConnect,
  useSwitchNetwork,
  useNetwork,
  usePrepareContractWrite,
  useContractRead,
  useContractWrite,
} from "wagmi";
import IERC20 from "./IERC20.json";
import BridgeABI from "./Bridge.json";
import { TOKENS } from "../constants";
import { ethers } from "ethers";
import { MINIMUM, isAboveMinimum, formatTokenAmount } from "./utils";

const FREN_BRIDGE = "0x182914F2f7ebd1067f365E0ea0088b317bF7E76b";
const ETH_BRIDGE = "0xDEA1B439f99aA1F167deaB39838E6444E8422188";
const sleep = time => new Promise(res => setTimeout(res, time, "done sleeping"));

const isGas = {
  1: {
    ETH: true,
  },
  44444: {
    FREN: true,
  },
}

const Home = () => {
  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();
  const [initialized, setInitialized] = useState(false);
  const [wrapAmount, setWrapAmount] = useState("0");
  const { connect, connectors } =
    useConnect();

  const wrongNetwork = chain?.id !== 44444 && chain?.id !== 1;

  const { switchNetwork } = useSwitchNetwork({
    onSuccess(data) {
      // try {
      //   connect({ connector: connectors?.[0] });
      // } catch (err) {
      //   connect({ connector: connectors?.[1] });
      // }
    }
  });
  console.log('switchNetwork', switchNetwork, isConnected);

  // useEffect(() => {
  //   async function initialize() {
  //     if (initialized) {
  //       return;
  //     }
  //     if (chain?.id === 44444) {
  //       setInitialized(true);
  //       return;
  //     }
  //     if (switchNetwork) {
  //       setInitialized(true);
  //       switchNetwork(1);
  //     }
  //   }
  //   initialize();
  // }, [switchNetwork]);

  const isDeposit = chain?.id !== 44444;
  const currentChainId = isDeposit ? 1 : 44444;
  const targetChainId = isDeposit ? 44444 : 1;
  const [targetAddress, setTargetAddress] = useState(null);
  const [selectedToken, setSelectedToken] = useState({
    url2: FrenchainLogo,
    name: "FREN",
  });
  const [useMax, setUseMax] = useState(false);
  const [visible, setVisible] = useState(false);
  const RadioOptions = [
    { name: "Deposit", value: "deposit" },
    { name: "Withdraw", value: "withdraw" },
  ];

  const { data } = useBalance({
    address,
    chainId: currentChainId,
    token: targetAddress,
    enabled: !!address && TOKENS[chain?.id]?.[selectedToken?.name] === targetAddress,
  });

  const { data: targetBalance } = useBalance({
    address,
    chainId: targetChainId,
    token: targetAddress,
    enabled: !wrongNetwork &&
      isConnected && !!address && !!targetAddress,
  });
  const { data: localBalance } = useBalance({
    address,
    chainId: currentChainId,
    token: TOKENS[chain?.id]?.[selectedToken?.name],
    enabled: !wrongNetwork,
  });

  useEffect(() => {
    setTargetAddress(
      TOKENS[isDeposit ? 44444 : 1]?.[selectedToken?.name]
    );
  }, [selectedToken]);

  const { data: tokenAllowance } = useContractRead({
    address: TOKENS[currentChainId]?.[selectedToken.name],
    chainId: currentChainId,
    abi: IERC20,
    functionName: 'allowance',
    args: [address, isDeposit ? ETH_BRIDGE : FREN_BRIDGE],
    enabled: chain?.id === currentChainId && !!address && TOKENS[currentChainId]?.[selectedToken.name] !== undefined,
    watch: true,
  });

  const { config: writeConfig } = usePrepareContractWrite({
    address: TOKENS[currentChainId]?.[selectedToken.name],
    abi: IERC20,
    functionName: 'approve',
    args: [isDeposit ? ETH_BRIDGE : FREN_BRIDGE, ethers.constants.MaxUint256],
    enabled: !wrongNetwork && !!address && !!chain?.id,
    overrides: {
      gasPrice: isDeposit ? undefined : ethers.utils.parseUnits("3", "gwei"),
    }
  });
  const { write: approve } = useContractWrite(writeConfig);

  const amountInWei = selectedToken?.name === 'USDC' ?
    Math.floor(wrapAmount * 1000000) :
    ethers.utils.parseEther(wrapAmount?.toString() || '0');

  const { config: bridgeConfig } = usePrepareContractWrite({
    address: currentChainId === 1 ? ETH_BRIDGE : FREN_BRIDGE,
    abi: BridgeABI,
    functionName: 'wrap',
    chainId: currentChainId,
    args: [
      ethers.utils.formatBytes32String(selectedToken?.name),
      amountInWei,
      address,
      chain?.id === 1 ? ethers.utils.formatBytes32String("FRENCHAIN") :
        ethers.utils.formatBytes32String("ETHEREUM")
    ],
    overrides: {
      value: isGas[currentChainId]?.[selectedToken?.name] ? ethers.utils.parseEther((+wrapAmount.toString()).toString()) : 0,
      gasPrice: chain?.id === 1 ? undefined : ethers.utils.parseUnits("3", "gwei"),
    },
    enabled: !wrongNetwork && isAboveMinimum(selectedToken?.name, chain?.id, wrapAmount) && !!chain?.id && !!selectedToken?.name &&
      ethers.BigNumber.from(amountInWei).lte(localBalance?.value || "0") &&
      !!address && !!chain?.id && wrapAmount !== "" &&
      !isNaN(Number(wrapAmount)) && Number(wrapAmount) > 0
  })
  console.log('currentChainId', currentChainId, currentChainId ? ETH_BRIDGE : FREN_BRIDGE);

  const { write: bridge } = useContractWrite(bridgeConfig);

  function handleWrapAmount(e) {
    setUseMax(false);
    if (!isNaN(e.target.value)) {
      setWrapAmount(e.target.value);
    }
  };

  const handleChange = () => {
    switchNetwork && switchNetwork(isDeposit ? 44444 : 1);
    setUseMax(false);
  };

  return (
    <Wrapper>
      <JoinUsWrapper>
        <Title>FRENCHAIN BRIDGE</Title>
        <PlainText>
          This is the best bridge from ETH to FREN and back again.
        </PlainText>
        <PlainText>
          Have any questions? Join our community and get help from your new
          <PlainBoldText> frens</PlainBoldText>.
        </PlainText>
        <IconWrapper>
          <IconContent>
            <a href="https://t.me/fren_chain" target="_blank" rel="noreferrer">
              <FaTelegramPlane />
            </a>
            <PlainBoldText>Telegram</PlainBoldText>
          </IconContent>
          <IconContent>
            <a href="https://twitter.com/fren_chain" target="_blank" rel="noreferrer">
              <FaTwitter />
            </a>
            <PlainBoldText>Twitter</PlainBoldText>
          </IconContent>
          <IconContent>
            <a href="https://discord.gg/C8sUQY5qFv" target="_blank" rel="noreferrer">
              <FaDiscord />
            </a>
            <PlainBoldText>Discord</PlainBoldText>
          </IconContent>
        </IconWrapper>
      </JoinUsWrapper>
      <WalletWrapper>
        <SelectWrapper>
          <ChangeRadio
            onChange={handleChange}
            options={RadioOptions}
            selected={isDeposit ? "deposit" : "withdraw"}
            name="withdraw"
          />
        </SelectWrapper>
        <SwapWrapper>
          <SwapContent>
            <PlainBoldText>From</PlainBoldText>
            <ChainSwapWrapper>
              <ChainSwapContent style={{ height: '50%' }}>
                <SetChain>
                  <DefaultImage src={isDeposit ? ETH2 : Frenchain} />
                  <PlainText>
                    {isDeposit ? "Ethereum Chain" : "Frenchain"}
                  </PlainText>
                </SetChain>
                <ChainBalance>
                  <PlainText>Balance:</PlainText>
                  <PlainText>
                    {Number(localBalance?.formatted || "0").toFixed(4)}
                  </PlainText>
                </ChainBalance>
              </ChainSwapContent>
              <ChainSwapContent>
                <SetChain onClick={() => setVisible(true)}>
                  <DefaultImage src={selectedToken?.url2} />
                  <PlainText>{selectedToken?.name}</PlainText>
                  <FaAngleDown />
                </SetChain>
                <ChainBalance>
                  <BalanceInput
                    style={{ color: isAboveMinimum(selectedToken?.name, chain?.id, wrapAmount) ? 'white' : 'rgb(84, 84, 84)' }}
                    value={wrapAmount} onChange={(e) => handleWrapAmount(e)} />
                  <PlainText
                    onClick={() => {
                      setUseMax(true);
                      setWrapAmount(localBalance?.formatted || "0");
                    }}
                  >MAX</PlainText>
                </ChainBalance>
              </ChainSwapContent>
            </ChainSwapWrapper>
            <div style={{ width: '100%', height: '1px', color: 'red' }}>
              <p style={{ textAlign: 'right' }}>{
                isAboveMinimum(selectedToken?.name, chain?.id, wrapAmount) ? (
                  ethers.BigNumber.from(amountInWei).gt(localBalance?.value || "0") ?
                    "Insufficient Balance" : <></>
                ) :
                  <>Under Minimum: {formatTokenAmount(selectedToken?.name, MINIMUM?.[chain?.id]?.[selectedToken?.name])
                  } {selectedToken?.name}</>
              }
              </p>
            </div>
          </SwapContent>
          <SwapContent>
            <PlainBoldText>To</PlainBoldText>
            <ChainSwapWrapper>
              <ChainSwapContent>
                <SetChain>
                  <DefaultImage style={{ height: '30px' }} src={isDeposit ? Frenchain : ETH2} />
                  <PlainText>
                    {isDeposit ? "Frenchain" : "Ethereum Chain"}
                  </PlainText>
                </SetChain>
                <ChainBalance>
                  <PlainText>Balance:</PlainText>
                  <PlainText>
                    {Number(targetBalance?.formatted || "0").toFixed(4)}
                  </PlainText>
                </ChainBalance>
              </ChainSwapContent>
            </ChainSwapWrapper>
          </SwapContent>
        </SwapWrapper>
        {tokenAllowance?.eq(0) ?
          <Button
            onTouchStart={(e) => {
              e.preventDefault();
              e.target.onClick();
            }}
            onClick={() => approve()}
          > APPROVE </Button> :
          <Button
            style={{ cursor: 'pointer' }}
            disabled={!isAboveMinimum(selectedToken?.name, chain?.id, wrapAmount) || ethers.BigNumber.from(amountInWei).gt(localBalance?.value || "0")}
            onTouchStart={(e) => {
              e.preventDefault();
              e.target.onClick();
            }}
            onClick={() => bridge()}
          >BRIDGE</Button>}
      </WalletWrapper>

      <ButtonWrapper>
        {/* <a target="_blank" href="https://docs.frenchain.app/" rel="noreferrer"><Button2>DOCS</Button2></a> */}
        <a target="_blank" href="http://Www.frenswap.fun" rel="noreferrer"><Button2>SWAP</Button2></a>
      </ButtonWrapper>
      <SelectToken
        setVisible={setVisible}
        visible={visible}
        setSelectedToken={setSelectedToken}
        selectedToken={selectedToken}
        chainName={isDeposit ? "Ethereum Chain" : "FrenChain"}
        chainId={chain?.id}
      />
    </Wrapper >
  );
};

const Wrapper = styled(Row)`
  gap: 20px;
  font-size: 16px;
  line-height: 22px;
  font-family: "Poppins";
  padding: 20px;
  @media screen and (max-width: 1000px) {
    flex-direction: column;
    padding: 30px;
  }
  @media screen and (max-width: 512px) {
    flex-direction: column;
    padding: 10px;
  }
  @media screen and (max-width: 512px) {
    font-size: 13px;
  }

  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }
`;

const JoinUsWrapper = styled(Column)`
  gap: 20px;
  border: 4px solid #ffffff;
  border-radius: 17px;
  align-items: flex-start;
  padding: 40px 30px;
  max-width: 398px;
  height: 625px;
  @media screen and (max-width: 1000px) {
    max-width: 625px;
    height: 350px;
  }
  @media screen and (max-width: 400px) {
    padding: 20px 15px;
    height: 310px;
  }
`;

const Title = styled.div`
  font-family: "MonumentExtended-Regular";
  font-size: 24px;
  line-height: 28px;
`;

const PlainText = styled.div``;

const PlainBoldText = styled.span`
  font-weight: 600;
  font-family: "Poppins";
`;

const IconWrapper = styled(Column)`
  gap: 5px;
  align-items: flex-start;
`;

const IconContent = styled(Row)`
  gap: 10px;
`;

const WalletWrapper = styled(Column)`
  gap: 15px;
  padding: 20px;
  border: 4px solid #ffffff;
  border-radius: 17px;
  width: 600px;
  justify-content: space-between;
  height: 100%;
  @media screen and (max-width: 1000px) {
    width: 100%;
    max-height: 530px;
  }
  @media screen and (max-width: 512px) {
    padding: 10px;
    max-height: 530px;
  }
  @media screen and (max-width: 400px) {
    max-height: 530px;
  }
`;

const SelectWrapper = styled.div`
  background: #ffffff;
  width: 100%;
  border-radius: 10px;
  height: 90px;
  @media screen and (max-width: 600px) {
    height: 55px;
  }
`;

const SwapWrapper = styled(Column)`
  padding: 20px 25px;
  background: #ffffff;
  border-radius: 13px;
  width: 100%;
  height: 100%;
  gap: 20px;
  @media screen and (max-width: 512px) {
    padding: 20px 10px;
  }
`;

const SwapContent = styled(Column)`
  gap: 10px;
  color: black;
  align-items: flex-start;
  width: 100%;
`;

const ChainSwapWrapper = styled(Column)`
  background: #000000;
  border-radius: 10px;
  width: 100%;
  padding: 5px;
`;

const ChainSwapContent = styled(Row)`
  padding: 15px 20px;
  color: white;
  justify-content: space-between;
  width: 100%;
`;

const SetChain = styled(Row)`
  gap: 20px;
  @media screen and (max-width: 512px) {
    gap: 10px;
  }
`;
const ChainBalance = styled(Row)`
  gap: 10px;
  font-size: 12px;
  line-height: 18px;
  @media screen and (max-width: 512px) {
    gap: 5px;
  }
`;

const Button = styled.button`
  cursor: pointer;
  font-family: "Poppins";
  font-weight: 600;
  font-size: 16px;
  background: #8ddd5b;
  border-radius: 10px;
  padding: 16px;
  width: 100%;
  color: black;
  padding-bottom: 10px;
  &:disabled {
    color: #6d3d1b;
  }
  &:active:not(:disabled) {
    color: black;
    background-color: #3e8e41;
    box-shadow: 0 5px #666;
    transform: translateY(3px);
  }
`;
const ButtonWrapper = styled(Row)`
  gap: 40px;
  margin-top: 5px;
  @media screen and (min-width: 800px) {
    display: none;
  }
`;
const Button2 = styled.button`
  border: 3px solid #ffffff;
  border-radius: 15px;
  font-family: "MonumentExtended-Regular";
  font-size: 18px;
  color: white;
  padding: 10px 30px;
`;
const BalanceInput = styled.input`
  background: #000000;
  border-radius: 8px;
  padding: 10px;
  text-align: right;
  color: white;
  max-width: 150px;
  @media screen and (max-width: 400px) {
    max-width: 100px;
  }
`;

export default Home;
