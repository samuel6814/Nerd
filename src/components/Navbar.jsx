import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { Menu, X, Code2 } from 'lucide-react';

// Main navigation container
const Nav = styled.nav`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 95%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: rgba(22, 27, 34, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  border: 1px solid rgba(56, 62, 74, 0.5);
  z-index: 1000;
  transition: top 0.3s ease-in-out, border-radius 0.3s ease-in-out;

  @media (max-width: 768px) {
    top: 0;
    width: 100%;
    border-radius: 0;
    padding: 15px 20px;
    border: none;
    border-bottom: 1px solid rgba(56, 62, 74, 0.5);
    background: rgba(13, 17, 23, 0.95);
  }
`;

// Logo styling
const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: 700;
  color: #c9d1d9;
`;

// Container for desktop navigation links
const NavLinks = styled.div`
  display: flex;
  align-items: center;
  background-color: #0d1117;
  padding: 8px;
  border-radius: 30px;
  border: 1px solid rgba(56, 62, 74, 0.5);

  @media (max-width: 768px) {
    display: none;
  }
`;

// Individual navigation link
const StyledNavLink = styled(NavLink)`
  color: #a8b3be;
  text-decoration: none;
  padding: 8px 18px;
  border-radius: 20px;
  transition: all 0.3s ease;
  font-weight: 500;

  &:hover {
    color: #ffffff;
    background-color: #21262d;
  }

  &.active {
    color: #ffffff;
    background-color: #30363d;
  }
`;

// Mobile menu icon (hamburger)
const MobileMenuIcon = styled.div`
  display: none;
  cursor: pointer;
  color: #c9d1d9;

  @media (max-width: 768px) {
    display: block;
  }
`;

// Mobile navigation container
const MobileNavContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #0d1117;
  z-index: 1001;
  transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(100%)'};
  transition: transform 0.3s ease-in-out;

  @media (min-width: 769px) {
    display: none;
  }
`;

const CloseIconWrapper = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
  color: #c9d1d9;
`;

const MobileNavLinks = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
`;

const MobileNavLink = styled(NavLink)`
    font-size: 2.5rem;
    color: #a8b3be;
    text-decoration: none;
    transition: color 0.3s;

    &:hover, &.active {
        color: #ffa500;
    }
`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth > 768) {
        setIsScrolled(window.scrollY > 20);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const handleLinkClick = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <Nav style={{ top: isScrolled ? '0' : '20px', borderRadius: isScrolled ? '0' : '50px' }}>
        <Logo to="/">
          <Code2 size={28} />
          Nerd
        </Logo>

        <NavLinks>
          <StyledNavLink to="/" end>Home</StyledNavLink>
          <StyledNavLink to="/nerdai">Nerd AI</StyledNavLink>
        </NavLinks>

        <MobileMenuIcon onClick={toggleMenu}>
          <Menu size={30} />
        </MobileMenuIcon>
      </Nav>

      <MobileNavContainer isOpen={isOpen}>
         <CloseIconWrapper onClick={toggleMenu}>
            <X size={30} />
         </CloseIconWrapper>
         <MobileNavLinks>
            <MobileNavLink to="/" end onClick={handleLinkClick}>Home</MobileNavLink>
            <MobileNavLink to="/nerdai" onClick={handleLinkClick}>Nerd AI</MobileNavLink>
        </MobileNavLinks>
      </MobileNavContainer>
    </>
  );
};

export default Navbar;