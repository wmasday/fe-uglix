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

// Authentication API functions
export async function loginUser(email, password) {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
    }

    return await response.json();
}

export async function registerUser(username, email, password, full_name) {
    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ username, email, password, full_name })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
    }

    return await response.json();
}

export async function fetchMe(token) {
    const response = await fetch('/api/auth/me', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user data');
    }

    return await response.json();
}

export async function logoutUser() {
    const token = localStorage.getItem('token');
    if (token) {
        await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
    }
}

// CRUD API functions for Movies
export async function fetchMoviesAdmin({ page = 1, perPage = 20, search = '', genreId = '', status = '' } = {}) {
    const params = new URLSearchParams();
    params.set('page', page);
    params.set('per_page', perPage);
    if (search) params.set('search', search);
    if (genreId) params.set('genre_id', genreId);
    // Only add status param if it's not empty, so backend shows all movies when no filter
    if (status && status.trim() !== '') {
        params.set('status', status);
    }

    const token = localStorage.getItem('token');
    const res = await fetch(`/api/movies?${params.toString()}`, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
    });
    if (!res.ok) throw new Error(`Failed to fetch movies: ${res.status}`);
    return await res.json();
}

export async function createMovie(movieData, isFormData = false) {
    const token = localStorage.getItem('token');
    const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    
    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    const res = await fetch('/api/movies', {
        method: 'POST',
        headers,
        body: isFormData ? movieData : JSON.stringify(movieData)
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create movie');
    }
    return await res.json();
}

export async function updateMovie(id, movieData, isFormData = false) {
    const token = localStorage.getItem('token');
    const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    
    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(`/api/movies/${id}`, {
        method: 'PUT',
        headers,
        body: isFormData ? movieData : JSON.stringify(movieData)
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to update movie');
    }
    return await res.json();
}

export async function deleteMovie(id) {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/movies/${id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to delete movie');
    }
    return await res.json();
}

// CRUD API functions for Genres
export async function fetchGenresAdmin({ page = 1, perPage = 20, search = '' } = {}) {
    const params = new URLSearchParams();
    // Note: Genres API doesn't support pagination, so we'll fetch all and handle pagination client-side
    if (search) params.set('search', search);

    const token = localStorage.getItem('token');
    const res = await fetch(`/api/genres${params.toString() ? `?${params.toString()}` : ''}`, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
    });
    if (!res.ok) throw new Error(`Failed to fetch genres: ${res.status}`);

    const data = await res.json();
    console.log('Raw genres data:', data);

    // Since genres API returns array directly, we need to simulate pagination
    const allGenres = Array.isArray(data) ? data : [];

    // Apply search filter if provided
    const filteredGenres = search
        ? allGenres.filter(genre =>
            genre.name.toLowerCase().includes(search.toLowerCase()) ||
            (genre.description && genre.description.toLowerCase().includes(search.toLowerCase()))
        )
        : allGenres;

    // Calculate pagination
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedGenres = filteredGenres.slice(startIndex, endIndex);

    // Return in expected format
    return {
        data: paginatedGenres,
        current_page: page,
        last_page: Math.ceil(filteredGenres.length / perPage),
        per_page: perPage,
        total: filteredGenres.length,
        from: startIndex + 1,
        to: Math.min(endIndex, filteredGenres.length)
    };
}

export async function createGenre(genreData) {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/genres', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(genreData)
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create genre');
    }
    return await res.json();
}

export async function updateGenre(id, genreData) {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/genres/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(genreData)
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to update genre');
    }
    return await res.json();
}

export async function deleteGenre(id) {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/genres/${id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to delete genre');
    }
    return await res.json();
}

// CRUD API functions for Actors
export async function fetchActorsAdmin({ page = 1, perPage = 20, search = '' } = {}) {
    const params = new URLSearchParams();
    params.set('page', page);
    params.set('per_page', perPage);
    if (search) params.set('search', search);

    const token = localStorage.getItem('token');
    const res = await fetch(`/api/actors?${params.toString()}`, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
    });
    if (!res.ok) throw new Error(`Failed to fetch actors: ${res.status}`);
    return await res.json();
}

export async function createActor(actorData, isFormData = false) {
    const token = localStorage.getItem('token');
    const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    
    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    const res = await fetch('/api/actors', {
        method: 'POST',
        headers,
        body: isFormData ? actorData : JSON.stringify(actorData)
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create actor');
    }
    return await res.json();
}

export async function updateActor(id, actorData, isFormData = false) {
    const token = localStorage.getItem('token');
    const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    
    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(`/api/actors/${id}`, {
        method: 'PUT',
        headers,
        body: isFormData ? actorData : JSON.stringify(actorData)
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to update actor');
    }
    return await res.json();
}

export async function deleteActor(id) {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/actors/${id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to delete actor');
    }
    return await res.json();
}

// CRUD API functions for Episodes
export async function fetchEpisodesAdmin({ page = 1, perPage = 20, search = '', movieId = '' } = {}) {
    const params = new URLSearchParams();
    params.set('page', page);
    params.set('per_page', perPage);
    if (search) params.set('search', search);
    if (movieId) params.set('movie_id', movieId);

    const token = localStorage.getItem('token');
    const res = await fetch(`/api/episodes?${params.toString()}`, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
    });
    if (!res.ok) throw new Error(`Failed to fetch episodes: ${res.status}`);
    return await res.json();
}

export async function createEpisode(episodeData) {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/episodes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(episodeData)
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create episode');
    }
    return await res.json();
}

export async function updateEpisode(id, episodeData) {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/episodes/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(episodeData)
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to update episode');
    }
    return await res.json();
}

export async function deleteEpisode(id) {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/episodes/${id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to delete episode');
    }
    return await res.json();
}

// CRUD API functions for Movie Casts
export async function fetchMovieCastsAdmin({ page = 1, perPage = 20, search = '', movieId = '', actorId = '' } = {}) {
    const params = new URLSearchParams();
    params.set('page', page);
    params.set('per_page', perPage);
    if (search) params.set('search', search);
    if (movieId) params.set('movie_id', movieId);
    if (actorId) params.set('actor_id', actorId);

    const token = localStorage.getItem('token');
    const res = await fetch(`/api/movie-casts?${params.toString()}`, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
    });
    if (!res.ok) throw new Error(`Failed to fetch movie casts: ${res.status}`);
    return await res.json();
}

export async function createMovieCast(movieCastData) {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/movie-casts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(movieCastData)
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create movie cast');
    }
    return await res.json();
}

export async function updateMovieCast(movieId, actorId, movieCastData) {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/movie-casts/${movieId}/${actorId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(movieCastData)
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to update movie cast');
    }
    return await res.json();
}

export async function deleteMovieCast(movieId, actorId) {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/movie-casts/${movieId}/${actorId}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to delete movie cast');
    }
    return await res.json();
}


