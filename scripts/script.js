// Fetchin login and registration data from the API
const API_URL = 'https://localhost:44352';
const LOGIN_URL = `${API_URL}/login`;
const REGISTER_URL = `${API_URL}/register`;


// Event listeners for login and registration forms
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    if (localStorage.getItem('token')) {
        document.getElementById('output').textContent = 'En användare är redan inloggad. Logga ut först.';
        return;
    }

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

// Login and registration functions
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

    document.getElementById('output').textContent = "Registrering lyckades. Nu kan du logga in.";
}



function displayLoginMessage(email) {
    document.getElementById('output').textContent = `Du är inloggad med e-postadressen: ${email}`;
}

// When logged in, show logout button
function showLogoutButton() {
    const logoutButton = document.createElement('button');
    logoutButton.textContent = 'Logga ut';
    logoutButton.id = 'logout-button';
   
    const logoutDiv = document.getElementById('logout'); 
    logoutDiv.appendChild(logoutButton);
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

// Check if user is already logged in
window.addEventListener('load', () => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    if (token && email) {
        displayLoginMessage(email);
        showLogoutButton();
    }
});

