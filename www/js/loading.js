/**
 * Loading screen with a rotating spinner.
 * It requires a img/spinner.png texture.
 * Loading is a Singleton.
 * @author Mathieu Delaunay
 */

define( function()
{   
    var instance = null;
    var _timer;
    var _container;    
        
    function Loading()
    {
        if( instance !== null )
        {
            throw new Error("Cannot instantiate more than one Loading, use Loading.getInstance()");
        } 
    }
    
    /**
     * Create the spinner and its container and animate its rotation
     */
    Loading.prototype.start = function()
    {
        _container = $( '<div class="spinner-container"></div>' );
        var img = $( '<img class="spinner" src="img/spinner.png" width="84"/>' );
        _container.append( img );
        
        $( 'body' ).append( _container );
        
        function rotate( degree )
        {
            var cssRotate = 'rotate(' + degree + 'deg )';
            img.css( {
                '-webkit-transform' : cssRotate,
                '-moz-transform' : cssRotate,
                '-o-transform' : cssRotate,
                '-ms-transform' : cssRotate
            } );
            
            _timer = setTimeout( function() {
                degree += 30;
                rotate( degree );
            }, 100 );
        };
        rotate( 0 );
    };
    
    /**
     * Remove the spinner and its container and stop its rotation animation
     */
    Loading.prototype.stop = function( image )
    {
        if( null != _container )
        {
            clearTimeout( _timer );
            _container.remove();
            _container = null;
        } 
    };
        
        
    /**
     * @return the Loading singleton instance
     */    
    Loading.getInstance = function()
    {
        {
            if( instance === null ){
                instance = new Loading();
            }
            return instance;
        }
    };
    
    return Loading.getInstance();
} );