/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');
const rotateX = plugin(function ({ addUtilities }) {
    addUtilities({
        '.rotate-y-180': {
            transform: 'rotateY(180deg)',
        },
    });
});
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx}', 
        './components/**/*.{js,ts,jsx,tsx}',
        './modals/**/*.{js,ts,jsx,tsx,mdx}',
        './panels/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        container: {
            center: true,
            padding: '1rem',
        },
        screens: {
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1142px',
        },
        fontFamily: {
            mulish: ['Mulish', 'sans-serif'],
            reey: ['reey', 'sans-serif'],
        },
        colors: {
            transparent: 'transparent',
            current: 'currentColor',
            white: '#ffffff',
            black: '#08111F',
            primary: '#47BDFF',
            secondary: '#1e2939',
            gray: {
                DEFAULT: '#7780A1',
                dark: '#1C2331',
            },
        },
        extend: {
            animation: {
                'spin-slow': 'spin 5s linear infinite',
                'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
                'fade-in-right': 'fadeInRight 0.8s ease-out 0.3s forwards',
                'slide-in-tab': 'slideInTab 0.4s ease-out forwards',
                'slide-in-right': 'slideInRight 0.6s ease-out 0.2s forwards',
                'pulse-slow': 'pulseSubtle 3s ease-in-out infinite',
                'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
                'gradient-shift': 'gradientShift 3s ease infinite',
                'border-glow': 'borderGlow 2s ease-in-out infinite',
                'skeleton': 'skeleton 1.2s ease-in-out infinite',
                'text-glow': 'textGlow 3s ease-in-out infinite',
                'word-slide-in': 'wordSlideIn 0.8s ease-out forwards',
                'letter-spacing': 'letterSpacing 4s ease-in-out infinite',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeInRight: {
                    '0%': { opacity: '0', transform: 'translateX(30px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                slideInTab: {
                    '0%': { opacity: '0', transform: 'translateY(10px) scale(0.95)' },
                    '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
                },
                slideInRight: {
                    '0%': { opacity: '0', transform: 'translateX(30px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                pulseSubtle: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.8' },
                },
                bounceSubtle: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-2px)' },
                },
                gradientShift: {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                },
                borderGlow: {
                    '0%, 100%': { 
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 0 10px rgba(255, 255, 255, 0.2)'
                    },
                    '50%': { 
                        borderColor: 'rgba(255, 255, 255, 0.6)',
                        boxShadow: '0 0 20px rgba(255, 255, 255, 0.4)'
                    },
                },
                skeleton: {
                    '0%': { backgroundPosition: '-200px 0' },
                    '100%': { backgroundPosition: 'calc(200px + 100%) 0' },
                },
                textGlow: {
                    '0%, 100%': { textShadow: '0 0 5px rgba(71, 189, 255, 0.3)' },
                    '50%': { textShadow: '0 0 15px rgba(71, 189, 255, 0.6), 0 0 25px rgba(71, 189, 255, 0.4)' },
                },
                wordSlideIn: {
                    '0%': { opacity: '0', transform: 'translateX(-10px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                letterSpacing: {
                    '0%, 100%': { letterSpacing: '0.05em' },
                    '50%': { letterSpacing: '0.1em' },
                },
            },
            typography: ({ theme }) => ({
                DEFAULT: {
                    css: {
                        color: theme('colors.gray'),
                        fontSize: '1.125rem',
                    },
                },
            }),
        },
    },
    plugins: [require('@tailwindcss/line-clamp'), rotateX, require('@tailwindcss/typography')],
};
