import styled from "styled-components";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import GlobalStyles from "./GlobalStyles";


const Container = styled.div`
  height: 100vh;
  scroll-snap-type: y mandatory;
  scrollbar-width: none;
  color: white;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Section = styled.div`
  scroll-snap-align: start; /* Ensures the section aligns on scroll */
`;

const App = () => {
  return (
    <Container>
      <GlobalStyles/>
      
      <Section id="home">
        <Hero />
      </Section>
     
     <Footer/>

    </Container>
  );
};

export default App;
    