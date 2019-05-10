var nome_usuario = document.getElementById("nome_usuario");
var celular_usuario = document.getElementById("celular_usuario");
var email_usuario = document.getElementById("email_usuario");
var senha = document.getElementById("senha");
var repetir_senha = document.getElementById("repetir_senha");
var check_termo_uso = document.getElementById("check_termo_uso");
var addButton = document.getElementById("addButton");

function limpa() {
  nome_usuario.value = "";
  celular_usuario.value = "";
  email_usuario.value = "";
  senha.value = "";
  repetir_senha.value = "";
}

// Ao clicar no botão
addButton.addEventListener("click", function() {
  var nomeParametro = nome_usuario.value;
  var emailParametro = email_usuario.value;
  var celularParametro = celular_usuario.value;

  if (check_termo_uso.checked == true) {
    if (senha.value == repetir_senha.value) {
      //criar um novo usuário
      firebase
        .auth()
        .createUserWithEmailAndPassword(email_usuario.value, senha.value)
        .then(function() {
          enviaEmailConfirmacao();

          firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              var myUserId = firebase.auth().currentUser.uid;

              create(nomeParametro, emailParametro, celularParametro, myUserId);
            }
          });

          document.getElementById("btn_cancelar").click();
          limpa();
        })
        .catch(function(error) {
          console.error(error.code);

          if (error.code === "auth/email-already-in-use") {
            alert("E-mail já cadastrado! Faça login ou recupere a senha!");
          } else if (error.code === "auth/invalid-email") {
            alert("E-mail inválido, verifique!");
          } else if (error.code === "auth/weak-password") {
            alert("Sua senha precisa de 6 caracteres!");
          }

          console.error(error.message);
          // alert('Falha ao cadastrar, verifique o erro no console.');
        });
    } else {
      alert("As senhas não conferem!");
    }
  } else {
    alert("É necessário aceitar os termos");
  }
});

function RetornaDataHoraAtual() {
  var dNow = new Date();
  var localdate =
    dNow.getFullYear() + "/" + (dNow.getMonth() + 1) + "/" + dNow.getDate();
  return localdate;
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

// Função para criar um registro no Firebase
function create(
  nome_usuario_param,
  email_usuario_param,
  celular_usuario_param,
  user_id_param
) {
  var data_atual = RetornaDataHoraAtual();

  var dataExpira = RetornaDataHoraAtual();
  dataExpira = adicionarDiasData(2, dataExpira);

  var newKeyUser = firebase
    .database()
    .ref()
    .child("usuarios")
    .push().key;

  // alert(newKeyUser);

  var data = {
    nome_usuario: nome_usuario_param,
    email_usuario: email_usuario_param,
    celular_usuario: celular_usuario_param,
    user_id: user_id_param,
    check_termo_uso: "Aceito os termos de uso!",
    data_cadastro: data_atual,
    data_expira_premium: dataExpira,
    key_usuario: newKeyUser,
    status_premium: "Pendente"
  };

  firebase
    .database()
    .ref()
    .child("usuarios")
    .child(newKeyUser)
    .set(data);

  alert("Cadastro efetuado com sucesso!");
}

function enviaEmailConfirmacao() {
  var user = firebase.auth().currentUser;

  user
    .sendEmailVerification()
    .then(function() {
      // Email sent.
    })
    .catch(function(error) {
      // An error happened.
    });
}

function recuperarSenha() {
  var auth = firebase.auth();
  var emailAddress = document.getElementById("recuperar_email_usuario").value;

  auth
    .sendPasswordResetEmail(emailAddress)
    .then(function() {
      // Email sent.
      alert(emailAddress);
    })
    .catch(function(error) {
      // An error happened.
    });
}
