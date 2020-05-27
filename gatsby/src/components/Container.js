import styled, { css, up } from '@xstyled/styled-components'

export const Container = styled.div`
  box-sizing: border-box;
  padding: 0 5vw;
  width: 100%;

  ${up('lg',
    css`
      width: 1000px;
    `
  )}
`;