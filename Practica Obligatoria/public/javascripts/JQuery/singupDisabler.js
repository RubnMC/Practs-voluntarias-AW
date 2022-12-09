$(document).ready(function () {
    $('#numEm').hide();
    $('#checkTec').hide();
    $('#numEmpleado').prop( "disabled", true );
    $("#profileSelect").click(function () {
        if ($('#profileSelect').find(":selected").val() === 'PAS') {
            $('#numEm').show();
            $('#checkTec').show();
        }
        else {
            $('#numEm').hide();
            $('#checkTec').hide();
        }
    });

    $("#flexCheckTecnico").click(function () {
        if (!$('#flexCheckTecnico').is(':checked')) {
            $('#numEmpleado').prop( "disabled", true );
        }
        else {
            $('#numEmpleado').prop( "disabled", false );
        }
    });
});