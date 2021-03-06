/**
 * @author Mathieu Delaunay
 */

define( function()
{
    var titles = [
        'tab.rates.pers_1_3',
        'tab.rates.pers_4',
        'tab.rates.pers_5',
        'tab.rates.pers_6',
        'tab.rates.pers_7_8',
        // 'tab.rates.pers_8'
    ];

    var bookingDef = {
        nbPerson : [1,4,5,6,7],
        isReturn : {
            returnRates : 'returnTransfer',
            oneWayRates : 'oneWayTransfer'
        },
        from : {
            suburbs : 'other'
        },
        to : {
            paris          : 'parisHotel',
            versailles     : 'other',
            deauville      : 'other',
            mont_st_michel : 'other',
            visit          : 'other'
        }
    };

    var ratesDef = {
        returnRates: {
            cdg: {
                paris:      [ 110, 120, 130, 140, 160 ],
                disney:     [ 120, 130, 140, 150, 165 ],
                versailles: [ 150, 150, 160, 170, 190 ]
            },
            orly: {
                paris:      [ 100, 110, 120, 130, 140 ],
                disney:     [ 130, 140, 150, 160, 170 ],
                versailles: [ 140, 150, 160, 170, 190 ]
            },
            beauvais: {
                paris:      [ 230, 230, 230, 260, 260 ],
                disney:     [ 250, 260, 270, 280, 290 ]
            },
            vatry: {
                disney:     [ 480, 480, 480, 500, 530 ]
            },
            paris: {
                deauville:      800,
                mont_st_michel: 950
            },
            suburbs: {
                paris: 140
            }
        },
        oneWayRates: {
            cdg: {
                paris:      [ 55, 60, 65, 70, 80 ],
                disney:     [ 60, 65, 70, 75, 85 ],
                orly:       [ 65, 70, 75, 80, 90 ],
                versailles: [ 80, 80, 85, 85, 100 ]
            },
            orly: {
                paris:      [ 50, 55, 60, 65, 75 ],
                disney:     [ 65, 70, 75, 80, 90 ],
                versailles: [ 70, 75, 80, 85, 95 ]
            },
            vatry: {
                disney:     [ 230, 235, 240, 250, 265 ]
            },
            beauvais: {
                paris:      [ 115, 120, 125, 130, 140 ],
                disney:     [ 125, 130, 135, 140, 145 ]
            },
            disney: {
                paris:      [ 65, 70, 75, 80, 90 ]
            },
            paris: {
                visit:          "oneWayRates.paris_visit_price",
                deauville:      400,
                mont_st_michel: 500
            }
        }
    };

    function Rates(booking)
    {
        this.booking = booking;
        var self = this;
        $.each( ratesDef, function( ratesCode, rates )
        {
            self.createTable( ratesCode, rates );
        } );
    };

    Rates.prototype.createTable = function( code, rates )
    {
        var table = $( '<table cellspacing="1" width="100%" class="table table-striped table-bordered"></table>' );
        table.data( 'return', bookingDef.isReturn[code]);
        var header = $( '<thead></thead>' );
        var titleRow = $(
            '<tr>' +
                '<th data-i18n="tab.rates.' + code + '"></th>' +
            '</tr>' );
        $.each(titles, function(index, title)
        {
            titleRow.append('<th data-i18n="' + title + '"></th>');
        });

        header.append( titleRow );

        var body = $( '<tbody></tbody>' );
        var self = this;
        $.each( rates, function( from, toRates )
        {
            $.each( toRates, function( to, rowRates )
            {
                self.createRow( body, code, from, to, rowRates );
            } );
        } );

        table.append( header );
        table.append( body );
        $( "#" + code ).append( table );

        table.find('td').click(function()
        {
            var sFrom = $(this).closest('tr').data('from');
            if (bookingDef.from[sFrom] !== undefined) {
                sFrom = bookingDef.from[sFrom];
            }

            var sTo = $(this).closest('tr').data('to');
            if (bookingDef.to[sTo] !== undefined) {
                sTo = bookingDef.to[sTo];
            }

            var oBookingParam = {
                iNbPerson   : $(this).data('nb-person'),
                sFrom       : sFrom,
                sTo         : sTo,
                sReturn     : $(this).closest('table').data('return')
            }

            self.booking.setParam(oBookingParam);
            window.location.hash = "#booking";
        });
    };

    Rates.prototype.createRow = function( body, code, from, to, ratesRow )
    {
        var row = $( '<tr></tr>' );
        row.data( 'from', from);
        row.data( 'to', to);
        var localeCode = from + "_" + to;
        row.append( $( '<td data-i18n="tab.rates.' + code + '.' + localeCode + '"></td>' ) );

        if( "object" == typeof( ratesRow ) )
        {
            $.each( ratesRow, function( index, rate )
            {
                var cell = $( '<td class="price">' + rate + ' €</td>' );
                cell.data( 'nb-person', bookingDef.nbPerson[index] );
                row.append( cell );
            } );
        }
        else if( "string" == typeof( ratesRow ) )
        {
            row.append( $( '<td data-i18n="tab.rates.' + ratesRow + '" class="price" colspan="5"></td>' ) );
        }
        else
        {
            row.append( $( '<td class="price" colspan="5">' + ratesRow + ' €</td>' ) );
        }

        body.append( row );
    }

    return Rates;
} );