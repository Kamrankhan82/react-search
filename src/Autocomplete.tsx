import SearchClient from '@gaspl/search-client';
import {useEffect, useState} from "react";
function Autocomplete() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);

    const searchClient = new SearchClient(
        'VD92PUST8CHG7WV2NBXLXIQP',
        'JSFJFRQFZK7Y42VAKAS2TABZ'
    );

    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        searchClient.search(query, 'BDDL4C2HPJY6N6XMSEPYZX28')
            .then((response: any) => {
                setResults(response.results);
            });

    }, [query]);
    return (
        <div>
            <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
            />

            {results.map((r, i) => (
                <div key={i}>{r.title}</div>
            ))}
        </div>
    )
}

export default Autocomplete