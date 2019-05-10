var abrir_modal_completar_cadastro = document.getElementById(
  "abrir_modal_completar_cadastro"
);
var nome_usuario = document.getElementById("nome_usuario");
var celular_usuario = document.getElementById("celular_usuario");
var check_termo_uso = document.getElementById("check_termo_uso");
var addButton = document.getElementById("addButton");
var btn_edit_form_user = document.getElementById("btn_edit_form_user");

function limpa() {
  nome_usuario.value = "";
  celular_usuario.value = "";
}

// btn_preencher_dados.addEventListener('click', function () {
//     document.getElementById('fechar_modal_alerta').click();
// });

// Ao clicar no botão
addButton.addEventListener("click", function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (!user) {
      window.location.href = "index.html";
    } else {
      var nomeParametro = nome_usuario.value;
      var emailParametro = user.email;
      var celularParametro = celular_usuario.value;

      if (check_termo_uso.checked == true) {
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            var myUserId = firebase.auth().currentUser.uid;

            alert("Pronto, agora seu cadastro está completo!");
            create(nomeParametro, emailParametro, celularParametro, myUserId);
          }
        });

        document.getElementById("fechar_modal_alerta").click();
        document.getElementById("btn_cancelar").click();
        limpa();
      } else {
        alert("É necessário aceitar os termos");
      }
    }
  });
});

// // Ao clicar no botão
// btn_edit_form_user.addEventListener('click', function () {

//     firebase.auth().onAuthStateChanged(function (user) {
//         if (!user) {
//             window.location.href = "index.html";
//         } else {

//         }
//     });

// });

function RetornaDataHoraAtual() {
  var dNow = new Date();
  var localdate =
    dNow.getDate() +
    "/" +
    (dNow.getMonth() + 1) +
    "/" +
    dNow.getFullYear() +
    " " +
    dNow.getHours() +
    ":" +
    dNow.getMinutes();
  return localdate;
}

function adicionarDiasData(dias) {
  var hoje = new Date();
  var dataVenc = new Date(hoje.getTime() + dias * 24 * 60 * 60 * 1000);
  return (
    dataVenc.getDate() +
    "/" +
    (dataVenc.getMonth() + 1) +
    "/" +
    dataVenc.getFullYear() +
    " " +
    dataVenc.getHours() +
    ":" +
    dataVenc.getMinutes()
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

  var data_expira = new Date();
  data_expira = adicionarDiasData(15);

  var newKeyUser = firebase
    .database()
    .ref()
    .child("usuarios")
    .push().key;

  var data = {
    nome_usuario: nome_usuario_param,
    email_usuario: email_usuario_param,
    celular_usuario: celular_usuario_param,
    user_id: user_id_param,
    check_termo_uso: "Aceito os termos de uso!",
    data_cadastro: data_atual,
    data_expira_free: data_expira,
    key_usuario: newKeyUser
  };

  return firebase
    .database()
    .ref()
    .child("usuarios")
    .child(newKeyUser)
    .set(data);
}

function exibirMeusCursos() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (!user) {
      window.location.href = "index.html";
    } else {
      $("#celular_usuario").mask("(00) 00000-0000");
      $("#celular_usuario_edit").mask("(00) 00000-0000");

      //preencher nome do usuário logado
      preencheNomeTopo();

      var listaUsuarios = firebase.database().ref("usuarios");

      listaUsuarios.on("child_added", function(snapshot) {
        var itemUser = snapshot.val();
        if (itemUser.email_usuario == user.email) {
          if (itemUser.status_premium === "Pendente") {
            if (user.emailVerified === true) {
              var dataExpiraPremium = itemUser.data_expira_premium;
              var partesDataExpiraPremium = dataExpiraPremium.split("/");
              var dataExpiraPremiumNew = new Date(
                partesDataExpiraPremium[2],
                partesDataExpiraPremium[1] - 1,
                partesDataExpiraPremium[0]
              );

              if (dataExpiraPremiumNew < new Date()) {
                document
                  .getElementById("link_abre_modal_pagamento_premium")
                  .click();

                document.getElementById("pagar_premium").innerHTML = "";

                $("#pagar_premium").append(`        

                        <div class="col-lg-4">
                        </div>
                        
                        <div class="col-lg-4">
                        
                        <!-- INICIO FORMULARIO BOTAO PAGSEGURO -->
                        <form action="https://pagseguro.uol.com.br/checkout/v2/payment.html" method="post"
                          onsubmit="PagSeguroLightbox(this); return false;">
                          <!-- NÃO EDITE OS COMANDOS DAS LINHAS ABAIXO -->
                          <input type="hidden" name="code" value="A777F25B7474A77334B5FF8C24B56506" />
                          <input type="hidden" name="iot" value="button" />
                          <br>
                          <input type="submit" class="btn btn-success btn-lg text-uppercase js-scroll-trigger" value="PAGAMENTO PREMIUM PENDENTE"
                            name="submit" alt="PagSeguro é SEGURO!">
                        </form>
                        </div>

                        <div class="col-lg-4">
                        </div>
                        
                        `);
              }
            } else if (user.emailVerified === false) {
              alert("Confirme seu e-mail para liberar as aulas");
            }
            preencheTodosCursos();
          } else if (itemUser.status_premium === "Liberado") {
            var dataExpiraPremium = itemUser.data_expira_premium;
            var partesDataExpiraPremium = dataExpiraPremium.split("/");
            var dataExpiraPremiumNew = new Date(
              partesDataExpiraPremium[2],
              partesDataExpiraPremium[1] - 1,
              partesDataExpiraPremium[0]
            );

            if (dataExpiraPremiumNew < new Date()) {
              document
                .getElementById("link_abre_modal_pagamento_premium")
                .click();
            } else if (dataExpiraPremiumNew > new Date()) {
              preencheTodosCursos();
            } else if (dataExpiraPremiumNew == new Date()) {
              preencheTodosCursos();
            }
          }
        }
      });
    }
  });
}

function passarDados(dadosParametro) {
  var dados = dadosParametro;
  sessionStorage.setItem("nome_curso", dados);

  window.location.href = "meu-curso.html";
}

function preencheStatusPagamentoPremium(dadosParametro) {
  var dados = dadosParametro;
  sessionStorage.setItem("pagamento_premium", dados);
}

function preencheNomeTopo() {
  var myUserId = firebase.auth().currentUser.uid;

  var usuarioLogado = firebase
    .database()
    .ref("usuarios")
    .orderByChild("user_id")
    .equalTo(myUserId);

  usuarioLogado.on("value", function(snapshot) {
    if (snapshot.exists()) {
      usuarioLogado.on("child_added", function(snapshot) {
        var item = snapshot.val();

        var primeiro_nome = item.nome_usuario.split(" ")[0]; // separar str por espaços
        $("#span_nome_user_id").html("Seja Bem vindo(a), " + primeiro_nome);

        $(
          "#drop_item_perfil_id"
        ).append(`                                                                                                  
                    <a class="dropdown-item" href="#" data-toggle="modal" data-target="#modalEditForm"
                        id="abrir_modal_editar_cadastro" onclick="atualizarDadosUsuario('${
                          item.celular_usuario
                        }', '${item.email_usuario}', '${item.nome_usuario}', '${item.key_usuario}', '${item.data_expira_premium}') ">
                        <i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                        Perfil
                    </a>

                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
                        <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                        Deslogar
                    </a>
                    `);
      });
    } else {
      $("#span_nome_user_id").html("Seja Bem vindo(a)");

      $("#drop_item_perfil_id")
        .append(`                                                                                                  
            <a class="dropdown-item" href="#" data-toggle="modal" data-target="#modalRegisterForm"
            id="abrir_modal_completar_cadastro">
                <i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                Complete seu cadastro
            </a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
                <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                    Deslogar
            </a>
                `);

      document.getElementById("link_abre_modal_completa_cadastro").click();
    }
  });
}

function atualizarDadosUsuario(
  celular_usuario,
  email_usuario,
  nome_usuario,
  key_usuario,
  data_expira_premium
) {
  // preenche os campos do modal
  document.getElementById("nome_usuario_edit").value = nome_usuario;

  document.getElementById("email_usuario_edit").value = email_usuario;

  document.getElementById("celular_usuario_edit").value = celular_usuario;

  document.getElementById("expira_premium_data").value = data_expira_premium;

  // Ao clicar no botão
  btn_edit_form_user.addEventListener("click", function() {
    var email = firebase.auth().currentUser.email;
    var user_id = firebase.auth().currentUser.uid;

    var newPassword = document.getElementById("senha_edit").value;
    var newPasswordConfirm = document.getElementById("repetir_senha_edit")
      .value;

    if (newPassword != "" && newPasswordConfirm != "") {
      if (newPassword === newPasswordConfirm) {
        if (email == email_usuario) {
          var data = {
            nome_usuario: document.getElementById("nome_usuario_edit").value,
            email_usuario: document.getElementById("email_usuario_edit").value,
            celular_usuario: document.getElementById("celular_usuario_edit")
              .value
          };
        }

        var usuarios = firebase
          .database()
          .ref()
          .child("usuarios");

        var data_update = usuarios.child(key_usuario);
        data_update.update(data).then(function() {
          var user = firebase.auth().currentUser;
          user
            .updatePassword(newPassword)
            .then(function() {
              limpa();

              alert("Dados alterados com sucesso!");
              // fechar modal
              document.getElementById("fechar_modal").click();
            })
            .catch(function(error) {
              console.log("error");
            });
        });
      } else {
        alert("As senhas não conferem!");
      }
    } else {
      if (email == email_usuario) {
        var data = {
          nome_usuario: document.getElementById("nome_usuario_edit").value,
          email_usuario: document.getElementById("email_usuario_edit").value,
          celular_usuario: document.getElementById("celular_usuario_edit").value
        };
      }

      var usuarios = firebase
        .database()
        .ref()
        .child("usuarios");

      var data_update = usuarios.child(key_usuario);
      data_update.update(data).then(function() {
        limpa();

        alert("Dados alterados com sucesso!");
        // fechar modal
        document.getElementById("fechar_modal").click();
      });
    }
  });
}

function RetornaDataHoraAtual() {
  var dNow = new Date();
  var localdate =
    dNow.getDate() + "/" + (dNow.getMonth() + 1) + "/" + dNow.getFullYear();

  return localdate;
}

function preencheTodosCursos() {
  var listaUsuarios = firebase.database().ref("usuarios");

  var email = firebase.auth().currentUser.email;

  listaUsuarios.on("child_added", function(snapshot) {
    var itemUser = snapshot.val();
    if (itemUser.email_usuario == email) {
      if (itemUser.status_premium == "Liberado") {
        var lista_cursos = firebase.database().ref("cursos");

        // Retrieve new posts as they are added to our database
        lista_cursos.on("child_added", function(snapshot_curso) {
          var item = snapshot_curso.val();

          $(
            "#cursos_id"
          ).append(`                                                               

        <div class="col-md-4 col-sm-6 portfolio-item">
                <a class="portfolio-link" onclick="passarDados('${
                  item.dados_curso.nome
                }', '${"Liberado"}')" href="#">                                        
                    <img class="img-fluid rounded" src="${
                      item.dados_curso.urlImagem
                    }" alt="">
                </a>
                <hr>
                <h4>${
                  item.dados_curso.nome
                }</h4>                                    
        </div>

          `);
        });

        lista_cursos.on("child_changed", function(snapshot) {
          window.location.reload();
        });

        // Get the data on a post that has been removed
        lista_cursos.on("child_removed", function(snapshot) {
          window.location.reload();
        });
      } else if (itemUser.status_premium === "Pendente") {
        var lista_cursos = firebase.database().ref("cursos");

        // Retrieve new posts as they are added to our database
        lista_cursos.on("child_added", function(snapshot_curso) {
          var item = snapshot_curso.val();

          $(
            "#cursos_id"
          ).append(`                                                               

        <div class="col-md-4 col-sm-6 portfolio-item">
                <a class="portfolio-link" onclick="passarDados('${
                  item.dados_curso.nome
                }', '${"Pendente"}')" href="#">                                        
                    <img class="img-fluid rounded" src="${
                      item.dados_curso.urlImagem
                    }" alt="">
                </a>
                <hr>
                <h4>${
                  item.dados_curso.nome
                }</h4>                                    
        </div>

          `);
        });

        lista_cursos.on("child_changed", function(snapshot) {
          window.location.reload();
        });

        // Get the data on a post that has been removed
        lista_cursos.on("child_removed", function(snapshot) {
          window.location.reload();
        });
      }
    }
  });
}
