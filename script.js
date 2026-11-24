// ============================================
// CONFIGURACIÓN DE SUPABASE
// Reemplaza estos dos valores con los de TU proyecto
// (Supabase > Project Settings > API)
// ============================================
const SUPABASE_URL = "TU_URL_DE_SUPABASE_AQUI";       // ej: https://xxxxxxxx.supabase.co
const SUPABASE_ANON_KEY = "TU_ANON_KEY_AQUI";          // la "anon public" key

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
