const API_URL = 'https://localhost:44352';
const LOGIN_URL = `${API_URL}/login`;
const REGISTER_URL = `${API_URL}/register`;

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const token = await login(email, password);
        localStorage.setItem('token', token);
        localStorage.setItem('email', email);
        displayLoginMessage(email);
        showLogoutButton();
    }
    catch (error) {
        console.log(error);
        document.getElementById('output').textContent = error.message;
    }
});

document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        const email = document.getElementById('email-register').value;
        const password = document.getElementById('password-register').value;
        await register(email, password);
        document.getElementById('output').textContent = 'Registration successful. Please log in.';
    } catch (error) {
        console.log(error);
        document.getElementById('output').textContent = error.message;
    }
});


async function login(email, password) {
    const response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
    } else {
        
        const data = await response.json();
        return data.accessToken;
    }
}

async function register(email, password) {
    const response = await fetch(REGISTER_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password }),
    });

    if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
    }

    document.getElementById('output').textContent = "Registration successful. Please log in.";
}



function displayLoginMessage(email) {
    document.getElementById('output').textContent = `Du är inloggad med e-postadressen: ${email}`;
}

function showLogoutButton() {
    const logoutButton = document.createElement('button');
    logoutButton.textContent = 'Logga ut';
    logoutButton.id = 'logout-button';
    document.body.appendChild(logoutButton);

    logoutButton.addEventListener('click', () => {
        logout();
    });
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    document.getElementById('output').textContent = 'Du är utloggad.';
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.remove();
    }
}

// Kontrollera inloggningstillstånd vid sidladdning
window.addEventListener('load', () => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    if (token && email) {
        displayLoginMessage(email);
        showLogoutButton();
    }
});





/*The API url:s :

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
*/