import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '../src/context/ThemeContext';
import { LanguageProvider } from '../src/context/LanguageContext';
import PopupApp from './PopupApp';
import '../src/styles/index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <PopupApp />
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>
);
