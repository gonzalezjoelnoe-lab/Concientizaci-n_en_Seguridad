// ============================================
// CONFIGURACIÓN DE SUPABASE
// Reemplaza estos dos valores con los de TU proyecto
// (Supabase > Project Settings > API)
// ============================================
const SUPABASE_URL = "https://sizgktvthrvijrpzqjve.supabase.co";       // ej: https://xxxxxxxx.supabase.co
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpemdrdHZ0aHJ2aWpycHpxanZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUxMDgzMTAsImV4cCI6MjExMDY4NDMxMH0.17iIA4CeWgpOuvZ-cKFzBTnD_N_ljTfQzstYA0_zwPY";          // la "anon public" key

const { createClient } = supabase;
const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const contadorEl = document.getElementById("contador-valor");

// Evita que una misma pestaña/sesión sume más de una visita
// (si prefieres contar cada recarga, borra este bloque de abajo
// y llama directamente a incrementarContador()).
const YA_CONTADO_KEY = "concientizacion_ya_contado";

async function incrementarContador() {
  const { data, error } = await client.rpc("incrementar_contador");
  if (error) {
    console.error("Error al incrementar el contador:", error);
    contadorEl.textContent = "—";
    return;
  }
  contadorEl.textContent = data;
}

async function soloMostrarContador() {
  const { data, error } = await client
    .from("contador")
    .select("conteo")
    .eq("id", 1)
    .single();

  if (error) {
    console.error("Error al leer el contador:", error);
    contadorEl.textContent = "—";
    return;
  }
  contadorEl.textContent = data.conteo;
}

document.addEventListener("DOMContentLoaded", () => {
  if (sessionStorage.getItem(YA_CONTADO_KEY)) {
    // Esta sesión ya fue contada: solo mostramos el número actual
    soloMostrarContador();
  } else {
    sessionStorage.setItem(YA_CONTADO_KEY, "1");
    incrementarContador();
  }
});
