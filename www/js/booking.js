/**
 * @author Mathieu Delaunay
 */

define( [ 
    "analytics",
    "loading",
    "locale",
    "jqueryui"
], function( Analytics, Loading, LocaleManager )
{
    function Booking() 
    {
        var that = this;
        this.showContent( "#form" );
        
        /* Error */
       $( "#book_error" ).click( function()
       {
            that.showContent( "#form" );
            Analytics.trackEvent( "Navigation", "Mail_Error_Click" );
       } );
        
        /* Success */
       $( "#book_success" ).click( function()
       {
            that.showContent( "#form" );
            $( "#nav li[data-tab=home]" ).click();
            Analytics.trackEvent( "Navigation", "Mail_Success_Click" );
       } );
        
        /* Date pickers init */
        var dates = $( "#transferStartDate, #transferEndDate" ).datepicker( {
            minDate : 0,
            changeMonth : true,
            onSelect : function( selectedDate ) {
                var option = this.id == "transferStartDate" ? "minDate" : "maxDate";
                var instance = $( this) .data( "datepicker" );
                var date = $.datepicker.parseDate( instance.settings.dateFormat || $.datepicker._defaults.dateFormat, selectedDate, instance.settings );
                dates.not( this ).datepicker( "option", option, date );
            }
        });
        
        /* Transfer type init */
        $( "#oneWayTransfer" ).click( function()
        {
            $( "#transferEndDiv" ).hide();
        } );
        $( "#returnTransfer" ).click( function()
        {
            $( "#transferEndDiv" ).show();
        } );
        $( "#oneWayTransfer" ).click();
        
        /* Transfer start place init */
        $( "#transferStartPlace" ).change( function()
        {
            var selection = $( "#transferStartPlace" ).val();
            if( selection != 0 && selection < 4 )
            {
                $( "#transferStartFlightNumberDiv" ).show();
                $( "#transferStartHourDiv" ).hide();
            } else {
                $( "#transferStartFlightNumberDiv" ).hide();   
                $( "#transferStartHourDiv" ).show();
            }
            if( selection > 4 )
            {
                $( "#transferStartAddressDiv" ).show(); 
            } else {
                $( "#transferStartAddressDiv" ).hide(); 
            }
        } );
        $( "#transferStartPlace" ).change();
        
        /* Transfer end place init */
        $( "#transferEndPlace" ).change( function()
        {
            var selection = $( "#transferEndPlace" ).val();
            if( selection != 0 && selection < 4 )
            {
                $( "#transferEndFlightNumberDiv" ).show();
                $( "#transferEndHourDiv" ).hide();
            } else {
                $( "#transferEndFlightNumberDiv" ).hide();
                $( "#transferEndHourDiv" ).show();   
            }
            if( selection > 4 )
            {
                $( "#transferEndAddressDiv" ).show(); 
            } else {
                $( "#transferEndAddressDiv" ).hide(); 
            }
        } );
        $( "#transferEndPlace" ).change();
        
        /* Form init */
        $( "#form" ).on( "onsubmit", function()
        {
            return false;
        } );
    }; 
    
    /* Form validity check */
    Booking.prototype.checkForm = function()
    {
        Loading.start();
            
        Analytics.trackEvent( "Form", "Submit" );
        
        var that = this;
        var isValid = true;
        
        $.each( $( ".checkField:visible input[type=text]" ), function()
        {
            isValid = !that.checkEmptyField( $( this ) ) && isValid;
        } );
        
        $.each( $( ".checkField:visible textarea" ), function()
        {
            isValid = !that.checkEmptyField( $( this ) ) && isValid;
        } );
        
        $.each( $( ".checkField:visible select" ), function()
        {
            isValid = !that.checkItemSelection( $( this ) ) && isValid;
        } );
        
        isValid = !this.checkMail() && isValid;
        
        if( isValid )
        {
            $( "#mailContent" ).attr( 'value', this.generateMailContent() );
            $( "#phpLocale" ).attr( 'value', LocaleManager.getLocale() );
            
            Analytics.trackEvent( "Form", "Check", "valid" );
        };
        
        Loading.stop();
        
        return isValid;
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
            $( field ).addClass( "error" );
            Analytics.trackEvent( "Form", "Check", "error", $( 'label', field ).attr( 'for' ) );
        } else {
            $( field ).removeClass( "error" );
        }
    };
    
    /* Mail body */
    var languageMap = {
        en: 'Anglais',
        fr: 'Français',
        de: 'Allemand'
    };
    
    Booking.prototype.getLabelText = function( fieldName )
    {
        var labelI18n = $( 'label[for=' + fieldName + ']' ).attr( 'i18n' );
        var label = $.i18n.prop( labelI18n );
        label = label.replace( /<span.*/gm, "" );
        
        return label;
    };
    
    /* Mail */
    Booking.prototype.getRadioText = function( radioName )
    {   
        var label = this.getLabelText( radioName );
        
        var inputValue = $( 'input:radio[name=' + radioName + ']:checked' ).attr( 'value' );
        var valueI18n = $( 'label[for=' + inputValue + ']' ).attr( 'i18n' );
        var value = $.i18n.prop( valueI18n );
        
        return label + ' : ' + value + "\n";
    };
    
    Booking.prototype.getInputText = function( inputName )
    {
        if( 0 == $( 'input[name=' + inputName + ']:visible' ).length )
            return "";
        
        var label = this.getLabelText( inputName );        
        return label + ' : ' + $( 'input[name=' + inputName + ']' ).val() + "\n";
    };
    
    Booking.prototype.getDateText = function( inputName )
    {
        if( 0 == $( 'input[name=' + inputName + ']:visible' ).length )
            return "";
        
        var label = this.getLabelText( inputName ); 
        var date = $.datepicker.formatDate( 'dd M yy', $( 'input[name=' + inputName + ']' ).datepicker( "getDate" ) );       
        return label + ' : ' + date + "\n";
    };
    
    Booking.prototype.getTextAreaText = function( textAreaName )
    {
        if( 0 == $( 'textarea[name=' + textAreaName + ']:visible' ).length )
            return "";
        
        var label = this.getLabelText( textAreaName );        
        return label + ' : ' + $( 'textarea[name=' + textAreaName + ']' ).val() + "\n";
    }
    
    Booking.prototype.getOptionValue = function( selectName )
    {
        var select = $( 'select[name=' + selectName + ']' );
        var selectValue = select.val();
        var option = $( "option[value=" + selectValue + "]", select );
        return option.attr( 'value' );  
    };
    
    Booking.prototype.getOptionText = function( selectName )
    {
        var select = $( 'select[name=' + selectName + ']' );
        var selectValue = select.val();
        var option = $( "option[value=" + selectValue + "]", select );
        var optionI18n = option.attr( 'i18n' );
        return $.i18n.prop( optionI18n ); 
    };
    
    Booking.prototype.getPassengersText = function()
    {
        var result = this.getLabelText( 'nbAdultPassengers' ) + ' :\n'; 
        result += this.getOptionValue( 'nbAdultPassengers' ) + ' adulte(s)\n';
        result += this.getOptionValue( 'nbChildPassengers' ) + ' enfants(s)\n';
        result += this.getOptionValue( 'nbBabyPassengers' ) + ' bébé(s)\n';
        return result;
    };
    
    Booking.prototype.getSelectText = function( selectName )
    {
        var label = this.getLabelText( selectName );     
        var value = this.getOptionText( selectName );
        return label + ' : ' + value + "\n";
    };
    
    Booking.prototype.generateMailContent = function()
    {   
        LocaleManager.setTempLocale( 'fr' );
        var language = languageMap[ $( "[lang].selected" ).attr( 'lang' ) ];
        var mailContent = "Langue du client : " + language + "\n\n";
        
        mailContent += this.getRadioText( 'transferType' ) + "\n";
        
        mailContent += this.getDateText( 'transferStartDate' );
        mailContent += this.getSelectText( 'transferStartPlace' );
        mailContent += this.getInputText( 'transferStartFlightNumber' );
        mailContent += this.getInputText( 'transferStartHour' );
        mailContent += this.getTextAreaText( 'transferStartAddress' ) + "\n";
        
        mailContent += this.getSelectText( 'transferEndPlace' );
        mailContent += this.getInputText( 'transferEndFlightNumber' );
        mailContent += this.getTextAreaText( 'transferEndAddress' );
        mailContent += this.getDateText( 'transferEndDate' );
        mailContent += this.getInputText( 'transferEndHour' ) + "\n";
        
        mailContent += this.getPassengersText() + "\n";
        
        mailContent += this.getRadioText( 'customerGender' );
        mailContent += this.getInputText( 'customerName' );
        mailContent += this.getInputText( 'customerMail' );
        mailContent += this.getInputText( 'customerPhone' ) + "\n";
        
        mailContent += this.getTextAreaText( 'comment' );
        
        LocaleManager.restoreLocale();
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