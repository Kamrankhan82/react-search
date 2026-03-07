import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Autocomplete from './Autocomplete.tsx'
import SearchResultPage from './SearchResultPage.tsx'

createRoot(document.getElementById('st-autocomplete-container')!).render(
  <StrictMode>
    <Autocomplete />
  </StrictMode>,
)

createRoot(document.getElementById('st-search-container')!).render(
  <StrictMode>
    <SearchResultPage/>
  </StrictMode>
)