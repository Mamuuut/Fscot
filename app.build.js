({
    appDir: 'www',
    baseUrl: 'js',
    paths: {
        jquery: "libs/require-jquery",
        jqueryui: 'libs/jquery-ui-1.8.24.custom.min',
        jqueryi18n: 'libs/jquery.i18n.properties',
        jqueryextends: 'libs/jquery.extends'
    },
    dir: 'www-built',
    modules: [
        {
            name: "main"
        }
    ]
})
