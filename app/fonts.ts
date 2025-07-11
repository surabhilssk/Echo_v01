import localFont from 'next/font/local'

export const myRecoleta = localFont({
    src: [
        {
            path: '../public/fonts/recoleta-regular.woff2',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../public/fonts/recoleta-med-regular.woff2',
            weight: '500',
            style: 'normal',
        },
        {
            path: '../public/fonts/recoleta-semi-bold.woff2',
            weight: '600',
            style: 'normal',
        },
        {
            path: '../public/fonts/recoleta-bold.woff2',
            weight: '700',
            style: 'normal',
        }
    ],
    display: 'swap',
    variable: '--font-my-recoleta'
})