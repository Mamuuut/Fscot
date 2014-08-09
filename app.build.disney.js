({
    appDir: 'www-disney',
    baseUrl: 'js',

    paths: {
        'jquery'            : "libs/jquery-1.11.1.min",
        'jquery-migrate'    : "libs/jquery-migrate-1.2.1.min",
        'jqueryextends'     : 'libs/jquery.extends',
        'jquery-hashchange' : 'libs/jquery.ba-hashchange.min',
        'bootstrap'         : 'libs/bootstrap.min',

        'bootstrap-datepicker'      : 'libs/bootstrap-datepicker',
        'bootstrap-datepicker.de'   : 'libs/bootstrap-datepicker.de',
        'bootstrap-datepicker.fr'   : 'libs/bootstrap-datepicker.fr'
    },

    shim: {
        'jquery-migrate'            : ['jquery'],
        'jquery-hashchange'         : ['jquery-migrate'],
        'bootstrap'                 : ['jquery'],
        'bootstrap-datepicker'      : ['bootstrap'],
        'bootstrap-datepicker.de'   : ['bootstrap-datepicker'],
        'bootstrap-datepicker.fr'   : ['bootstrap-datepicker']
    },

    dir: 'www-built-disney',
    modules: [
        {
            name: "main"
        }
    ]
})
