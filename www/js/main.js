/**
 * @author Mathieu Delaunay
 */

require.config( {
    paths: {
        jquery: "libs/require-jquery",
	    jqueryui: 'libs/jquery-ui-1.8.24.custom.min',
	    jqueryi18n: 'libs/jquery.i18n.properties',
	    jqueryextends: 'libs/jquery.extends'
    }
} );

var booking;

require( [ 
	"analytics", 
	"rates", 
	"booking",
    "gallery",
    "locale",
    "jqueryextends"
], function( Analytics, Rates, Booking, Gallery, LocaleManager )
{    
	$( function()
	{   
	    /* Analytics */
	    Analytics.initialize( 'UA-35258729-1' );
	    
	    /* Rates tables generation */
	    var rates = new Rates();
	    
        /* Booking form */
        booking = new Booking();
        
       /* Gallery */
        var path = "./img/photos/"
        var imgDef = [
            {
                title: "tab.gallery.cab",
                img: [ 
                    "caravelle_01.jpg",
                    "caravelle_02.jpg",
                    "caravelle_03.jpg",
                    "caravelle_04.jpg"
                ]
            }    
        ];
        var gallery = new Gallery( path, imgDef );
	    
	    $( ".header" ).click( function()
	    {
            $( "#nav li[data-tab=home]" ).click();
	    } );
	    
	    /* Navigation */
	    function selectTab( tab )
	    {
	        // Check if tab exists and use "home" default tab if not
	        if( 0 == $( "#nav li[data-tab=" + tab + "]" ).length )
	        {
	            tab = "home";
	        }
            $( "#nav li" ).removeClass( "selected" );
            $( "#nav li[data-tab=" + tab + "]" ).addClass( "selected" );
             
            $( ".tab_content" ).hide();
            $( "#" + tab ).show();
            $( "#" + tab ).trigger( "selected" );
	    }
	    
		$( "#nav li" ).click( function()
		{	
			var tab = $( this ).data( "tab" );
            selectTab( tab );
            booking.showContent( "#form" );
			
			Analytics.trackEvent( "Navigation", "Tab_Click", tab );
		} );
		
		$( ".photo" ).click( function()
		{
            selectTab( 'book' );
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
            var tab = $.getUrlVar( "tab" ) || "home";
            selectTab( tab );
            Analytics.trackEvent( "Navigation", "Start", tab );
        }
	} );
} );
