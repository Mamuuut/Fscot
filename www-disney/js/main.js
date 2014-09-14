/**
 * @author Mathieu Delaunay
 */

console.log('Loaded');

require.config( {
    paths: {
        'jquery'                    : "libs/jquery-1.11.1.min",
        'jquery-migrate'            : "libs/jquery-migrate-1.2.1.min",
        'jqueryextends'             : 'libs/jquery.extends',
        'jquery-hashchange'         : 'libs/jquery.ba-hashchange.min',
        'bootstrap'                 : 'libs/bootstrap.min',
        'moment'                    : 'libs/moment',
        'moment-de'                 : 'libs/moment-de',
        'moment-fr'                 : 'libs/moment-fr',
        'bootstrap-datetimepicker'  : 'libs/bootstrap-datetimepicker.min',
    },

    shim: {
        'jquery-migrate'            : ['jquery'],
        'jquery-hashchange'         : ['jquery-migrate'],
        'bootstrap'                 : ['jquery'],
        'bootstrap-datetimepicker'  : ['bootstrap']
    }
} );

var booking;

require( [
    'jquery',
    'analytics',
    'loading',
    'rates',
    'booking',
    'gallery',
    'locale',
    'bootstrap',
    'jqueryextends',
    'jquery-hashchange'
], function( $, Analytics, Loading, Rates, Booking, Gallery, LocaleManager )
{
    $( function()
    {
        Loading.start();

        /* Analytics */
        Analytics.initialize( 'UA-35258729-1' );

        /* Rates tables generation */
        var rates = new Rates();

        /* Booking form */
        booking = new Booking();

       /* Gallery */
        var gallery = new Gallery();

        /* Navigation */
        function selectTab( tab )
        {
            window.location.hash = tab;
        }

        $(window).hashchange( function()
        {
            var selectedTab = window.location.hash || '#home';

            $( ".nav li" ).removeClass( "active" );
            $( ".nav li[data-tab=" + selectedTab + "]" ).addClass( "active" );

            $( '.tab-content' ).hide();
            $( selectedTab ).show();

            booking.showContent( "#form" );

            Analytics.trackEvent( "Navigation", "Tab_Click", selectedTab );
        });

        $( ".photo" ).click( function()
        {
            selectTab( '#booking' );
            Analytics.trackEvent( "Navigation", "Home_Photo_Click", "book", $( 'img', this ).attr( 'src' ) );
        } );

        /* LocaleManager */
        var urlLocale = $.getUrlVar( 'ul' );
        LocaleManager.initialize( urlLocale );

        /* Booking error init */
        booking.displayError( ".bookFieldDiv", false );

        /* Set tab content according to url parameters */
        var mailResult = $.getUrlVar( 'mr' );
        if( "success" == mailResult )
        {
            selectTab( 'book' );
            booking.showContent( "#book_success" );

            Analytics.trackEvent( "Mail", "Result", "success" );
        } else if( "error" == mailResult ) {
            selectTab( 'book' );
            booking.showContent( "#book_error" );
            Analytics.trackEvent( "Mail", "Result", "error" );
        } else {
            $(window).hashchange();
        }

        /* Resize Event */
        $(window).resize(function()
        {
            var offset = $(window).height() - $('body').outerHeight();
            $('.content').css({
                'min-height': ($('.content').outerHeight() + offset) + 'px'
            });
        });

        $(window).resize();

        $('body').css('visibility', 'visible');
        Loading.stop();

    } );
} );
