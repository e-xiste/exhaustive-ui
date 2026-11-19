import ExhaustiveUiTailwind from '@exhaustive-ui/tailwindcss';

/** @type {import('tailwindcss').Config} */
export default {
    content: ['index.html'],
    theme: {
        extend: {
            colors: {}
        }
    },
    plugins: [ExhaustiveUiTailwind]
};
