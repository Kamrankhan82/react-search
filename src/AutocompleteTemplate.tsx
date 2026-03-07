/**
 * AutocompleteTemplate
 *
 * Two static layout states — no JS logic, pure template/markup.
 *
 * STATE A  → input focused, no text  → popular searches + product cards grid
 * STATE B  → input has text          → suggestions sidebar + larger product card grid
 *
 * Toggle the `state` variable below to preview each layout.
 */

const state: 'default' | 'typing' = 'default'; // ← change to 'typing' to see typing state

/* ─────────────────────────────────────────────────────── mock data ── */

const popularSearches = [
    'Running Shoes',
    'Wireless Headphones',
    'Leather Jacket',
    'Smart Watch',
    'Yoga Mat',
    'Coffee Maker',
];

const suggestions = [
    'Apple iPhone 16 Pro',
    'Apple iPhone 16',
    'Apple MacBook Air M3',
    'Apple Watch Series 10',
    'Apple AirPods Pro',
    'Apple iPad Pro',
    'Apple Vision Pro',
    'Apple Mac Mini M4',
];

const defaultProducts = [
    { id: 1, name: 'Nike Air Max 270', price: '$129.99', badge: 'Popular', rating: 4.8, reviews: 2341, img: '👟' },
    { id: 2, name: 'Sony WH-1000XM5', price: '$279.99', badge: 'Best Seller', rating: 4.9, reviews: 5102, img: '🎧' },
    { id: 3, name: 'Levi\'s 501 Jeans',  price: '$59.99',  badge: 'Sale',       rating: 4.6, reviews: 894,  img: '👖' },
    { id: 4, name: 'Samsung Galaxy Watch 7', price: '$249.99', badge: 'New', rating: 4.7, reviews: 1230, img: '⌚' },
    { id: 5, name: 'Adidas Ultraboost 24', price: '$189.99', badge: '', rating: 4.5, reviews: 670, img: '👟' },
    { id: 6, name: 'JBL Charge 5',    price: '$89.99',  badge: 'Popular',    rating: 4.8, reviews: 3210, img: '🔊' },
];

const typingProducts = [
    { id: 1,  name: 'iPhone 16 Pro Max 256GB', price: '$1,199.00', badge: 'New',         rating: 4.9, reviews: 8821, img: '📱' },
    { id: 2,  name: 'iPhone 16 Pro 128GB',    price: '$999.00',   badge: 'New',         rating: 4.9, reviews: 7430, img: '📱' },
    { id: 3,  name: 'iPhone 16 256GB',         price: '$799.00',   badge: 'Popular',     rating: 4.7, reviews: 5211, img: '📱' },
    { id: 4,  name: 'iPhone 15 Pro',           price: '$749.00',   badge: 'Sale',        rating: 4.8, reviews: 9102, img: '📱' },
    { id: 5,  name: 'MacBook Air M3 13"',      price: '$1,099.00', badge: 'Best Seller', rating: 4.9, reviews: 4321, img: '💻' },
    { id: 6,  name: 'MacBook Pro M4 14"',      price: '$1,599.00', badge: 'New',         rating: 4.9, reviews: 2100, img: '💻' },
    { id: 7,  name: 'Apple Watch Series 10',   price: '$399.00',   badge: '',            rating: 4.8, reviews: 3320, img: '⌚' },
    { id: 8,  name: 'AirPods Pro 2nd Gen',     price: '$229.00',   badge: 'Popular',     rating: 4.8, reviews: 11020, img: '🎧' },
];

/* ─────────────────────────────────────────────────── sub-components ── */

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    className={`w-3 h-3 ${star <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

function BadgePill({ label }: { label: string }) {
    const colours: Record<string, string> = {
        'New':         'bg-violet-100 text-violet-700',
        'Popular':     'bg-blue-100 text-blue-700',
        'Best Seller': 'bg-emerald-100 text-emerald-700',
        'Sale':        'bg-rose-100 text-rose-700',
    };
    return (
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${colours[label] ?? 'bg-gray-100 text-gray-500'}`}>
            {label}
        </span>
    );
}

/* ───────────── Default state product card (smaller, grid of 6) ─────── */

function DefaultProductCard({ product }: { product: typeof defaultProducts[0] }) {
    return (
        <div className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:border-violet-200 transition-all duration-200 cursor-pointer">
            {/* image area */}
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center h-28">
                <span className="text-5xl select-none group-hover:scale-110 transition-transform duration-200">
                    {product.img}
                </span>
                {product.badge && (
                    <div className="absolute top-2 left-2">
                        <BadgePill label={product.badge} />
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
                <p className="text-xs font-semibold text-gray-800 leading-snug line-clamp-2">{product.name}</p>
                <div className="flex items-center gap-1">
                    <StarRating rating={product.rating} />
                    <span className="text-[10px] text-gray-400">({product.reviews.toLocaleString()})</span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                    <span className="text-sm font-bold text-violet-600">{product.price}</span>
                    <button className="text-[10px] font-medium text-gray-500 hover:text-violet-600 transition-colors">
                        View →
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ───────────── Typing state product card (slightly larger, grid of 8) ── */

function TypingProductCard({ product }: { product: typeof typingProducts[0] }) {
    return (
        <div className="group flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3 hover:shadow-md hover:border-violet-200 transition-all duration-200 cursor-pointer">
            {/* thumbnail */}
            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <span className="text-3xl select-none">{product.img}</span>
            </div>

            {/* info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1">
                    <p className="text-xs font-semibold text-gray-800 leading-snug line-clamp-2">{product.name}</p>
                    {product.badge && <BadgePill label={product.badge} />}
                </div>
                <div className="flex items-center gap-1 mt-1">
                    <StarRating rating={product.rating} />
                    <span className="text-[10px] text-gray-400">({product.reviews.toLocaleString()})</span>
                </div>
                <p className="text-sm font-bold text-violet-600 mt-1">{product.price}</p>
            </div>

            <svg className="w-4 h-4 text-gray-300 group-hover:text-violet-400 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
        </div>
    );
}

/* ════════════════════════════════════════════ MAIN COMPONENT ══════════ */

export default function AutocompleteTemplate() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-indigo-50 flex flex-col items-center pt-16 pb-20 px-4 font-sans">

            {/* Google Font */}
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'); * { font-family: 'Inter', sans-serif; }`}</style>

            {/* ── Header / search bar ── */}
            <div className="w-full max-w-3xl">
                <div className="text-center mb-8">
                    <span className="inline-flex items-center gap-2 text-violet-700 font-semibold text-sm bg-violet-100 px-3 py-1 rounded-full mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                        Search Preview Template
                    </span>
                    <h1 className="text-2xl font-bold text-gray-900">Autocomplete Search Component</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Toggle <code className="bg-gray-100 px-1.5 py-0.5 rounded text-violet-600 text-xs">state</code> variable to switch between layouts
                    </p>
                </div>

                {/* Search input */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        readOnly
                        value={state === 'typing' ? 'Apple' : ''}
                        placeholder="Search for products, brands and more…"
                        className="w-full pl-12 pr-12 py-4 bg-white border-2 border-violet-300 rounded-2xl text-sm text-gray-800 placeholder-gray-400 shadow-lg shadow-violet-100 outline-none focus:border-violet-500 transition-colors"
                    />
                    {state === 'typing' && (
                        <div className="absolute inset-y-0 right-4 flex items-center">
                            <button className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors">
                                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {/* ══════════════════════════════════ DROPDOWN PANEL ══════ */}
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl shadow-gray-200/80 border border-gray-100 overflow-hidden z-50">

                        {/* ── STATE A: Default (focused, no text) ─────────────── */}
                        {state === 'default' && (
                            <div className="p-5">

                                {/* Popular searches */}
                                <div className="mb-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <svg className="w-4 h-4 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Popular Searches</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {popularSearches.map((term) => (
                                            <button
                                                key={term}
                                                className="flex items-center gap-1.5 text-sm text-gray-700 bg-gray-50 hover:bg-violet-50 hover:text-violet-700 border border-gray-200 hover:border-violet-200 px-3 py-1.5 rounded-full transition-all duration-150"
                                            >
                                                <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                                {term}
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
                                    {defaultProducts.map((p) => (
                                        <DefaultProductCard key={p.id} product={p} />
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

                        {/* ── STATE B: Typing layout ───────────────────────────── */}
                        {state === 'typing' && (
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
                                        {suggestions.map((s, i) => (
                                            <li key={s}>
                                                <button className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-sm transition-all duration-150 group ${i === 0 ? 'bg-violet-50 text-violet-700 font-medium' : 'text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm'}`}>
                                                    <svg className={`w-3.5 h-3.5 flex-shrink-0 ${i === 0 ? 'text-violet-400' : 'text-gray-300 group-hover:text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                    </svg>
                                                    <span className="truncate">{s}</span>
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
                                        <span className="text-[10px] text-gray-400">{typingProducts.length} results</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        {typingProducts.map((p) => (
                                            <TypingProductCard key={p.id} product={p} />
                                        ))}
                                    </div>

                                    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-center">
                                        <button className="text-xs font-medium text-violet-600 hover:text-violet-800 flex items-center gap-1 transition-colors">
                                            See all results for "Apple"
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* ══════════════════════════════════════════════════════════ */}
                </div>
            </div>
        </div>
    );
}
