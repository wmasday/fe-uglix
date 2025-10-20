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


