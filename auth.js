import { supabase } from './supabaseClient.js';

const loginForm = document.getElementById('login-form');
const googleLoginBtn = document.getElementById('google-login-btn');
const errorMessage = document.getElementById('error-message');

// --- Redireccionar si el usuario ya está logueado ---
// Esta es una buena práctica para evitar que vean el login si ya tienen una sesión activa.
supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
        window.location.href = '/dashboard.html';
    }
});

// --- Manejar el inicio de sesión con Email y Contraseña ---
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            throw error;
        }
        // La redirección ocurrirá automáticamente gracias a onAuthStateChange
    } catch (error) {
        errorMessage.textContent = 'Error: ' + error.message;
    }
});

// --- Manejar el inicio de sesión con Google ---
googleLoginBtn.addEventListener('click', async () => {
    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
        });
        if (error) throw error;
    } catch (error) {
        errorMessage.textContent = 'Error al iniciar con Google: ' + error.message;
    }
});