/**
 * @author Mathieu Delaunay
 *
 * LocaleManager
 * - locale selector must have lang data =[en,fr,de,...]
 */

define( [
    'jquery',
    'loading',

    'i18n/main_en',
    'i18n/main_fr',
    'i18n/main_de',

    'bootstrap-datepicker',
    'bootstrap-datepicker.de',
    'bootstrap-datepicker.fr'

], function( $, Loading, propertiesEn, propertiesFr, propertiesDe )
{
    var _instance = null;
    var _locale = '';

    var PROPERTIES = {
        'en': propertiesEn,
        'fr': propertiesFr,
        'de': propertiesDe
    }

    function LocaleManager()
    {
        if( _instance !== null )
        {
            throw new Error("Cannot instantiate more than one LocaleManager, use Loading.getInstance()");
        }
    };

    /**
     * @return the browser locale 2 first characters
     */
    LocaleManager.prototype.getBrowserLocale = function()
    {
        var locale = navigator.language /* Mozilla */ || navigator.userLanguage /* IE */;
        return locale.substr( 0, 2 ).toLowerCase();
    };

    /**
     * set the lang btn click events
     * initialize the locale with the browser locale
     */
    LocaleManager.prototype.initialize = function( urlLocale )
    {
        var localeManager = this;

        $( ".lang-btn" ).click( function()
        {
            $( ".lang-btn" ).removeClass( "selected" );
            $( this ).addClass( "selected" );
            var locale = $( this ).data( "lang" );
            localeManager.setLocale( locale );
        } );

        var locale = urlLocale || this.getBrowserLocale();
        var selector = $( ".lang-btn[data-lang='" + locale + "']" );
        if( 0 == selector.length )
        {
            $( ".lang-btn" ).first().click();
        } else {
            selector.click();
        }
    };

    /**
     * Return the current locale
     */
    LocaleManager.prototype.getLocale = function()
    {
        return _locale;
    }

    /**
     * Update tag html content with i18n attriute according to the locale.
     * Update the jQuery datepickers format according to the locale
     * @param locale
     * @param parent
     */
    LocaleManager.prototype.setLocale = function( locale, parent )
    {
        Loading.start();
        _locale = locale;
        var properties = PROPERTIES[locale];

        $( "[data-i18n]", parent ).each( function()
        {
            var key = $( this ).data( "i18n" );
            $( this ).html( properties[key] );
        } );

        $( '.datepicker' ).datepicker({
            language: locale
        });

        Loading.stop();
    };

    /**
     * Update tag html content with i18n attriute according to the current locale.
     */
    LocaleManager.prototype.updateLocale = function( parent )
    {
        this.setLocale( _locale, parent );
    };

    /**
     * @return the LocaleManager singleton _instance
     */
    LocaleManager.getInstance = function()
    {
        {
            if( _instance === null ){
                _instance = new LocaleManager();
            }
            return _instance;
        }
    };

    return LocaleManager.getInstance();
} );