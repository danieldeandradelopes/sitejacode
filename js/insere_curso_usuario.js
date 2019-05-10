var email_usuario = document.getElementById("email-usuario");
var data_compra = document.getElementById("data-compra");
var btn_liberar = document.getElementById("btn_liberar");

// Ao clicar no botão
btn_liberar.addEventListener("click", function() {
  const email = email_usuario.value;
  const data = data_compra.value;
  liberarCursoAluno(email, data);
});

// Função para criar um registro no Firebase
function liberarCursoAluno(email_usuario_param, data_compra_param) {
  alert(data_compra_param);

  var dataExpira = data_compra_param;
  dataExpira = adicionarDiasData(366, dataExpira);

  var listaUsuarios = firebase
    .database()
    .ref("usuarios")
    .orderByChild("email_usuario")
    .equalTo(email_usuario_param);

  listaUsuarios.on("child_added", function(snapshot) {
    var item = snapshot.val();

    if (item.email_usuario === email_usuario_param) {
      firebase
        .database()
        .ref()
        .child("usuarios")
        .child(item.key_usuario)
        .child("status_premium")
        .set("Liberado");
      firebase
        .database()
        .ref()
        .child("usuarios")
        .child(item.key_usuario)
        .child("data_expira_premium")
        .set(dataExpira);

      alert("Aluno Liberado");
      email_usuario.value = "";
      data_compra.value = "";
    }
  });
}

function adicionarDiasData(dias, data_compra_param) {
  var data_compra = new Date(data_compra_param);

  var dataVenc = new Date(data_compra.getTime() + dias * 24 * 60 * 60 * 1000);
  return (
    dataVenc.getDate() +
    "/" +
    (dataVenc.getMonth() + 1) +
    "/" +
    dataVenc.getFullYear()
  );
}
