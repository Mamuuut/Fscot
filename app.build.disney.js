({
    appDir: 'www-disney',
    baseUrl: 'js',

    paths: {
        'jquery'                    : "libs/jquery-1.11.1.min",
        'jquery-migrate'            : "libs/jquery-migrate-1.2.1.min",
        'jqueryextends'             : 'libs/jquery.extends',
        'jquery-hashchange'         : 'libs/jquery.ba-hashchange.min',
        'bootstrap'                 : 'libs/bootstrap.min',
        'moment'                    : 'libs/moment',
        'moment-de'                 : 'libs/moment-de',
        'moment-fr'                 : 'libs/moment-fr',
        'bootstrap-datetimepicker'  : 'libs/bootstrap-datetimepicker.min'
    },

    shim: {
        'jquery-migrate'            : ['jquery'],
        'jquery-hashchange'         : ['jquery-migrate'],
        'bootstrap'                 : ['jquery'],
        'bootstrap-datetimepicker'  : ['bootstrap']
    },

    dir: 'www-built-disney',
    modules: [
        {
            name: "main"
        }
    ]
})
