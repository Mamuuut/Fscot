/**
 * @author Mathieu Delaunay
 * 
 * LocaleManager
 * - locale selectors parent div id : langSelector
 * - locale selector must have lang attr=[en,fr,de,...]
 */

define( [ 
    "loading",
    "jqueryi18n",
    "jqueryui"
], function( Loading )
{
    var _instance = null;
    var _locale = '';
        
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
        var locale = $.i18n.browserLang();
        return locale.substr( 0, 2 ).toLowerCase();
    };  

    /**
     * set the langSelector click events
     * initialize the locale with the browser locale 
     */
    LocaleManager.prototype.initialize = function( urlLocale )
    {
        var localeManager = this;
        
        $( "#langSelector div[lang]" ).click( function()
        {
            $( "#langSelector div[lang]" ).removeClass( "selected" );
            $( this ).addClass( "selected" );
            var locale = $( this ).attr( "lang" );  
            localeManager.setLocale( locale );
        } );    
        
        var locale = urlLocale || this.getBrowserLocale();
        var selector = $( "[lang='" + locale + "']" );
        if( 0 == selector.length )
        {
            $( "[lang]" ).click();
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
        var settings = {
            name: 'main',
            path: 'i18n/',
            mode:'both',
            encoding: 'UTF-8',
            language: locale,
            callback: function() {
                $( "[i18n]", parent ).each( function()
                {
                    $( this ).html( $.i18n.prop( $( this ).attr( "i18n" ) ) );
                } );
                var datePickers = $( ".date-picker" );
                if( 0 != datePickers.length )
                {
                    datePickers.datepicker( "option", "dateFormat", $.i18n.prop( 'date.format' ) );
                }                    
            }
        };
        $.i18n.properties( settings );
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
     * Change the jQuery i18n plugin locale without updating the tags content
     */
    LocaleManager.prototype.setTempLocale = function( locale )
    {
        var settings = {
            name: 'main',
            path: 'i18n/',
            mode:'both',
            encoding: 'UTF-8',
            language: locale
        };
        $.i18n.properties( settings );
    };
    
    /**
     * Restore the jQuery i18n plugin locale
     */
    LocaleManager.prototype.restoreLocale = function()
    {
        this.setTempLocale( _locale );
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