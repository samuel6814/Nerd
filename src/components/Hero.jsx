import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom'; // Step 1: Import Link
import { Sparkles, Feather, Heart } from 'lucide-react';
import Navbar from './Navbar';

// Keyframes for animations (no changes)
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulsate = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 15px rgba(231, 121, 193, 0.4); }
  50% { transform: scale(1.05); box-shadow: 0 0 25px rgba(231, 121, 193, 0.7); }
  100% { transform: scale(1); box-shadow: 0 0 15px rgba(231, 121, 193, 0.4); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
`;

// Styled components (no changes to HeroSection, HeroContent, MainHeading, SubHeading)
const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #2a215a 0%, #5e3a8a 100%);
  color: #f0e6ff;
  text-align: center;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding-top: 100px;
    padding-bottom: 60px;
  }
`;

const HeroContent = styled.div`
  max-width: 900px;
  z-index: 2;
  position: relative;
  animation: ${fadeIn} 1s ease-out forwards;
`;

const MainHeading = styled.h1`
  font-size: 4.5em;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 25px;
  
  span.highlight {
    background: linear-gradient(90deg, #e779c1, #d946ef);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  @media (max-width: 1024px) {
    font-size: 3.8em;
  }
  @media (max-width: 768px) {
    font-size: 3em;
  }
  @media (max-width: 480px) {
    font-size: 2.5em;
  }
`;

const SubHeading = styled.p`
  font-size: 1.5em;
  margin-bottom: 40px;
  color: #d1c4e9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  font-weight: 300;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1.2em;
  }
`;

// Step 2: Change the styled component from a button to a Link
const CTAButton = styled(Link)`
  background: linear-gradient(45deg, #9b59b6, #8e44ad);
  color: white;
  padding: 18px 35px;
  font-size: 1.2em;
  font-weight: bold;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: ${pulsate} 2.5s infinite ease-in-out;
  display: inline-flex; // Added to align icon and text
  align-items: center; // Added to align icon and text
  gap: 10px; // Added for spacing
  
  &:hover {
    transform: translateY(-3px);
  }

  @media (max-width: 480px) {
    padding: 15px 25px;
    font-size: 1em;
  }
`;

// Annotations and IconWrapper (no changes)
const Annotation = styled.div`
  position: absolute;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  color: #f0e6ff;
  padding: 12px 18px;
  border-radius: 10px;
  font-size: 1em;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  opacity: 0;
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: ${fadeIn} 1s ease-out forwards ${props => props.delay || '0s'},
             ${float} ${props => props.duration || '5s'} ease-in-out infinite;

  @media (max-width: 768px) {
    display: none;
  }
`;

const IconWrapper = styled.span`
  display: inline-flex;
  vertical-align: middle;
  margin-right: 8px;
  color: #e779c1;
`;


const Hero = () => {
  return (
    <HeroSection>
        <Navbar/>
      <HeroContent>
        <MainHeading>
          A cozy corner on the web to <br />
          <span className="highlight">grow your skills</span>.
        </MainHeading>
        <SubHeading>
          Welcome! Nerd is a friendly guide, built by Quaigraine, to help you explore the world of technology at your own happy pace.
        </SubHeading>
        
        {/* Step 3: Add the 'to' prop to the button */}
        <CTAButton to="/nerdai">
          <IconWrapper style={{color: 'white'}}><Sparkles size={20} /></IconWrapper>
          Let's Begin
        </CTAButton>

      </HeroContent>

      {/* Annotations (no changes) */}
      <Annotation style={{ top: '25%', left: '15%' }} delay="0.5s" duration="6s">
         <IconWrapper><Feather size={16} /></IconWrapper>
         It's okay to be curious...
      </Annotation>
      <Annotation style={{ top: '65%', right: '12%' }} delay="0.8s" duration="5s">
         No question is too small!
      </Annotation>
      <Annotation style={{ bottom: '20%', left: '25%' }} delay="1.1s" duration="7s">
        <IconWrapper><Heart size={16} /></IconWrapper>
        You've totally got this.
      </Annotation>
    </HeroSection>
  );
};

export default Hero;