var _gaq = _gaq || [];
    
/**
 * Analytics is a GoogleAnalytics Wrapper Singleton
 * @author Mathieu Delaunay
 */

define( function()
{   
    var instance = null;

    function Analytics()
    {
        if( instance !== null )
        {
            throw new Error("Cannot instantiate more than one Analytics, use Analytics.getInstance()");
        } 
    };

    /**
     * initialize the GoogleAnalytics object with the trackingId
     * @param trackingId
     */
    Analytics.prototype.initialize = function( trackingId )
    {
        _gaq.push( ['_setAccount', trackingId] );
        _gaq.push( ['_trackPageview'] );
        var ga = document.createElement('script');
        ga.type = 'text/javascript';
        ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName( 'script' )[0];
        s.parentNode.insertBefore( ga, s );
    };
    
    /**
     * Track an event
     * @param category
     * @param action
     * @param label
     * @param value
     */
    Analytics.prototype.trackEvent = function( category, action, label, value )
    {
        _gaq.push( ['_trackEvent', category, action, label] );   
    };
        
    /**
     * @return the Analytics singleton instance
     */    
    Analytics.getInstance = function()
    {
        if( instance === null ){
            instance = new Analytics();
        }
        return instance;
    };
    
    return Analytics.getInstance();
} );