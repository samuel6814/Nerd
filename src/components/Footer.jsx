import React from 'react';
import styled from 'styled-components';
import { Github, Twitter, Linkedin } from 'lucide-react';

const FooterContainer = styled.footer`
  background-color: #1c163c; /* A deep, dark purple from the theme */
  color: #d1c4e9; /* Soft lavender text */
  padding: 40px 20px;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const BrandText = styled.p`
  font-size: 1.2rem;
  font-weight: 600;
  color: #f0e6ff;

  span {
    background: linear-gradient(90deg, #e779c1, #d946ef);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const CopyrightText = styled.p`
  font-size: 0.9rem;
  color: #a39bb7;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 25px;
  margin-top: 10px;
`;

const SocialIcon = styled.a`
  color: #d1c4e9;
  transition: all 0.3s ease;

  &:hover {
    color: #e779c1; /* Highlight color on hover */
    transform: translateY(-3px);
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <BrandText>
          Nerd <span>by Quaigraine</span>
        </BrandText>
        <SocialLinks>
          <SocialIcon href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <Github size={24} />
          </SocialIcon>
          <SocialIcon href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <Twitter size={24} />
          </SocialIcon>
          <SocialIcon href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <Linkedin size={24} />
          </SocialIcon>
        </SocialLinks>
        <CopyrightText>
          © {new Date().getFullYear()} Nerd. A welcoming space to learn and grow.
        </CopyrightText>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
