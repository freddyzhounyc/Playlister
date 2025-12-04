import Container from '@mui/material/Container';
import PlaylisterAppBar from './PlaylisterAppBar';
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
        <Container maxWidth="lg" sx={{ marginY: 7 }}>
          <PlaylisterAppBar />
        </Container>
    </BrowserRouter>
  );
}

export default App