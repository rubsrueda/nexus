import { supabase } from './supabaseClient.js';

// --- Variables Globales para la Sesión ---
let currentUserProfile = null; // Almacenará el perfil completo: { id, nombre_completo, rol, ... }

// --- Elementos del DOM ---
const userNameEl = document.getElementById('user-name');
const logoutBtn = document.getElementById('logout-btn');
const tasksContainer = document.getElementById('tasks-container');
const mainContent = document.querySelector('.main-content'); // Contenedor principal para añadir botones

// --- Función Principal de Inicialización ---
async function initializeApp() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
        window.location.href = 'index.html'; // Redirigir si no hay sesión
        return;
    }

    try {
        // Obtenemos el perfil completo del usuario, no solo el nombre
        const { data: profile, error } = await supabase
            .from('usuarios')
            .select('*') // Seleccionamos TODAS las columnas
            .eq('id', session.user.id)
            .single();

        if (error) throw error;
        
        currentUserProfile = profile; // ¡Guardamos el perfil completo!
        
        renderHeader();
        renderUIBasedOnRole(); // <-- NUEVA FUNCIÓN: Dibuja la UI según el rol
        loadUserTasks();

    } catch (err) {
        console.error("Error al inicializar la app:", err);
        alert("No se pudo cargar tu perfil. Contacta a soporte.");
        await supabase.auth.signOut(); // Cerramos sesión si hay un error crítico
    }
}

// --- Renderizar Elementos Comunes ---
function renderHeader() {
    if (!currentUserProfile) return;
    userNameEl.textContent = currentUserProfile.nombre_completo;
}

// --- RENDERIZAR LA INTERFAZ BASADA EN EL ROL (¡LA MAGIA!) ---
function renderUIBasedOnRole() {
    if (!currentUserProfile) return;

    // Limpiamos cualquier botón que pudiera existir de antes
    const existingButtons = document.querySelector('.action-buttons');
    if (existingButtons) existingButtons.remove();

    const actionButtonsContainer = document.createElement('div');
    actionButtonsContainer.className = 'action-buttons';

    // Lógica condicional basada en el rol
    if (currentUserProfile.rol === 'admin' || currentUserProfile.rol === 'pm') {
        const createProjectBtn = document.createElement('button');
        createProjectBtn.className = 'btn-primary';
        createProjectBtn.innerHTML = `<i data-feather="plus"></i> Crear Proyecto`;
        createProjectBtn.onclick = () => alert("Funcionalidad 'Crear Proyecto' en desarrollo.");
        actionButtonsContainer.appendChild(createProjectBtn);

        const createTaskBtn = document.createElement('button');
        createTaskBtn.className = 'btn-secondary';
        createTaskBtn.innerHTML = `<i data-feather="check-square"></i> Crear Tarea`;
        createTaskBtn.onclick = () => alert("Funcionalidad 'Crear Tarea' en desarrollo.");
        actionButtonsContainer.appendChild(createTaskBtn);
    }

    if (currentUserProfile.rol === 'consultor' || currentUserProfile.rol === 'usuario') {
        const createTicketBtn = document.createElement('button');
        createTicketBtn.className = 'btn-primary';
        createTicketBtn.innerHTML = `<i data-feather="tag"></i> Crear Ticket`;
        createTicketBtn.onclick = () => alert("Funcionalidad 'Crear Ticket' en desarrollo.");
        actionButtonsContainer.appendChild(createTicketBtn);
    }
    
    // Insertamos los botones después del h1 del header del main-content
    mainContent.querySelector('header.header').insertAdjacentElement('afterend', actionButtonsContainer);

    // Re-activamos los iconos de Feather
    feather.replace();
}


// --- Cargar las tareas (Sin cambios importantes, pero podría filtrar por rol) ---
async function loadUserTasks() {
    if (!currentUserProfile) return;

    try {
        let query = supabase
            .from('tareas_planificadas')
            .select(`
                id,
                titulo,
                estado,
                porcentaje_completado,
                fecha_fin_planificada,
                proyecto_id ( nombre )
            `)
            .order('fecha_fin_planificada', { ascending: true });

        // Modificamos la consulta según el rol
        if (currentUserProfile.rol === 'consultor' || currentUserProfile.rol === 'usuario') {
            query = query.eq('asignado_a', currentUserProfile.id);
        }
        // Un PM o Admin podría ver todas las tareas, o las de su equipo (lógica más compleja)
        
        const { data: tasks, error } = await query;

        if (error) throw error;
        
        displayTasks(tasks);

    } catch (error) {
        tasksContainer.innerHTML = `<p class="error">Error al cargar las tareas: ${error.message}</p>`;
    }
}

// --- Mostrar las tareas (función sin cambios) ---
function displayTasks(tasks) {
    // ... (la función que ya tienes para mostrar las tarjetas de tareas)
    // ... (la dejo aquí para que el código esté completo)
    if (tasks.length === 0) {
        tasksContainer.innerHTML = '<div class="card"><p>No se encontraron tareas para mostrar.</p></div>';
        return;
    }
    tasksContainer.innerHTML = '';
    tasks.forEach(task => {
        const taskCard = document.createElement('div');
        taskCard.className = 'card task-card';
        const progress = task.porcentaje_completado || 0;
        taskCard.innerHTML = `
            <div class="task-header">
                <h3>${task.titulo}</h3>
                <span class="task-status ${task.estado.replace(/\s+/g, '_').toLowerCase()}">${task.estado}</span>
            </div>
            <div class="task-details">
                <p><i data-feather="briefcase" class="icon"></i> <strong>Proyecto:</strong> ${task.proyecto_id ? task.proyecto_id.nombre : 'N/A'}</p>
                <p><i data-feather="calendar" class="icon"></i> <strong>Vence:</strong> ${task.fecha_fin_planificada || 'Sin fecha'}</p>
            </div>
            <div class="task-progress">
                <div class="progress-bar">
                    <div class="progress-bar-fill" style="width: ${progress}%;"></div>
                </div>
            </div>
        `;
        tasksContainer.appendChild(taskCard);
    });
    feather.replace();
}


// --- Manejar el cierre de sesión ---
logoutBtn.addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = 'index.html';
});

// --- Iniciar la aplicación ---
initializeApp();