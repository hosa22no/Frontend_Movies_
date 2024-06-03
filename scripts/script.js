// The API url:s :

const API_URL = 'https://localhost:44352';
const LOGIN_URL = `${API_URL}/login`;
const REGISTER_URL = `${API_URL}/register`;

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const token = await login(email, password);
        await fetchAndDisplayMovies(token);
    }
    catch (error) {
        console.log(error)
        document.getElementById('output').textContent = error.message;

    }
})

async function login(email, password) {
    const response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
        const data = await response.json();
        return data.accessToken;
    } else {
        const { message } = await response.json();
        throw new Error(message);
    }
}


// Movies URL:s
const MOVIES_URL = `${API_URL}/api/Movie`;

async function fetchAndDisplayMovies(token) {
    const response = await fetch(MOVIES_URL, {
        headers: {
            Authorization: `Bearer ${token}`	
        }
    });

    if (!response.ok) {
        throw new Error('Failed to load movies');
    }

    const movies = await response.json();
    document.getElementById('output').textContent = JSON.stringify(movies);
}
