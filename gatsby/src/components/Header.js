import { Navigation } from 'frontend-components'
import { get } from 'lodash'
import { navigate } from '@reach/router'
import BaseLogo from '../assets/images/logo.svg'
import React from 'react';
import styled from '@xstyled/styled-components'

const Container = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 1500px;

  @media (max-width: 1500px) {
    padding: 0 20px;
    width: 100%;
  }
`

const Logo = styled(BaseLogo)`
  height: 20px;
`

const NavigationContainer = styled.div`
  display: flex;
`

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  height: 64px;
`

export const Header = location => {
  const path = get(location, 'pathname')

  return (
    <Wrapper>
      <Container>
        <Logo />

        <NavigationContainer>
          <Navigation isActive={path === '/about'} label="About" onClick={() => navigate('/about')} />
          <Navigation isActive={path === '/articles'} label="Articles" onClick={() => navigate('/articles')} />
        </NavigationContainer>
      </Container>
    </Wrapper>
  )
}
