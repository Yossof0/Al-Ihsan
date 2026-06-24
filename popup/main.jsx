import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '../src/context/ThemeContext';
import PopupApp from './PopupApp';
import '../src/styles/index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <PopupApp />
    </ThemeProvider>
  </StrictMode>
);
