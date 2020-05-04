import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { ThemeProvider, theme } from 'frontend-components';
import React from "react"
import styled from '@xstyled/styled-components'

const Content = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const Layout = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <Header />

      <Content>
        {children}
      </Content>
    </ThemeProvider>
  )
}
