import localFont from 'next/font/local'

export const myRecoleta = localFont({
    src: [
        {
            path: '../public/fonts/recoleta-semibold.woff2',
            weight: '600',
            style: 'normal',
        },
    ],
    display: 'swap',
    variable: '--font-my-recoleta'
})