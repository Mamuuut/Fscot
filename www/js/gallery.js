/**
 * @author Mathieu Delaunay
 */

define( [ "locale" ], function( LocaleManager )
{   
    function Gallery( path, imgDef ) 
    {
        var that = this;

        $( "#gallery" ).bind( "selected", function()
        {
            var galeryDiv = $( this );
            galeryDiv.empty();
            $.each( imgDef, function( _, album )
            {
                var title = $( '<h2 i18n="' + album.title + '"></h2>' );
                galeryDiv.append( title );  
                $.each( album.img, function( _, img )
                {
                    var thumbnail = $( '<div class="gallery-item"></div>' );
                    thumbnail.css( 'background-image', 'url(' + path + "thumbs/" + img + ')' );
                    thumbnail.click( function() {
                        that.showFullImage( path + img );
                    } );
                    galeryDiv.append( thumbnail );
                } );  
                galeryDiv.append( '<div style="clear:both;"></div>' );  
            } );
            LocaleManager.updateLocale( galeryDiv );       
        } );  
    };
    
    Gallery.prototype.showFullImage = function( image )
    {
        var container = $( '<div class="full-img-container"></div>' );
        var img = $( '<img class="full-img" src="' + image + '" width="400"/>' );
        container.append( img );
        
        var closeButton = $( '<button class="close-button" i18n="tab.gallery.close"/>' );
        container.append( closeButton );
        
        container.click( function() {
            container.remove();
        } );
        
        $( 'body' ).append( container );
        LocaleManager.updateLocale( container );      
    };
    
    return Gallery;
} );