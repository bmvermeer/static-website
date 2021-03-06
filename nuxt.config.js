import routes from './util/build/routes';
import whitelist from './util/build/whitelist';
import staticFiles from './util/build/static';
import images from './util/build/images';
import fonts from './util/build/fonts';

export default {
    mode: 'universal',
    /*
    ** Headers of the page
    */
    head: {
        htmlAttrs: { lang: 'en' },
        title: 'cdnjs',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },

            { name: 'mobile-web-app-capable', content: 'yes' },
            { name: 'apple-mobile-web-app-capable', content: 'yes' },
            { name: 'theme-color', content: '#d9643a' },

            { hid: 'title', name: 'title', content: 'cdnjs' },
            { hid: 'description', name: 'description', content: 'cdnjs' },

            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:site', content: '@cdnjs' },
            { name: 'twitter:creator', content: '@MattIPv4' },
            { hid: 'twitter:title', name: 'twitter:title', content: 'cdnjs' },
            { hid: 'twitter:description', name: 'twitter:description', content: 'cdnjs' },
            { name: 'twitter:image', content: 'https://cdnjs.dev/banner.png' },
            { name: 'twitter:image:alt', content: 'cdnjs banner image' },
            { name: 'twitter:url', content: 'https://cdnjs.dev' },

            { name: 'canonicalURL', content: 'https://cdnjs.dev' },

            { hid: 'og:title', prefix: 'og: http://ogp.me/ns#', property: 'og:title', content: 'cdnjs' },
            { prefix: 'og: http://ogp.me/ns#', property: 'og:type', content: 'website' },
            { prefix: 'og: http://ogp.me/ns#', property: 'og:locale', content: 'en_GB' },
            { prefix: 'og: http://ogp.me/ns#', property: 'og:site_name', content: 'cdnjs' },
            {
                hid: 'og:description',
                prefix: 'og: http://ogp.me/ns#',
                property: 'og:description',
                content: 'cdnjs'
            },
            { prefix: 'og: http://ogp.me/ns#', property: 'og:url', content: 'https://cdnjs.dev' },
            { prefix: 'og: http://ogp.me/ns#', property: 'og:image', content: 'https://cdnjs.dev/banner.png' },
            { prefix: 'og: http://ogp.me/ns#', property: 'og:image:url', content: 'https://cdnjs.dev/banner.png' },
        ],
        link: [
            { rel: 'icon', type: 'image/png', href: '/favicon.png' },
            { rel: 'shortcut-icon', type: 'image/png', href: '/favicon.png' },
            { rel: 'apple-touch-icon', type: 'image/png', href: '/favicon.png' },
            { rel: 'canonical', href: 'https://cdnjs.dev' },
        ]
    },
    /*
    ** Customize the progress-bar color
    */
    loading: { color: '#d9643a' },
    /*
    ** Set a transition for pages to avoid classes switching too early etc.
    */
    pageTransition: {
        name: 'page',
        mode: 'out-in',
        beforeLeave (el) {
            this.$emit('beforeLeave', el);
        },
        afterLeave (el) {
            this.$emit('afterLeave', el);
        },
        beforeEnter (el) {
            this.$emit('beforeEnter', el);
        },
        afterEnter (el) {
            this.$emit('afterEnter', el);
        },
    },
    /*
    ** Load in our styling for the entire app
    */
    css: [
        '~/assets/scss/style.scss',
    ],
    /*
    ** Load in plugins before the app starts
    */
    plugins: [
        '~/plugins/vue-clipboard2.js',
    ],
    /*
    ** Load in modules that we're using in the app
    */
    modules: [
        // FIXME: Sitemap seems to cause OOM on Heroku
        //'@nuxtjs/sitemap',
        '@nuxtjs/svg',
    ],
    /*
    ** Configure the sitemap and let it know about all the dynamic routes
    */
    sitemap: {
        gzip: true,
        hostname: process.env.SITE_HOST || undefined,
        cacheTime: 60 * 60 * 1000,
        async routes() {
            const urls = [
                {
                    url: '/',
                    priority: 1,
                },
                {
                    url: '/libraries',
                    priority: 0.9,
                },
                {
                    url: '/about',
                    priority: 0.8,
                },
                {
                    url: '/api',
                    priority: 0.8,
                },
                {
                    url: '/sponsor',
                    priority: 0.7,
                },
            ];

            // FIXME: This is awfully slow to load on demand
            // Maybe instead of using this module we run a custom Express server and generate this in the background
            urls.push(...(await routes()));

            return urls;
        },
    },
    /*
    ** Configure the router to not use trailing slashes and to handle our custom routing
    */
    router: {
        trailingSlash: false,
        extendRoutes (routes, resolve) {
            routes.push({
                name: 'libraries-library-version',
                path: '/libraries/:library/:version?',
                component: resolve(__dirname, 'pages/libraries/_library/index.vue'),
            });
        },
    },
    /*
    ** Customise our build process to handle additions we've made
    */
    build: {
        transpile: ['vue-instantsearch'],
        html: {
            minify: {
                collapseBooleanAttributes: true, // Default
                decodeEntities: true, // Default
                minifyCSS: true, // Default
                minifyJS: true, // Default
                processConditionalComments: true, // Default
                removeEmptyAttributes: true, // Default
                removeRedundantAttributes: true, // Default
                trimCustomFragments: true, // Default
                useShortDoctype: true, // Default
                removeComments: true, // Custom
            },
        },
        publicPath: '/_/',
    },
    buildModules: [
        [
            '@nuxtjs/google-analytics',
            {
                id: 'UA-139601399-3',
            },
        ],
    ],
    /*
    ** Use hooks to apply any optimizations to the final generated bundle
    */
    hooks: {
        build: {
            async before (builder) {
                await whitelist(builder);
            },
            async done (builder) {
                await staticFiles(builder);
                await images(builder);
                await fonts(builder);
            },
        },
    },
    /*
    ** Disable graceful 404 handling by serve-placeholder, which breaks libraries with exts in their names (animate.css)
    */
    render: {
        fallback: false,
    },
};
