import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '../src/context/ThemeContext';
import NewTabApp from './NewTabApp';
import '../src/styles/index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <NewTabApp />
    </ThemeProvider>
  </StrictMode>
);
