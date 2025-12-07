import Container from '@mui/material/Container';
import PlaylisterAppBar from './components/PlaylisterAppBar';
import { AuthContextProvider } from './auth/AuthContextProvider';
import { GlobalStoreContextProvider } from './store/GlobalStoreContextProvider';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import WelcomeScreen from './screens/WelcomeScreen';
import RegisterScreen from './screens/RegisterScreen';
import SignInScreen from './screens/SignInScreen';
import EditAccountScreen from './screens/EditAccountScreen';
import PlaylistsScreen from './screens/PlaylistsScreen';

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <GlobalStoreContextProvider>
          <Container maxWidth="lg" sx={{ marginY: 7}}>
            <PlaylisterAppBar />
            <Routes>
              <Route path="/" element={<WelcomeScreen />} />
              <Route path="/register" element={<RegisterScreen />} />
              <Route path="/login" element={<SignInScreen />} />
              <Route path="/editAccount" element={<EditAccountScreen />} />
              <Route path="/playlists" element={<PlaylistsScreen />} />
            </Routes>
          </Container>
        </GlobalStoreContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;