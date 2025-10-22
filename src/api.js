export async function fetchMovies({ search = '', genreId = '' } = {}) {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (genreId) params.set('genre_id', genreId);

    const res = await fetch(`/api/movies${params.toString() ? `?${params.toString()}` : ''}`, {
        headers: { 'Accept': 'application/json' },
        credentials: 'include',
    });
    if (!res.ok) throw new Error(`Failed to fetch movies: ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : (data.data || []);
}

export async function fetchGenres() {
    const res = await fetch('/api/genres', {
        headers: { 'Accept': 'application/json' },
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch genres');
    return await res.json();
}

export async function fetchDropdownData() {
    const [genresRes, countriesRes, yearsRes] = await Promise.all([
        fetch('/api/dropdown/genres', {
            headers: { 'Accept': 'application/json' },
            credentials: 'include',
        }).catch(() => null),
        fetch('/api/dropdown/countries', {
            headers: { 'Accept': 'application/json' },
            credentials: 'include',
        }).catch(() => null),
        fetch('/api/dropdown/years', {
            headers: { 'Accept': 'application/json' },
            credentials: 'include',
        }).catch(() => null)
    ]);

    // Parse responses and extract data
    const genres = genresRes?.ok ? await genresRes.json() : null;
    const countries = countriesRes?.ok ? await countriesRes.json() : null;
    const years = yearsRes?.ok ? await yearsRes.json() : null;

    // Extract data from API response format {success: true, data: [...]}
    return {
        genres: Array.isArray(genres?.data) ? genres.data : [],
        countries: Array.isArray(countries?.data) ? countries.data : [],
        years: Array.isArray(years?.data) ? years.data : []
    };
}

export async function fetchNewReleases({ page = 1, perPage = 20 } = {}) {
    const params = new URLSearchParams();
    params.set('page', page);
    params.set('per_page', perPage);

    const res = await fetch(`/api/movies/new-releases?${params.toString()}`, {
        headers: { 'Accept': 'application/json' },
        credentials: 'include',
    });
    if (!res.ok) throw new Error(`Failed to fetch new releases: ${res.status}`);
    return await res.json();
}

export async function fetchTopRated({ page = 1, perPage = 20 } = {}) {
    const params = new URLSearchParams();
    params.set('page', page);
    params.set('per_page', perPage);

    const res = await fetch(`/api/movies/top-rated?${params.toString()}`, {
        headers: { 'Accept': 'application/json' },
        credentials: 'include',
    });
    if (!res.ok) throw new Error(`Failed to fetch top rated: ${res.status}`);
    return await res.json();
}

export async function searchMovies({
    search = '',
    genreId = '',
    country = '',
    year = '',
    type = '',
    page = 1,
    perPage = 20
} = {}) {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (genreId) params.set('genre_id', genreId);
    if (country) params.set('country', country);
    if (year) params.set('year', year);
    if (type) params.set('type', type);
    params.set('page', page);
    params.set('per_page', perPage);

    const res = await fetch(`/api/movies/search?${params.toString()}`, {
        headers: { 'Accept': 'application/json' },
        credentials: 'include',
    });
    if (!res.ok) throw new Error(`Failed to search movies: ${res.status}`);
    return await res.json();
}

export async function fetchActor(id) {
    const res = await fetch(`/api/actors/${id}`, {
        headers: { 'Accept': 'application/json' },
        credentials: 'include',
    });
    if (!res.ok) throw new Error(`Failed to fetch actor: ${res.status}`);
    return await res.json();
}

export async function fetchActorMovies({ actorId, page = 1, perPage = 20 } = {}) {
    const params = new URLSearchParams();
    params.set('page', page);
    params.set('per_page', perPage);

    const res = await fetch(`/api/actors/${actorId}/movies?${params.toString()}`, {
        headers: { 'Accept': 'application/json' },
        credentials: 'include',
    });
    if (!res.ok) throw new Error(`Failed to fetch actor movies: ${res.status}`);
    return await res.json();
}


