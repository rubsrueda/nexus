//supabaseClient.js

// Importa la función desde la CDN de Supabase
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// --- ¡IMPORTANTE! Reemplaza con tus propias claves ---
const SUPABASE_URL = 'https://tbnwsuilyusmerkewlmx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRibndzdWlseXVzbWVya2V3bG14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NTU2NTgsImV4cCI6MjA2NTUzMTY1OH0.LwdLH1KHU2a-gbTKGpKHrK3sbWsKqDaxeNs00OfUODQ';
// ----------------------------------------------------

// Crea y exporta el cliente de Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);