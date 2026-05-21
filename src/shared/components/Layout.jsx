import styled from 'styled-components'
import { Outlet } from 'react-router-dom'
import Sidebar from './sidebar/Sidebar'

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`

const Main = styled.main`
  flex: 1;
  margin-left: var(--sidebar-width, 200px);
  padding: ${({ theme }) => theme.spacing.lg};
  transition: margin-left 0.3s ease;
  display: flex;
  justify-content: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    margin-left: 0;
    padding: ${({ theme }) => theme.spacing.md};
    padding-top: 72px;
  }
`

const MainContent = styled.div`
  width: 100%;
  max-width: 1280px;
`

export default function Layout() {
  return (
    <LayoutContainer>
      <Sidebar />
      <Main>
        <MainContent>
          <Outlet />
        </MainContent>
      </Main>
    </LayoutContainer>
  )
}
