import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AutocompleteTemplate from './AutocompleteTemplate.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AutocompleteTemplate />
    </StrictMode>,
)
