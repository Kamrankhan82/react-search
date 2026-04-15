import SearchClient from '@gaspl/search-client';
import React, {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';

const getProductURL = (handle: any) => {
    return `${window.location.origin}/products/${handle}`;
};

export const TrendingSearchType = {
    SimpleSearch: 1,
    Redirect: 2,
    QueryRule: 3,
} as const;

export type TrendingSearchType = typeof TrendingSearchType[keyof typeof TrendingSearchType];

export const TrendingEntityType = {
    UserDefined: 0,
    Collection: 1,
    ProductType: 2,
} as const;

export type TrendingEntityType = typeof TrendingEntityType[keyof typeof TrendingEntityType];



/* ─────────────────────────── Skeleton / shimmer primitives ─────────── */

function Shimmer({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
    return (
        <div className={`animate-pulse bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded ${className}`} style={style} />
    );
}

/** Skeleton for the default (no-query) panel */
function DefaultStateSkeleton() {
    return (
        <div className="p-5">
            {/* popular search chips skeleton */}
            <div className="flex items-center gap-2 mb-3">
                <Shimmer className="w-4 h-4 rounded-full" />
                <Shimmer className="w-32 h-3 rounded-full" />
            </div>
            <div className="flex flex-wrap gap-2 mb-5">
                {[88, 140, 110, 96, 80, 120].map((w, i) => (
                    <Shimmer key={i} className="h-8 rounded-full" style={{ width: w }} />
                ))}
            </div>

            {/* divider skeleton */}
            <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-gray-100" />
                <Shimmer className="w-28 h-2.5 rounded-full" />
                <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* 6-card product grid skeleton */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex flex-col rounded-2xl overflow-hidden border border-gray-100">
                        <Shimmer className="h-28 rounded-none" />
                        <div className="p-3 flex flex-col gap-2">
                            <Shimmer className="h-3 w-full rounded-full" />
                            <Shimmer className="h-2.5 w-3/4 rounded-full" />
                            <Shimmer className="h-4 w-1/2 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/** Skeleton for the typing (search-active) panel */
function TypingStateSkeleton() {
    return (
        <div className="flex" style={{ minHeight: '420px' }}>
            {/* LEFT — suggestions skeleton */}
            <div className="w-64 flex-shrink-0 border-r border-gray-100 p-4 bg-gray-50/60">
                <div className="flex items-center gap-2 mb-3">
                    <Shimmer className="w-3.5 h-3.5 rounded-full" />
                    <Shimmer className="w-20 h-2.5 rounded-full" />
                </div>
                <div className="space-y-1">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-2.5 px-2.5 py-2">
                            <Shimmer className="w-3.5 h-3.5 flex-shrink-0 rounded-full" />
                            <Shimmer className={`h-3 rounded-full flex-1`} style={{ width: `${60 + Math.floor(i * 7) % 35}%` }} />
                        </div>
                    ))}
                </div>
                <div className="mt-4 pt-3 border-t border-gray-200">
                    <Shimmer className="w-16 h-2.5 rounded-full mb-2" />
                    <div className="flex flex-wrap gap-1.5">
                        {[56, 68, 52, 80].map((w, i) => (
                            <Shimmer key={i} className="h-6 rounded-full" style={{ width: w }} />
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT — product cards skeleton */}
            <div className="flex-1 p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Shimmer className="w-3.5 h-3.5 rounded-full" />
                        <Shimmer className="w-16 h-2.5 rounded-full" />
                    </div>
                    <Shimmer className="w-14 h-2.5 rounded-full" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 border border-gray-100 rounded-xl p-3">
                            <Shimmer className="w-14 h-14 flex-shrink-0 rounded-xl" />
                            <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                                <Shimmer className="h-3 w-full rounded-full" />
                                <Shimmer className="h-2.5 w-3/4 rounded-full" />
                                <Shimmer className="h-3.5 w-1/2 rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/** No-results empty state */
function NoResults({ query, trendingSearches }: { query: string; trendingSearches: any[] }) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center" style={{ minHeight: '320px' }}>
            {/* Illustration */}
            <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full bg-violet-50 flex items-center justify-center">
                    <svg className="w-9 h-9 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                {/* Sad dot */}
                <span className="absolute -bottom-0.5 -right-0.5 w-7 h-7 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center text-base">
                    😕
                </span>
            </div>

            <h3 className="text-sm font-semibold text-gray-800 mb-1">
                No results for <span className="text-violet-600">&ldquo;{query}&rdquo;</span>
            </h3>
            <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                We couldn't find anything matching your search. Try a different keyword or browse popular searches below.
            </p>

            {/* Suggestions row */}
            {trendingSearches.length > 0 && (
                <div className="mt-6 w-full max-w-sm">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
                        Try instead
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {trendingSearches.map((term) => (
                            <button
                                key={term.id}
                                className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 hover:bg-violet-50 hover:text-violet-700 border border-gray-200 hover:border-violet-200 px-3 py-1.5 rounded-full transition-all duration-150"
                                onClick={() => handleTrendingSearchClick(term)}
                            >
                                <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                {term.displayLabel}
            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* CTA */}
            <button className="mt-6 text-xs font-medium text-violet-600 hover:text-violet-800 flex items-center gap-1 transition-colors">
                Browse all products
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
}

function FeaturedProductCard({ product }: { product: any }) {
    return (
        <div className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:border-violet-200 transition-all duration-200 cursor-pointer">
            {/* image area */}
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center h-28">
                <a href={getProductURL(product.handle)} className="text-5xl select-none group-hover:scale-110 transition-transform duration-200">
                    <img className="text-3xl select-none" src={product.image.src} alt={product.title} />
                </a>
                {product.badge && (
                    <div className="absolute top-2 left-2">
                        {/* <BadgePill label={product.badge} /> */}login
                    </div>
                )}
                <button
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Wishlist"
                >
                    <svg className="w-3.5 h-3.5 text-gray-400 hover:text-rose-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            </div>

            {/* info area */}
            <div className="p-3 flex flex-col gap-1.5">
                <a href={getProductURL(product.handle)} className="text-xs font-semibold text-gray-800 leading-snug line-clamp-2">{product.title}</a>
                <div className="flex items-center gap-1">
                    {/* <StarRating rating={product.rating} /> */}
                    {/* <span className="text-[10px] text-gray-400">({product.reviews?.toLocaleString()})</span> */}
                </div>
                <div className="flex items-center justify-between mt-0.5">
                    <span className="text-sm font-bold text-violet-600">{product.discountedPrice}</span>
                    <button className="text-[10px] font-medium text-gray-500 hover:text-violet-600 transition-colors">
                        View →
                    </button>
                </div>
            </div>
        </div>
    );
}

function SuggestionsProductCard({ product }: {product: any}) {
    return (
        <div className="group flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3 hover:shadow-md hover:border-violet-200 transition-all duration-200 cursor-pointer">
            {/* thumbnail */}
            <a href={getProductURL(product.handle)} className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <img className="text-3xl select-none" src={product.image.src} alt={product.title} />
            </a>

            {/* info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1">
                    <a href={getProductURL(product.handle)} className="text-xs font-semibold text-gray-800 leading-snug line-clamp-2">{product.title}</a>
                    {/* {product.badge && <BadgePill label={product.badge} />} */}
                </div>
                <div className="flex items-center gap-1 mt-1">
                    {/* <StarRating rating={product.rating} /> */}
                    {/* <span className="text-[10px] text-gray-400">({product.reviews.toLocaleString()})</span> */}
                </div>
                <p className="text-sm font-bold text-violet-600 mt-1">{product.discountedPrice}</p>
            </div>

            <svg className="w-4 h-4 text-gray-300 group-hover:text-violet-400 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
        </div>
    );
}

function Autocomplete() {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [autocompleteVisible, setAutocompleteVisible] = useState(false);
    const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
    const [suggestionsProducts, setSuggestionsProducts] = useState<any[]>([]);
    const [trendingSearches, setTrendingSearches] = useState<any[]>([]);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loadingDefault, setLoadingDefault] = useState(false); // loading for default (no-query) panel
    const [loadingSearch, setLoadingSearch] = useState(false);   // loading for typing panel


    const credentials = {
        apiKey: 'HNKBXZ6WRZ53UHFQMAMB3TMN',
        secretKey: 'JFH1L4JRGKLVFTQY4FQPXIFV',
        productsCollection: 'QPI32C64SIDELBV7BSK5H5LD',
        suggestionsCollection: 'F1YH9BQ1DZGJ4I2XNPRI2QCJ'
    };

    const suggestionsSearchClient = new SearchClient(
        credentials.apiKey,
        credentials.secretKey
    );
    const productsSearchClient = new SearchClient(
        credentials.apiKey,
        credentials.secretKey
    );

    const fetchDefaultData = () => {
        setLoadingDefault(true);
        suggestionsSearchClient.filter("isSearchable = 1 AND showInSuggestion = 1");
        suggestionsSearchClient.sort("-trendingScoreForOnFocusTerms");
        suggestionsSearchClient.count(6);

        productsSearchClient.filter("isSearchable = 1 AND isActive = 1 AND (collections = \"New Arrivals\")");
        productsSearchClient.sort("new_arrivals_position", "-_rank");
        productsSearchClient.count(6);

        Promise.all([
            suggestionsSearchClient.search('', credentials.suggestionsCollection),
            productsSearchClient.search('', credentials.productsCollection),
        ]).then(([suggestionsRes, productsRes]: [any, any]) => {
            setTrendingSearches(suggestionsRes.results);
            setFeaturedProducts(productsRes.results);
        }).finally(() => {
            setLoadingDefault(false);
        });
    }

    const fetchSearchData = () => {
        setLoadingSearch(true);
        suggestionsSearchClient.filter("isSearchable = 1");
        suggestionsSearchClient.count(10);
        productsSearchClient.filter("isSearchable = 1 AND isActive = 1");
        productsSearchClient.count(8);
        Promise.all([
            suggestionsSearchClient.search(query, credentials.suggestionsCollection),
            productsSearchClient.search(query, credentials.productsCollection),
        ]).then(([suggestionsRes, productsRes]: [any, any]) => {
            setSuggestions(suggestionsRes.results);
            setSuggestionsProducts(productsRes.results);
        }).finally(() => {
            setLoadingSearch(false);
        });
    }

    const handleFocus = (value: boolean) => {
        setAutocompleteVisible(value);
    };

    const handleTrendingSearchClick = (trendingSearch: any) => {
        const shopBaseURL = window.location.origin;
        switch (trendingSearch.trendingSearchType) {
            case TrendingSearchType.SimpleSearch:
                navigate(`/search?q=${encodeURIComponent(trendingSearch.searchTerm ?? trendingSearch.displayLabel)}`);
                break;
            case TrendingSearchType.Redirect:
                // Redirect-type searches navigate away to collection/external URLs
                window.location.href = (
                    trendingSearch.entityType === TrendingEntityType.Collection
                        ? `${shopBaseURL}/collections/${trendingSearch.collectionHandle}`
                        : trendingSearch.redirectUrl
                ) as string;
                break;
            case TrendingSearchType.QueryRule:
                navigate(`/search?rule=${encodeURIComponent(trendingSearch.queryRule!)}`);
                break;
            default:
                break;
        }
    };

    const handleInputChange = React.useRef<(e: any) => void>(()=>{});
    const handleEnterKey = React.useRef<(e: any) => void>(()=>{});

    handleInputChange.current = (e: any) => {
        const currentValue = e.target.value;
        setQuery(currentValue);
    };

    handleEnterKey.current = (e: any) => {
        if (e.key !== 'Enter') return;
        const currentValue = (e.target as HTMLInputElement).value.trim();
        if (!currentValue) return;
        const matched = suggestions.find(suggestion =>
            suggestion.displayLabel.toLowerCase() === currentValue.toLowerCase() ||
            suggestion.keywords.some((keyword: string) =>
                keyword.toLowerCase() === currentValue.toLowerCase()
            )
        );
        if (matched) {
            handleTrendingSearchClick(matched);
        } else {
            navigate(`/search?q=${encodeURIComponent(currentValue)}`);
        }
        setAutocompleteVisible(false);
    }

    useEffect(()=>{
        const searchInput = document.getElementById("search") as HTMLInputElement | null;
        searchInput?.addEventListener("focus", () => {
            handleFocus(true);
        });
        searchInput?.addEventListener("keyup", (e: any) => handleInputChange.current(e));
        searchInput?.addEventListener("keydown", (e: any) => handleEnterKey.current(e));
        document.addEventListener("click", (e: any) => {
            if (searchInput?.contains(e.target) || document.getElementById("st-autocomplete-container")?.contains(e.target)) {
                return;
            }
            handleFocus(false);
        });

        // Sync HTML close button's clear action with React state
        const closeBtn = document.getElementById("search-close-btn");
        closeBtn?.addEventListener("click", () => {
            if (searchInput) {
                searchInput.value = '';
                // dispatch a synthetic keyup so handleInputChange resets query
                searchInput.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
            }
        });
    }, []);

    useEffect(() => {
        if (!query) {
            setSuggestionsProducts([]);
            setSuggestions([]);
            setLoadingSearch(false);
            return;
        }

        fetchSearchData();
    }, [query]);

    useEffect(() => {
        if (featuredProducts.length > 0 || trendingSearches.length > 0) return;

        if (!autocompleteVisible) {
            setFeaturedProducts([]);
            setTrendingSearches([]);
            return;
        }

        fetchDefaultData();
    }, [autocompleteVisible]);

    return (
        <>
                    
                    {autocompleteVisible && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl shadow-gray-200/80 border border-gray-100 overflow-hidden z-50">
                    
                    {query.length === 0 && (
                        loadingDefault
                            ? <DefaultStateSkeleton />
                            : <div className="p-5">

                                {/* Popular searches */}
                                <div className="mb-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <svg className="w-4 h-4 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Popular Searches</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {trendingSearches.map((term) => (
                                            <button
                                                key={term.id}
                                                className="flex items-center gap-1.5 text-sm text-gray-700 bg-gray-50 hover:bg-violet-50 hover:text-violet-700 border border-gray-200 hover:border-violet-200 px-3 py-1.5 rounded-full transition-all duration-150"
                                                onClick={() => handleTrendingSearchClick(term)}
                                            >
                                                <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                                {term.displayLabel}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex-1 h-px bg-gray-100" />
                                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Featured Products</span>
                                    <div className="flex-1 h-px bg-gray-100" />
                                </div>

                                {/* 6-card product grid */}
                                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                                    {featuredProducts.map((product) => (
                                        <FeaturedProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                {/* Footer CTA */}
                                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-center">
                                    <button className="text-xs font-medium text-violet-600 hover:text-violet-800 flex items-center gap-1 transition-colors">
                                        Browse all trending products
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                    )}
                    {query.length > 0 && (
                        loadingSearch
                            ? <TypingStateSkeleton />
                            : (suggestions.length === 0 && suggestionsProducts.length === 0)
                                ? <NoResults query={query} trendingSearches={trendingSearches} />
                                :
                            <div className="flex" style={{ minHeight: '420px' }}>

                                {/* LEFT — Suggestions sidebar */}
                                <div className="w-64 flex-shrink-0 border-r border-gray-100 p-4 bg-gray-50/60">
                                    <div className="flex items-center gap-2 mb-3">
                                        <svg className="w-3.5 h-3.5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Suggestions</span>
                                    </div>
                                    <ul className="space-y-0.5">
                                        {suggestions.map((suggestion, i) => (
                                            <li key={suggestion.id}>
                                                <button className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-sm transition-all duration-150 group ${i === 0 ? 'bg-violet-50 text-violet-700 font-medium' : 'text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm'}`}
                                                        onClick={() => handleTrendingSearchClick(suggestion)}
                                                >
                                                    <svg className={`w-3.5 h-3.5 flex-shrink-0 ${i === 0 ? 'text-violet-400' : 'text-gray-300 group-hover:text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                    </svg>
                                                    <span className="truncate">{suggestion.displayLabel}</span>
                                                    <svg className={`w-3 h-3 ml-auto flex-shrink-0 ${i === 0 ? 'text-violet-300' : 'text-gray-200 group-hover:text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Category quick filters */}
                                    <div className="mt-4 pt-3 border-t border-gray-200">
                                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Category</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {['Phones', 'Laptops', 'Tablets', 'Accessories'].map((cat) => (
                                                <button key={cat} className="text-[10px] font-medium px-2 py-1 rounded-full bg-white border border-gray-200 text-gray-600 hover:border-violet-300 hover:text-violet-600 transition-all">
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT — Product cards (2-col grid of 8) */}
                                <div className="flex-1 p-4 overflow-y-auto">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-3.5 h-3.5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8l1 12a2 2 0 002 2h8a2 2 0 002-2L19 8" />
                                            </svg>
                                            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Products</span>
                                        </div>
                                        <span className="text-[10px] text-gray-400">{suggestionsProducts.length} results</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        {suggestionsProducts.map((p) => (
                                            <SuggestionsProductCard key={p.id} product={p} />
                                        ))}
                                    </div>

                                    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-center">
                                        <button className="text-xs font-medium text-violet-600 hover:text-violet-800 flex items-center gap-1 transition-colors">
                                            See all results for "{query}"
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                )}
        </>
    )
}

export default Autocomplete