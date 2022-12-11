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
          if (!($(tr).find(".texoTabla").html().toLowerCase()).includes($("#textoBuscar").val().trim().toLowerCase())) {
              $(tr).hide()
          }
      });
    });
});