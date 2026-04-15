import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createPortal } from 'react-dom';
import Autocomplete from './Autocomplete';
import SearchResultPage from './SearchResultPage';

export default function App() {
    const autocompleteContainer = document.getElementById('st-autocomplete-container');
    const searchContainer = document.getElementById('st-search-container');

    return (
        <BrowserRouter>
            {/* Portal Autocomplete into its existing DOM slot — keeps HTML structure intact */}
            {autocompleteContainer && createPortal(<Autocomplete />, autocompleteContainer)}

            {/* Portal SearchResultPage into its existing DOM slot, only on /search */}
            {searchContainer && createPortal(
                <Routes>
                    <Route path="/search" element={<SearchResultPage />} />
                </Routes>,
                searchContainer
            )}
        </BrowserRouter>
    );
}
