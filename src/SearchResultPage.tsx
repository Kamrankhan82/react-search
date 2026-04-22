import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchClient from '@gaspl/search-client';
import ReactPaginate from 'react-paginate';

function SearchResultPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') ?? '';
    const pageSize = 30;
    const [totalHits, setTotalHits] = useState(0);
    const [products, setProducts] = useState([]);
    const [isSearchInitiated, setIsSearchInitiated] = useState(false);
    const sorts = [
        { 
          label: 'Most Relevant', 
          value: ['-isActive', '-_rank'],
          active: true
         },
        { 
          label: 'Price: Low → High', 
          value: ['-isActive', 'discounted_price'],
          active: false
         },
        { 
          label: 'Price: High → Low', 
          value: ['-isActive', '-discounted_price'],
          active: false
         },
        { 
          label: 'Alphabetically: A → Z', 
          value: ['-isActive', 'title'],
          active: false
         },
        { 
          label: 'Alphabetically: Z → A', 
          value: ['-isActive', '-title'],
          active: false
         }
    ];

    const sortFromURL = searchParams.get('sort');
    const [activeSort, setActiveSort] = useState<string[]>(sortFromURL ? sorts.find(s => s.label === sortFromURL)?.value ?? [] : sorts.find(s => s.active)?.value ?? []);

    const [filters, setFilters] = useState([
        {
            label: 'Collections',
            field: 'collections',
            type: 'textFacet',
            selected: [] as string[],
            values: [] as { label: string, value: number }[],
            isOpen: false
        },
        {
            label: 'Product Type',
            field: 'product_type',
            type: 'textFacet',
            selected: [],
            values: [],
            isOpen: false
        },
        {
            label: 'Size',
            field: 'size',
            type: 'textFacet',
            selected: [],
            values: [],
            isOpen: false
        },
        {
            label: 'Color',
            field: 'color',
            type: 'textFacet',
            selected: [],
            values: [],
            isOpen: false
        },
        {
            label: 'Gender',
            field: 'gender',
            type: 'textFacet',
            selected: [],
            values: [],
            isOpen: false
        },
        {
            label: 'Fit',
            field: 'fit',
            type: 'textFacet',
            selected: [],
            values: [],
            isOpen: false
        },
        {
            label: 'Neck',
            field: 'neck',
            type: 'textFacet',
            selected: [],
            values: [],
            isOpen: false
        },
        {
            label: 'Sleeve',
            field: 'sleeve',
            type: 'textFacet',
            selected: [],
            values: [],
            isOpen: false
        },
        {
            label: 'Discount',
            field: 'discount',
            type: 'numericFacet',
            selected: [],
            values: [],
            isOpen: false
        },
        {
            label: 'Price',
            field: 'discounted_price',
            type: 'numericFacet',
            selected: [],
            values: [],
            isOpen: false
        }
    ]);
    const [loading, setLoading] = useState(false);

    const selectedFilters = useMemo(()=> {
      const result: Record<string, Record<string, string[]>> = {};

      searchParams.forEach((value, key) => {
        if (key.startsWith('f.')) {
          const field = key.slice(2);
          const values = value.split(',');

          const matchedFilter = filters.find(f => f.field === field);
          const type = matchedFilter?.type ?? 'textFacet';

          if (!result[type]) result[type] = {};
          result[type][field] = values;
        }
      });

      return result;
    },[searchParams]);

    useEffect(()=> {
      setFilters((prevFilters) => {
        return prevFilters.map((filter) => {
          const selectedValues = selectedFilters[filter.type]?.[filter.field] ?? [];
          return { ...filter, selected: selectedValues };
        });
      });
    }, [selectedFilters]);

    const credentials = {
        apiKey: 'HNKBXZ6WRZ53UHFQMAMB3TMN',
        secretKey: 'JFH1L4JRGKLVFTQY4FQPXIFV',
        productsCollection: 'QPI32C64SIDELBV7BSK5H5LD',
        suggestionsCollection: 'F1YH9BQ1DZGJ4I2XNPRI2QCJ'
    };
    
    const searchClient = useMemo(() => {
      return new SearchClient(credentials.apiKey, credentials.secretKey)
    }, []);

    useEffect(() => {
      const mainContent = document.querySelector<HTMLElement>('main#MainContent');
      if (!mainContent) return;

      mainContent.style.display = query ? 'none' : '';

      searchClient.filter('isSearchable = 1');
      searchClient.textFacets('collections', 'gender', 'product_type', 'size', 'color', 'fit', 'neck', 'sleeve');
      searchClient.numericFacets('discount', [
        { 
          min: 10, 
          max: 100,
          minInclusive: true,
          maxInclusive: true  
        },
        {
          min: 20,
          max: 100,
          minInclusive: true,
          maxInclusive: true
        },
        {
          min: 30,
          max: 100,
          minInclusive: true,
          maxInclusive: true
        },
        {
          min: 40,
          max: 100,
          minInclusive: true,
          maxInclusive: true
        },
        {
          min: 50,
          max: 100,
          minInclusive: true,
          maxInclusive: true
        },
        {
          min: 60,
          max: 100,
          minInclusive: true,
          maxInclusive: true
        },
        {
          min: 70,
          max: 100,
          minInclusive: true,
          maxInclusive: true
        },
        {
          min: 80,
          max: 100,
          minInclusive: true,
          maxInclusive: true
        },
        {
          min: 90,
          max: 100,
          minInclusive: true,
          maxInclusive: true
        }
      ]);
      searchClient.numericFacets('discounted_price', [
        {
          min: 0,
          max: 1000,
          minInclusive: true,
          maxInclusive: true
        },
        {
          min: 1000,
          max: 2000,
          minInclusive: true,
          maxInclusive: true
        },
        {
          min: 2000,
          max: 5000,
          minInclusive: true,
          maxInclusive: true
        },
        {
          min: 5000,
          max: 10000,
          minInclusive: true,
          maxInclusive: true
        },
        {
          min: 10000,
          max: 20000,
          minInclusive: true,
          maxInclusive: true
        },
        {
          min: 20000,
          max: 50000,
          minInclusive: true,
          maxInclusive: true
        },
        {
          min: 50000,
          max: 999999999,
          minInclusive: true,
          maxInclusive: true
        }
      ]);
      searchClient.count(pageSize);
    }, []);

    const search = (skip = 0, selected = selectedFilters, sort = activeSort) => {
      setLoading(true);
      searchClient.skip(skip);
      // selected shape: { textFacet: { collections: ["Nike"] }, numericFacet: { discount: ["10-100"] } }
      Object.entries(selected).forEach(([facetType, fieldMap]) => {
        if (typeof fieldMap === 'object' && !Array.isArray(fieldMap)) {
          Object.entries(fieldMap as Record<string, string[]>).forEach(([field, values]) => {
            if (values && values.length > 0) {
              if (facetType === 'textFacet') {
                searchClient.textFacetFilters(field, values);
              } else {
                values.forEach((value) => {
                  const [min, max] = value.split('-');
                  searchClient.numericFacetFilters(field, Number(min), Number(max));
                });
              }
            }
          });
        }
      });
      searchClient.sort(...sort);
      searchClient.search(query, credentials.productsCollection).then((response: any) => {
        setProducts(response.results);
        setTotalHits(response.totalHits);
        setFilters((prevFilters) => {
          const facetValues = {...response.textFacets, ...response.numericFacets};
          return prevFilters.map((filter: any) => {
            if (facetValues[filter.field]) {
              return {
                ...filter,
                values: facetValues[filter.field]
              };
            }
            return filter;
          });
        });
      }).finally(() => {  
        setIsSearchInitiated(true);
        setLoading(false);
      });
    }

    const pushFiltersToURL = (activefilters: Record<string, Record<string, string[]>>) => {
      const url = new URL(window.location.href);
      filters.forEach(filter => url.searchParams.delete(`f.${filter.field}`));
      Object.entries(activefilters).forEach(([, fieldMap]) => {
        if (typeof fieldMap === 'object' && !Array.isArray(fieldMap)) {
          Object.entries(fieldMap as Record<string, string[]>).forEach(([field, values]) => {
            if (values && values.length > 0) {
              url.searchParams.set(`f.${field}`, values.join(','));
            }
          });
        }
      });
      window.history.pushState({}, '', url);
    }

    const pushSortToURL = (sortToPush: string) => {
      const url = new URL(window.location.href);
      const matched = sorts.find((s: any) => s.value.join(',') === sortToPush);
      if (matched && !matched.active) {
        // Non-default sort — write it to URL
        url.searchParams.set('sort', matched.label);
      } else {
        // Default sort — remove the param (no need to encode it)
        url.searchParams.delete('sort');
      }
      window.history.pushState({}, '', url);
    };
    
    const handleFilterChange = (event: any) => {
      const { value, name, checked } = event.target;
      const [, field] = name.split('.');

      const url = new URL(window.location.href);
      const current = url.searchParams.get(`f.${field}`)?.split(',') ?? [];

      const updated = checked
        ? [...current, value]
        : current.filter(v => v !== value);

      if (updated.length > 0) {
        url.searchParams.set(`f.${field}`, updated.join(','));
      } else {
        url.searchParams.delete(`f.${field}`);
      }

      setSearchParams(url.searchParams);
    };

    // ── Active-filter chip helpers ─────────────────────────────────────────
    /** Returns the human-readable label for a chip value. */
    const formatChipLabel = (facetType: string, val: string): string => {
      if (facetType === 'textFacet') return val;
      const [min, max] = val.split('-');
      return `Rs. ${min} to Rs. ${max}`;
    };

    /** Flat list of every active chip — recomputed only when selectedFilters changes. */
    const activeChips = useMemo(() =>
      Object.entries(selectedFilters).flatMap(([facetType, fieldMap]) =>
        Object.entries(fieldMap as Record<string, string[]>).flatMap(([facetField, values]) =>
          values.map((val) => ({ facetType, facetField, val }))
        )
      ),
    [selectedFilters]);

    const clearFilters = () => {
      const url = new URL(window.location.href);

      Array.from(url.searchParams.keys())
        .filter(key => key.startsWith('f.'))
        .forEach(key => url.searchParams.delete(key));

      setSearchParams(url.searchParams);
    };

    const removeFilter = (facetType: string, facetField: string, value: string) => {
      const url = new URL(window.location.href);
      const current = url.searchParams.get(`f.${facetField}`)?.split(',') ?? [];
      const updated = current.filter(v => v !== value);

      if (updated.length > 0) {
        url.searchParams.set(`f.${facetField}`, updated.join(','));
      } else {
        url.searchParams.delete(`f.${facetField}`);
      }

      setSearchParams(url.searchParams);

      setFilters((prevFilters) => {
        return prevFilters.map((filter) => {
          if (filter.field === facetField) {
            return { ...filter, selected: filter.selected.filter((v: string) => v !== value) }
          }
          return filter;
        })
      });
    }

    const handlePageClick = (event: any) => {
      const newPage = event.selected;
      search(newPage * pageSize);
    }

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newSort = event.target.value;
      const newSortArr = newSort.split(',');
      setActiveSort(newSortArr);
      pushSortToURL(newSort); // push URL immediately from the event handler
    }

    useEffect(() => {
      search(0, selectedFilters, activeSort);
    }, [query, selectedFilters, activeSort]);

    // ── Skeleton components (first-load only) ──────────────────────────────
    const SkeletonFilterCard = ({ rows = 4 }: { rows?: number }) => (
      <div className="sr-skel-filter-card">
        <div className="sr-skeleton sr-skel-filter-title" />
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="sr-skeleton sr-skel-filter-row" style={{ width: `${65 + (i % 3) * 10}%` }} />
        ))}
      </div>
    );

    const SkeletonProductCard = () => (
      <div className="sr-skel-card">
        <div className="sr-skeleton sr-skel-card-img" />
        <div className="sr-skel-card-body">
          <div className="sr-skeleton sr-skel-brand" />
          <div className="sr-skeleton sr-skel-name" />
          <div className="sr-skeleton sr-skel-name2" />
          <div className="sr-skeleton sr-skel-rating" />
          <div className="sr-skeleton sr-skel-price" />
          <div className="sr-skeleton sr-skel-btn" />
        </div>
      </div>
    );

    // Show full skeleton only on initial page load (before first response)
    if (!isSearchInitiated) {
      return (
        <div className="sr-wrapper">
          <aside className="sr-skel-sidebar">
            <div className="sr-skel-sidebar-header">
              <div className="sr-skeleton" style={{ height: 14, width: 60, borderRadius: 6 }} />
            </div>
            <SkeletonFilterCard rows={5} />
            <SkeletonFilterCard rows={3} />
            <SkeletonFilterCard rows={4} />
            <SkeletonFilterCard rows={3} />
          </aside>
          <main className="sr-main">
            <div className="sr-skel-meta">
              <div className="sr-skeleton sr-skel-meta-text" />
              <div className="sr-skel-meta-right">
                <div className="sr-skeleton sr-skel-sort" />
                <div className="sr-skeleton sr-skel-toggle" />
              </div>
            </div>
            <div className="sr-grid">
              {Array.from({ length: 12 }).map((_, i) => <SkeletonProductCard key={i} />)}
            </div>
          </main>
        </div>
      );
    }

    return (
    <div className="sr-wrapper">

    {/* <!-- ══════ SIDEBAR — FILTERS ══════ --> */}
    {isSearchInitiated && totalHits > 0 && (
      <aside className="sr-sidebar" id="sr-sidebar">

        <div className="sr-sidebar-header">
          <h2 className="sr-sidebar-title">Filters</h2>
          {/* <!-- JS HOOK: id="sr-btn-clear" → uncheck all, reset results --> */}
          {Object.keys(selectedFilters).length > 0 && (
            <button className="sr-btn-clear" id="sr-btn-clear" onClick={clearFilters}>Clear all</button>
          )}
        </div>

        {/* <!-- Category --> */}
        {/* <!-- JS HOOK: data-filter="category" → listen: change on checkboxes --> */}
        {filters.map(filter => (
          <details className="sr-filter-card" open data-filter={filter.field} key={filter.field}>
            <summary>{filter.label}</summary>
            <div className="sr-filter-body">
              {filter.values.map((val: any) => (
                <div key={val.label || `${val.min}-${val.max}`}>
                  {(filter.type === 'textFacet') && val.value > 0 && (
                    <label className="sr-check-row">
                      <input type="checkbox" name={filter.type + '.' + filter.field} value={val.label} onChange={handleFilterChange} checked={filter.selected.includes(val.label)} />
                      {val.label} <span className="sr-count">{val.value}</span>
                    </label>
                  )}
                  {(filter.type === 'numericFacet') && val.count > 0 && (
                    <label className="sr-check-row">
                      <input type="checkbox" name={filter.type + '.' + filter.field} value={val.min + '-' + val.max} onChange={handleFilterChange} checked={filter.selected.includes(val.min + '-' + val.max)} />
                      {(filter.field === 'discount') ? (
                        <>
                          {val.min}% and Above
                        </>
                      ) : (
                        <>
                          Rs. {val.min} {val.max === 999999999 ? 'and Above' : 'to Rs. ' + val.max}
                        </>
                      )} <span className="sr-count">{val.count}</span>
                    </label>
                  )}
                </div>
              ))}
            </div>
          </details>
        ))}
      </aside>
    )}

    {/* <!-- ══════ MAIN — RESULTS ══════ --> */}
    <main className="sr-main" id="sr-main">

      {/* <!-- Meta bar --> */}
      <div className="sr-meta">
        <p className="sr-meta-text">
          Showing <strong id="sr-results-count">{totalHits < pageSize ? totalHits : pageSize} of {totalHits}</strong> results for
          <strong id="sr-results-query">"{query}"</strong>
        </p>

        <div className="sr-meta-right">

          {/* <!-- JS HOOK: id="sr-sort" → change → re-sort results --> */}
          <select 
            className="sr-sort" 
            id="sr-sort" 
            aria-label="Sort results" 
            onChange={handleSortChange}
            value={activeSort.join(',')}
          >
            {sorts.map(sort => (
              <option value={sort.value.join(',')} key={sort.label}>{sort.label}</option>
            ))}
          </select>

          {/* <!-- JS HOOK: .sr-view-btn[data-view] → toggle grid/list layout --> */}
          <div className="sr-view-toggle">
            <button className="sr-view-btn active" data-view="grid" aria-label="Grid view">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="7" height="7" rx="1.5"/>
                <rect x="14" y="3" width="7" height="7" rx="1.5"/>
                <rect x="3" y="14" width="7" height="7" rx="1.5"/>
                <rect x="14" y="14" width="7" height="7" rx="1.5"/>
              </svg>
            </button>
            <button className="sr-view-btn" data-view="list" aria-label="List view">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="4" width="18" height="3" rx="1.5"/>
                <rect x="3" y="10.5" width="18" height="3" rx="1.5"/>
                <rect x="3" y="17" width="18" height="3" rx="1.5"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* <!-- JS HOOK: id="sr-active-filters" → inject/remove .sr-chip elements --> */}
      {activeChips.length > 0 && (
        <div className="sr-active-filters" id="sr-active-filters">
          {activeChips.map(({ facetType, facetField, val }) => (
            <span className="sr-chip" key={`${facetType}-${facetField}-${val}`}>
              {formatChipLabel(facetType, val)}
              <button
                className="sr-chip-remove"
                onClick={() => removeFilter(facetType, facetField, val)}
                aria-label={`Remove ${val}`}
              >×</button>
            </span>
          ))}
        </div>
      )}
      {/* <span className="sr-chip" key={`${facetType}-${facetField}-${value}`}>
        {value}
        <button className="sr-chip-remove" onClick={() => removeFilter(facetType, facetField, value)} aria-label={`Remove ${value}`}>×</button>
      </span> */}

      {/* <!-- Product Grid -->
      <!-- JS HOOK: id="sr-grid" → inject .sr-card elements dynamically --> */}
      <div className="sr-grid" id="sr-grid">

        {/* <!-- Product Card 1 --> */}
        {products.length > 0 && products.map((product: any) => (
        <article className="sr-card" data-id={product.id} key={product.id}>
          <div className="sr-card-img-wrap">
            {product.image ? (
                <img src={product.image.src} alt="Nike Air Zoom Pegasus" loading="lazy" />
                ) : ((product.images.length > 0) ? (
                    <img src={product.images[0].src} alt="Nike Air Zoom Pegasus" loading="lazy" />
                ) : (
                    ''
                    // <img src="/placeholder.jpg" alt="Nike Air Zoom Pegasus" loading="lazy" />
                ))}
            <span className="sr-badge sr-badge--sale">−{product.discount}%</span>
            <button className="sr-wishlist" aria-label="Wishlist" data-id="p001">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
          </div>
          <div className="sr-card-body">
            <p className="sr-card-brand">{product.vendor}</p>
            <h3 className="sr-card-name">{product.title}</h3>
            {/* <div className="sr-card-rating">
              <span className="sr-stars"><span className="sr-star">★</span><span className="sr-star">★</span><span className="sr-star">★</span><span className="sr-star">★</span><span className="sr-star empty">★</span></span>
              <span className="sr-rcount">(2,841)</span>
            </div> */}
            <div className="sr-card-price">
              <span className="sr-price-now">Rs. {product.discounted_price}</span>
              <span className="sr-price-was">Rs. {product.price}</span>
              <span className="sr-price-off">−{product.discount}%</span>
            </div>
            <button className="sr-btn-cart" data-id="p001">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              Add to Cart
            </button>
          </div>
        </article>
        ))}



      </div>
      {/* <!-- /#sr-grid --> */}

      {/* <!-- JS HOOK: id="sr-empty" → show when 0 results --> */}
      {isSearchInitiated && !loading && totalHits === 0 && (
        <div id="sr-empty" className="sr-empty-wrap">
          <div className="sr-empty">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
            <h3>No results found</h3>
            <p>Nothing for <strong id="sr-empty-query">"{query}"</strong>. Try adjusting your search.</p>
          </div>
        </div>
      )}

      {/* <!-- Pagination --> */}
      {/* <!-- JS HOOK: id="sr-pagination" → generate page buttons dynamically --> */}
      <ReactPaginate
        breakLabel="..."
        nextLabel={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>}
        className='sr-pagination'
        pageLinkClassName='sr-page-btn'
        previousLinkClassName='sr-page-btn'
        nextLinkClassName='sr-page-btn'
        breakLinkClassName='sr-page-btn'
        activeClassName='active'
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={Math.ceil(totalHits / pageSize)}
        previousLabel={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>}
        renderOnZeroPageCount={null}
      />

    </main>
    {/* <!-- /#sr-main --> */}
  </div>
    );
}

export default SearchResultPage;
