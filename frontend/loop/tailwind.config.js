/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                neogen: {
                    primary: '#0a0a0f',
                    secondary: '#1f2937',
                    accent: '#374151',
                    text: '#f3f4f6',
                    muted: '#9ca3af',
                },
                terminal: {
                    green: '#00ff41',
                }
            },
            fontFamily: {
                mono: ['"Space Mono"', 'monospace'],
                display: ['"Arial"', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
