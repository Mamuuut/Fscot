/**
 * @author Mathieu Delaunay
 */

define( [ "locale" ], function( LocaleManager )
{
    function Gallery( path, imgDef )
    {
        var that = this;

       $('#photo li img').on('click',function(){
            var src = $(this).data('full');
            var img = '<img src="' + src + '" class="img-responsive"/>';
            $('#myModal').modal();
            $('#myModal').on('shown.bs.modal', function(){
                $('#myModal .modal-body').html(img);
            });
            $('#myModal').on('hidden.bs.modal', function(){
                $('#myModal .modal-body').html('');
            });
       });
    };

    return Gallery;
} );