/**
 * Tailwind CSS configuration file
 *
 * docs: https://tailwindcss.com/docs/configuration
 * default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
const path = require('path')

module.exports = {
  theme: {
    extend: {
      inset: {
        '-2/5': '-40%',
        '-9/20': '-45%'
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          '"Segoe UI"',
          'sans-serif'
        ]
      },
      fontSize: {
        'xxs': '.65rem'
      },
      width: {
        '3/10': '30%',
        '3/2': '150%',
        '9/20': '45%'
      },
      minHeight: {
        '12.5': '12.5rem',
        '25': '25rem',
        '50': '50rem'
      },

    },
    container: {
      center: true,
      padding: '1rem'
    }
  },
  variants: {},
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
  purge: {
    // learn more on https://tailwindcss.com/docs/controlling-file-size/#removing-unused-css
    enabled: process.env.NODE_ENV === 'production',
    content: [
      path.resolve(__dirname, '**/*.{js,vue}'),
      path.resolve(__dirname, '../shopify/**/*.liquid')
    ],
    options: {
      whitelist: ['px-8', 'px-12', 'pt-16', 'xl:pt-8', 'border-l', 'border-r-0', 'border-none', 'border-solid', 'lg:mt-0', 'lg:mb-4', 'mt-16', 'lg:mt-20', 'max-w-xs', 'lg:infline-block', 'hover:bg-green-800', 'hover:bg-opacity-25', 'z-10', 'pb-80', 'pb-40', 'max-w-6xl', 'rounded-full', 'relative', 'absolute'],
      safelist: {
       deep: [/pb-/, /pr-/, /pt-/, /pl-/, /p-/, /m-/, /mt-/, /mb-/, /mr-/, /ml-/, /grid-rows-/, /grid-cols-/, /font-/, /row-span*-/, /col-span*-/, /text-(micro|mini|body|kicker|superheading|h[1-5])/, /^w-/, /^h-/, /^p*-/, /^m*-/, /^(sm:|md:|lg:|xl:)w-/, /^(sm:|md:|lg:|xl:)h-/, /^(sm:|md:|lg:|xl:)p*-/, /^(sm:|md:|lg:|xl:)p(\w?)-/, /^(sm:|md:|lg:|xl:)m*-/, /^(sm:|md:|lg:|xl:)m(\w?)-/, /^(sm:|md:|lg:|xl:)border-/, /^font-/, /^md:font-/, /^lg:font-/, /^text-/, /^md:text-/, /^lg:text-/, /^md:datatext-/, /^flex-/, /^flex-col-/, /^flex-row-/, /^(sm:|md:|lg:|xl:)flex-row/, /^(sm:|md:|lg:|xl:)flex-col/, /^items-/, /^justify-/, /^-translate-/, /^left-/],
     } 
    }, 
  }
}
