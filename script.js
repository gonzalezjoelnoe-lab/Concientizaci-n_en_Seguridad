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
const btnLike = document.getElementById("btn-like");
const mensajeLike = document.getElementById("mensaje-like");

// Se guarda en este navegador para que la misma persona no pueda
// sumar "me gusta" varias veces desde el mismo dispositivo.
const YA_DIO_LIKE_KEY = "concientizacion_ya_dio_like";

// Solo muestra el número actual, sin sumar (se usa al cargar la página)
async function mostrarContador() {
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

// Suma 1 al contador (se usa solo cuando el usuario da clic en el corazón)
async function darLike() {
  const { data, error } = await client.rpc("incrementar_contador");
  if (error) {
    console.error("Error al incrementar el contador:", error);
    return;
  }
  contadorEl.textContent = data;
}

function mostrarEstadoYaDioLike() {
  btnLike.disabled = true;
  btnLike.innerHTML = '<span class="btn-like-icono">❤️</span> ¡Ya diste tu like!';
  mensajeLike.classList.add("visible");
}

btnLike.addEventListener("click", async () => {
  if (localStorage.getItem(YA_DIO_LIKE_KEY)) return;

  btnLike.disabled = true; // evita doble clic mientras responde el servidor
  await darLike();
  localStorage.setItem(YA_DIO_LIKE_KEY, "1");
  mostrarEstadoYaDioLike();
});

document.addEventListener("DOMContentLoaded", () => {
  mostrarContador();
  if (localStorage.getItem(YA_DIO_LIKE_KEY)) {
    mostrarEstadoYaDioLike();
  }

  // Voltear tarjetas al hacer clic o al presionar Enter/Espacio
  document.querySelectorAll(".tarjeta").forEach((tarjeta) => {
    const voltear = () => {
      const volteada = tarjeta.classList.toggle("volteada");
      tarjeta.setAttribute("aria-expanded", volteada ? "true" : "false");
    };

    tarjeta.addEventListener("click", voltear);
    tarjeta.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        voltear();
      }
    });
  });
});
