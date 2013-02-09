/**
 * @author Mathieu Delaunay
 */

define( function()
{
    var ratesDef = {
        returnRates: {
            cdg: {
                paris: [ 100, 100, 120, 130, 160 ],
                //disney: [ 120, 125, 140, 150, 170 ],
                disney: [ 120, 120, 120, 150, 150 ],
                versailles: [ 150, 150, 160, 170, 190 ]
            },
            orly: {
                paris: [ 95, 100, 110, 120, 140 ],
                disney: [ 130, 130, 135, 145, 160 ],
                versailles: [ 135, 135, 145, 155, 170 ]
            },
            beauvais: {
                paris: [ 230, 230, 230, 260, 260 ],
                disney: [ 240, 240, 240, 270, 270 ]
                //paris: [ 230, 230, 245, 255, 275 ],
                //disney: [ 250, 250, 260, 270, 280 ]
            },
            paris: {
                deauville: 800,
                mont_st_michel: 950
            },
            suburbs: {
                paris: 140
            }
        },        
        oneWayRates: {
            cdg: {
                paris: [ 50, 55, 60, 65, 80 ],
                disney: [ 65, 70, 75, 80, 90 ],
                orly: [ 65, 70, 75, 80, 90 ],
                versailles: [ 80, 80, 85, 85, 100 ]
            },
            orly: {
                paris: [ 50, 55, 60, 65, 80 ],
                disney: [ 65, 65, 70, 75, 90 ],
                versailles: [ 70, 70, 75, 80, 90 ]
            },
            beauvais: {
                paris: [ 115, 120, 125, 130, 140 ],
                disney: [ 125, 125, 135, 145, 155 ]
            },
            disney: {
                paris: [ 65, 70, 75, 80, 90 ]
            },
            paris: {
                visit: "oneWayRates.paris_visit_price",
                deauville: 400,
                mont_st_michel: 500
            }
        }
    };
    
    function Rates() 
    {
        var that = this;
        $.each( ratesDef, function( ratesCode, rates )
        {
            that.createTable( ratesCode, rates );
        } );
    }; 
    
    Rates.prototype.createTable = function( code, rates )
    {
        var table = $( '<table cellspacing="1" width="100%" class="borderOn"></table>' );
        var body = $( '<tbody></tbody>' );
        var titleRow = $( 
            '<tr>' +
                '<th i18n="tab.rates.' + code + '"></th>' +
                '<th i18n="tab.rates.pers_1_3"></th>' +
                '<th i18n="tab.rates.pers_4"></th>' +
                '<th i18n="tab.rates.pers_5"></th>' +
                '<th i18n="tab.rates.pers_6"></th>' +
                '<th i18n="tab.rates.pers_7_8"></th>' +
            '</tr>' );                    
            
        body.append( titleRow );
        
        var that = this;
        $.each( rates, function( from, toRates )
        {
            $.each( toRates, function( to, rowRates )
            {
                that.createRow( body, code, from, to, rowRates );
            } );
        } );
        
        table.append( body );
        $( "#" + code ).append( table );
    };
    
    Rates.prototype.createRow = function( body, code, from, to, ratesRow )
    {
        var row = $( '<tr></tr>' );
        var localeCode = from + "_" + to;
        row.append( $( '<td i18n="tab.rates.' + code + '.' + localeCode + '"></td>' ) );
        
        if( "object" == typeof( ratesRow ) )
        {
            $.each( ratesRow, function( index, rate )
            {
                row.append( $( '<td class="price">' + rate + ' €</td>' ) );
            } );
        }
        else if( "string" == typeof( ratesRow ) )
        {
            row.append( $( '<td i18n="tab.rates.' + ratesRow + '" class="price" colspan="5"></td>' ) );
        }
        else
        {
            row.append( $( '<td class="price" colspan="5">' + ratesRow + ' €</td>' ) );
        }
        
        body.append( row );
    }
    
    return Rates;
} );