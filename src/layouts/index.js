import styled from "styled-components";
import { Column } from "../components/Element";
import Footer from "../components/Footer";
import Header from "../components/Header";
import PageIndex from "../pages";

const Layout = () => {
  return (
    <Wrapper>
      <Header />
      <PageIndex />
      1% Bridge Fee <br /><br />
      Gas Fee (paid only on FREN): <br />
      ETH=.003125 | Fren=32000 | USDC=$10<br />&nbsp;
      <Footer />
    </Wrapper>
  );
};

const Wrapper = styled(Column)`
  background-color: #000000;
  overflow: auto;
  color: white;
  justify-content: space-between;
  height: 100vh;
  @media screen and (max-width: 1000px) {
    height: 100%;
  }
`;

export default Layout;
