import { NavigationItem } from '../components/NavigationItem'
import { Header } from '../components/Header'
import { ThemeProvider, theme } from 'frontend-components'
import { menuItems } from '../lib/menu-items'
import React, { useState } from "react"
import styled, { createGlobalStyle, css, down, keyframes, up } from '@xstyled/styled-components'

const slideLeft = keyframes`
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(25vw);
  }
`;

const Content = styled.div`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 64px 0;

  ${up('lg',
    css`
      padding-bottom: 48px;
    `
  )}

  ${down('md',
    css`
      padding: 0 2vw;
    `
  )}
`

const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
  }
`

const Menu = styled.div`
  background-color: neutral1;
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  width: 25vw;
  z-index: 1;

  ${up('md',
    css`
      display: none
    `
  )}
`

const Wrapper = styled.div`
  animation: 0.5s 1 forwards ${props => css`${props.isMenuVisible ? slideLeft : ''}`};
  background-color: white;
  position: relative;
  z-index: 10;
`;

export const Layout = ({ children, location }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />

      <Menu isMenuVisible={isMenuVisible}>
        {menuItems.map(menuItem => <NavigationItem {...menuItem} location={location} /> )}
      </Menu>

      <Wrapper isMenuVisible={isMenuVisible}>
        <Header location={location} onToggleMenu={() => setIsMenuVisible(previousValue => !previousValue)} />

        <Content>
          {children}
        </Content>
      </Wrapper>
    </ThemeProvider>
  )
}