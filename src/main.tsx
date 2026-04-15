import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// Single root — BrowserRouter inside App handles both Autocomplete and SearchResultPage
// via React portals so each component still mounts in its original DOM container.
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>
);