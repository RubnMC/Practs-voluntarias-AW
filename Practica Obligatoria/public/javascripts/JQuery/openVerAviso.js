$(document).ready(function () {
    // Cada vez que se pulse el botón de 'Enviar'
    $(".botonVistaAnuncio").on("click", function () {
        //Obtener el valor contenido en el cuadro de texto
        let idAviso = $($(this).parents("tr")).find("td").eq(0).html()

        // Realizar la petición al servidor
        $.ajax({
            method: "GET",
            url: "/aviso/ " + idAviso,
            // En caso de éxito, mostrar el resultado en el documento HTML
            success: function (data, textStatus, jqXHR) {
                //Primera columna
                $(".nombreUsuario").text(data.aviso.nombreUsuario);
                $(".idAviso").text("Aviso " + data.aviso.idAviso + ":");
                $(".inputIdAviso").val(data.aviso.idAviso);
                $(".tipoAviso").text(data.aviso.tipo);
                //Fecha
                $(".fechaAviso").text(data.aviso.fecha);
                //Tipo
                $(".subtipoUno").text(data.aviso.subtipo[0]);
                $(".subtipoDos").text(data.aviso.subtipo[1]);
                //Perfil Usuario
                $(".perfilUsuarioAviso").text(data.aviso.perfilUniversitario);
                //Texto
                $(".textoAviso").text(data.aviso.texto);
                //Observaciones
                if(data.aviso.observaciones){
                $(".comentarioTecnico").text(data.aviso.observaciones);
                }

            },
            // En caso de error, mostrar el error producido
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Se ha producido un error: " + errorThrown);
            }
        });

    });
});