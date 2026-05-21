import { ThemeProvider } from 'styled-components'
import theme from './shared/theme'
import GlobalStyles from './shared/theme/GlobalStyles'
import AppRoutes from './routes/AppRoutes'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AppRoutes />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        theme="dark"
      />
    </ThemeProvider>
  )
}

export default App
