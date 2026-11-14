import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './public-design.css';
import './energy-design.css';
import './motion-design.css';
import './reference-motion.css';
import './editorial-scenes.css';
import './immersive-stories.css';
import './approved-content.css';
import './cinematic-stories.css';
import './portfolio-refresh.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
