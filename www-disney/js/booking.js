/**
 * @author Mathieu Delaunay
 */

define( [
    'analytics',
    'loading',
    'locale',
    'jsonRPC2php.client',
    'bootstrap-datetimepicker'
], function( Analytics, Loading, LocaleManager )
{
    function Booking()
    {
        var self = this;
        this.showContent( "#form" );

        /* Error */
       $( "#book_error" ).click( function()
       {
            self.showContent( "#form" );
            Analytics.trackEvent( "Navigation", "Mail_Error_Click" );
       } );

        /* Success */
       $( "#book_success" ).click( function()
       {
            self.showContent( "#form" );
            $( "#nav li[data-tab=home]" ).click();
            Analytics.trackEvent( "Navigation", "Mail_Success_Click" );
       } );

        /* Pickers */
        $( '.date-picker' ).datetimepicker({
            pickTime: false
        });
        $( '.time-picker' ).datetimepicker({
            pickDate: false
        });

        /* Transfer type init */
        $( "#oneWayTransfer" ).click( function()
        {
            $( ".end-control" ).hide();
        } );
        $( "#returnTransfer" ).click( function()
        {
            $( ".end-control" ).show();
        } );
        $( "#oneWayTransfer" ).click();

        /* Transfer start place init */
        $( "#transferStartPlace" ).change( function()
        {
            var selection = $( "#transferStartPlace" ).val();
            $( "#transferStartFlightNumber" ).closest('.form-group').toggle(selection != 0 && selection < 4);
            $( "#transferStartAddress" ).closest('.form-group').toggle(selection > 4);
        } );
        $( "#transferStartPlace" ).change();

        /* Transfer end place init */
        $( "#transferEndPlace" ).change( function()
        {
            var selection = $( "#transferEndPlace" ).val();
            $( "#transferEndFlightNumber" ).closest('.form-group').toggle(selection != 0 && selection < 4);
            $( "#transferEndAddress" ).closest('.form-group').toggle(selection > 4);
        } );
        $( "#transferEndPlace" ).change();

        /* Form init */
        $( "form" ).on( "onsubmit", function()
        {
            return false;
        } );
    };

    /* Form validity check */
    Booking.prototype.checkForm = function()
    {
        $('#booking .alert').hide();
        Loading.start();

        Analytics.trackEvent( "Form", "Submit" );

        var self = this;
        var isValid = true;

        $.each( $( ".check-field:visible input[type=text]" ), function()
        {
            isValid = !self.checkEmptyField( $( this ) ) && isValid;
        } );

        $.each( $( ".check-field:visible textarea" ), function()
        {
            isValid = !self.checkEmptyField( $( this ) ) && isValid;
        } );

        $.each( $( ".check-field:visible select" ), function()
        {
            isValid = !self.checkItemSelection( $( this ) ) && isValid;
        } );

        isValid = !this.checkMail() && isValid;

        if( isValid )
        {
            var rpc = new jsonrpcphp('api.php',function(){
                rpc.server.sendMail(
                    [
                        $( '#customerMail' ).val(),
                        self.generateMailContent(),
                        LocaleManager.getLocale()
                    ],
                    function(result)
                    {
                        if (result.msg === 'mailsuccess') {
                            $('#booking .alert-sucess').show();
                        }
                        else {
                            $('#booking .alert-danger').show();
                        }
                    }
                );
            });

            Analytics.trackEvent( "Form", "Check", "valid" );
        };

        Loading.stop();

        return false;// isValid;
    };

    Booking.prototype.checkMail = function()
    {
        var field = $( '#customerMail' );
        var mail = field.val();
        var isNotValid = !mail.match( /.+@.+\..+/, "" );
        this.displayError( field.parent(), isNotValid );
        return isNotValid;
    }

    Booking.prototype.checkEmptyField = function( field )
    {
        var isFieldEmpty = "" == $.trim( field.val() );
        this.displayError( field.parent(), isFieldEmpty );
        return isFieldEmpty;
    };

    Booking.prototype.checkItemSelection = function( field )
    {
        var noItemSelected = "0" == field.val();
        this.displayError( field.parent(), noItemSelected );
        return noItemSelected;
    };

    Booking.prototype.displayError = function( field, visible )
    {
        if( visible )
        {
            $( field ).closest('.form-group').addClass( "has-error" );
            Analytics.trackEvent( "Form", "Check", "error", $( 'label', field ).attr( 'for' ) );
        } else {
            $( field ).removeClass( "has-error" );
        }
    };

    /* Mail body */
    var languageMap = {
        en: 'Anglais',
        fr: 'Français',
        de: 'Allemand'
    };

    /* Mail */
    Booking.prototype.getRadioText = function( formGroup )
    {
        var valueI18n = formGroup.find('input:radio:checked').closest('label').find('span').data( 'i18n' );
        return LocaleManager.getString( valueI18n, 'fr' ) + "\n";
    };

    Booking.prototype.getInputText = function( formGroup )
    {
        return formGroup.find('input').val() + "\n";
    };

    Booking.prototype.getDateText = function( formGroup )
    {
        var date = formGroup.find('.date-picker').data("DateTimePicker").getDate().format('DD/MM/YYYY');
        var time = formGroup.find('.time-picker').data("DateTimePicker").getDate().format('HH:mm');
        return date + ' - ' + time + "\n";
    };

    Booking.prototype.getTextAreaText = function( formGroup )
    {
        return formGroup.find('textarea').val() + "\n";
    }

    Booking.prototype.getSelectText = function( formGroup )
    {
        var sResult = '\n';
        formGroup.find('select').each(function()
        {
            if ($(this).find('option:selected').val() !== "0") {
                var i18nKey = $(this).find('option:selected').data('i18n');
                sResult += LocaleManager.getString( i18nKey, 'fr' ) + '\n';
            }
        });
        return sResult;
    };

    Booking.prototype.generateMailContent = function()
    {
        var self = this;
        var language = languageMap[ $( ".lang-btn.selected" ).data( 'lang' ) ];
        var mailContent = "Langue du client : " + language + "\n\n";

        $('.form-group:visible').each(function()
        {
            var i18nKey     = $(this).find('[data-i18n]:not(.btn)').data('i18n');
            if (i18nKey !== undefined) {

                var i18nValue   = LocaleManager.getString( i18nKey, 'fr' );
                mailContent += i18nValue + ': ';

                var type        = $(this).data('type');
                switch(type) {
                    case 'text' :
                        mailContent += self.getInputText($(this));
                        break;
                    case 'select' :
                        mailContent += self.getSelectText($(this));
                        break;
                    case 'textarea' :
                        mailContent += self.getTextAreaText($(this));
                        break;
                    case 'date' :
                        mailContent += self.getDateText($(this));
                        break;
                    case 'radio' :
                        mailContent += self.getRadioText($(this));
                        break;
                }

                mailContent += '\n';
            }
        });

        decodedHtml = $( '<div />' ).html( mailContent ).text();

        return decodedHtml;
    };

    Booking.prototype.showContent = function( id )
    {
        $( ".book-content" ).hide();
        $( id ).show();
    };

    return Booking;
} );