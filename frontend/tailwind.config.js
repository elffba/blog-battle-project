/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {}, // Burayı değiştirmene gerek yok şimdilik
    },
    // --- Eklentiler Dizisine daisyui ekle ---
    plugins: [
      require('daisyui'), // <--- Bu satırı ekle
      require('@tailwindcss/line-clamp'), // <--- Bunu ekle

    ],
    // --- DaisyUI için isteğe bağlı tema ayarları ---
    daisyui: {
      themes: ["light", "dark"], // Kullanmak istediğin temaları buraya ekleyebilirsin (örn: "light", "dark", "cupcake", "synthwave" vb.)
                                // Varsayılan olarak birçok tema gelir. Şimdilik light ve dark yeterli.
    },
  }