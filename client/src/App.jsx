import Container from '@mui/material/Container';
import PlaylisterAppBar from './components/PlaylisterAppBar';
import { AuthContextProvider } from './auth/AuthContextProvider';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import WelcomeScreen from './screens/WelcomeScreen';
import RegisterScreen from './screens/RegisterScreen';
import SignInScreen from './screens/SignInScreen';

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Container maxWidth="lg" sx={{ marginY: 7}}>
          <PlaylisterAppBar />
          <Routes>
            <Route path="/" element={<WelcomeScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/login" element={<SignInScreen />} />
          </Routes>
        </Container>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;