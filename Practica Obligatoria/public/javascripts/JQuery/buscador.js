//Buscador, se encuentra en la cabecera

$(document).ready(function () {
    $("#textoBuscar").keypress(function (k) {
        if (k.which == 13) {
            $('#botonBuscar').click();
        }
    })

    $("#botonBuscar").click(function () {
      $('#tablaAvisos > tbody  > tr').each(function(index, tr) {
          $(tr).show()
          let target =".texoTabla";
          if ($('#busquedaUsuarios').is(':checked')) {
            target = ".nombreUsuario"
          }
          console.log($(tr).find(".nombreUsuario").html());
          if (!($(tr).find(target).html().toLowerCase()).includes($("#textoBuscar").val().trim().toLowerCase())) {
              $(tr).hide()
          }
      });
    });
});