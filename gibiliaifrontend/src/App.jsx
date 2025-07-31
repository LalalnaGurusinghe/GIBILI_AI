import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { AnimatePresence } from 'framer-motion';

import { AppProvider } from './context/AppContext';
import theme from './theme';
import Navbar from './components/Navbar';

// Pages
import Dashboard from './pages/Dashboard';
import GeneratePage from './pages/GeneratePage';
import UploadPage from './pages/UploadPage';
import Gallery from './pages/Gallery';
import Settings from './pages/Settings';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <Router>
          <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
            <Navbar />
            <Box component="main" sx={{ pt: 8 }}>
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/generate" element={<GeneratePage />} />
                  <Route path="/upload" element={<UploadPage />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </AnimatePresence>
            </Box>
          </Box>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
