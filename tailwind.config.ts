import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
 darkMode: 'class',
 content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
 theme: {
  extend: {},
 },
 plugins: [
  plugin(function ({ addBase, theme }) {
   addBase({
    h1: { fontSize: '32px', lineHeight: '44.8px' },
    h2: { fontSize: '20px' },
    h3: { fontSize: '18px' },
   });
  }),
 ],
};
export default config;
