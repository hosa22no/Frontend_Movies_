const API_URL = 'https://localhost:44352';
const MOVIES_URL = `${API_URL}/api/Movie`;

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const outputElement = document.getElementById('output');

   

    document.getElementById('add-movie-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('add-title').value;
        const releaseYear = document.getElementById('add-year').value;
        const description = document.getElementById('add-description').value;
        await addMovie(token, { title, releaseYear, description });
    });

    document.getElementById('get-movie-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('get-id').value;
        await getMovie(token, id);
    });

    document.getElementById('get-all-movies-button').addEventListener('click', async () => {
        await getAllMovies(token);
    });

    document.getElementById('update-movie-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('update-id').value;
        const title = document.getElementById('update-title').value;
        const releaseYear = document.getElementById('update-year').value;
        const description = document.getElementById('update-description').value;
        await updateMovie(token, id, { title, releaseYear, description });
    });

    document.getElementById('delete-movie-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('delete-id').value;
        await deleteMovie(token, id);
    });
});

async function addMovie(token, movie) {
    try {
        const response = await fetch(MOVIES_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(movie)
        });

        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.message || 'Failed to add movie.');
        }

        const result = await response.json();
        console.log('Movie added:', result);
        displayMovies([result]); // Display the added movie
    } catch (error) {
        console.log('Error adding movie:', error);
        document.getElementById('output').textContent = error.message;
    }
}
async function getMovie(token, id) {
    try {
        const response = await fetch(`${MOVIES_URL}/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.message || 'Failed to get movie.');
        }

        const result = await response.json();
        displayMovies([result]); // Display the fetched movie in a list format
    } catch (error) {
        console.log('Error getting movie:', error);
        document.getElementById('output').textContent = error.message;
    }
}
/*async function getMovie(token, id) {
    const response = await fetch(`${MOVIES_URL}/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const result = await response.json();
    document.getElementById('output').textContent = JSON.stringify(result, null, 2);
}*/

async function getAllMovies(token) {
    const response = await fetch(MOVIES_URL, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const movies = await response.json();
    displayMovies(movies);
}
function displayMovies(movies) {
    const outputElement = document.getElementById('output');
    outputElement.innerHTML = ''; // Rensa output-elementet först

    if (movies.length === 0) {
        outputElement.textContent = 'No movies found.';
        return;
    }

    const ul = document.createElement('ul');
    movies.forEach(movie => {
        const li = document.createElement('li');
        li.textContent = `ID: ${movie.id}, Title: ${movie.title}, Year: ${movie.releaseYear}, Description: ${movie.description}`;
        ul.appendChild(li);
    });
    outputElement.appendChild(ul);
}


async function updateMovie(token, id, movie) {
    try {
        const response = await fetch(`${MOVIES_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(movie)
        });

        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.message || 'Failed to update movie.');
        }

        const result = await response.json();
        displayMovies([result]); // Display the updated movie in a list format
    } catch (error) {
        console.log('Error updating movie:', error);
        document.getElementById('output').textContent = error.message;
    }
}


async function deleteMovie(token, id) {
    const response = await fetch(`${MOVIES_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (response.ok) {
        document.getElementById('output').textContent = `Movie with ID ${id} has been deleted.`;
    } else {
        const result = await response.json();
        document.getElementById('output').textContent = JSON.stringify(result, null, 2);
    }
}
