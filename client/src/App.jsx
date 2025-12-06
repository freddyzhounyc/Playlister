import Container from '@mui/material/Container';
import PlaylisterAppBar from './components/PlaylisterAppBar';
import { AuthContextProvider } from './auth/AuthContextProvider';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import WelcomeScreen from './screens/WelcomeScreen';

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Container maxWidth="lg" sx={{ marginY: 7}}>
          <PlaylisterAppBar />
          <Routes>
            <Route path="/" element={<WelcomeScreen />} />
          </Routes>
        </Container>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;