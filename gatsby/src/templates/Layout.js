import { Header } from '../components/Header';
import { ThemeProvider, theme } from 'frontend-components';
import React from "react"
import styled from '@xstyled/styled-components'

const Content = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-bottom: 48px;
`;

export const Layout = ({ children, location }) => {
  return (
    <ThemeProvider theme={theme}>
      <Header {...location} />

      <Content>
        {children}
      </Content>
    </ThemeProvider>
  )
}