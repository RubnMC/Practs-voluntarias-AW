$(document).ready(function() {

    $("#botonMiPerfil").on("click", function () {

        $.ajax({
            method: "GET",
            url: "/contador",
            // En caso de éxito, mostrar el resultado en el documento HTML
            success: function (data, textStatus, jqXHR) {
                $("#perfilAvisos").text(data.contador.total);
                $("#perfilIndicendias").text(data.contador.incidencias);
                $("#perfilSugerencias").text(data.contador.sugerencias);
                $("#perfilFelicitaciones").text(data.contador.felicitaciones);
            },
            // En caso de error, mostrar el error producido
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Se ha producido un error: " + errorThrown);
            }
        });
    });
    
})