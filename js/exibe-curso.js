var nome_usuario = document.getElementById("nome_usuario");
var celular_usuario = document.getElementById("celular_usuario");
var btn_edit_form_user = document.getElementById("btn_edit_form_user");
// var btn_enviar_duvida = document.getElementById('btn_enviar_duvida');
// var textarea_comentario = document.getElementById('textarea_comentario');

function exibeAulasCursos() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (!user) {
      window.location.href = "index.html";
    } else {
      //preencher nome do usuário logado
      preencheNomeTopo();

      //... depois ...
      var dadosArquivados = sessionStorage.getItem("nome_curso");

      var curso_exibir_aulas = "";
      var nome_pasta = "";
      var qtd_aulas = 0;

      if (dadosArquivados === "Android com Firebase") {
        curso_exibir_aulas = "android-firebase";
        nome_pasta = "android-firebase";
      } else if (dadosArquivados === "Web Api com PHP e JSON") {
        curso_exibir_aulas = "web-api-retorno-json";
        nome_pasta = "WebAPI";
      } else if (dadosArquivados === "JavaScript Fundamentos") {
        curso_exibir_aulas = "javascript-fundamentos";
        nome_pasta = "JavaScript";
      } else if (dadosArquivados === "Ead com Wordpress") {
        curso_exibir_aulas = "ead-wordpress";
        nome_pasta = "EadWordPress";
      } else if (dadosArquivados === "Criando um App de Sucesso") {
        curso_exibir_aulas = "criar-app-sucesso";
        nome_pasta = "AppDeSucesso";
      } else if (dadosArquivados === "Criar Site Institucional") {
        curso_exibir_aulas = "site-institucional-hospedar";
        nome_pasta = "SiteInstitucional";
      } else if (dadosArquivados === "API Rest com MongoDB e Javascript") {
        curso_exibir_aulas = "api-rest-nodejs";
        nome_pasta = "ApiRestNodeJs";
      } else if (dadosArquivados === "Programador Android 2019") {
        curso_exibir_aulas = "android-firebase-2019";
        nome_pasta = "android-firebase-2019";
      }

      //caso não tenha nenhuma aula sido selecionada, retorna por padrão a primeira aula do curso
      exibirSection(1, curso_exibir_aulas);

      $("#aulas_nome_cursos").html(dadosArquivados + " - Aulas");

      var listaAulasCurso = firebase
        .database()
        .ref("cursos")
        .child(curso_exibir_aulas)
        .child("aulas");

      var contador = 0;

      var idAula = "";

      listaAulasCurso.on("child_added", function(snapshot) {
        var item = snapshot.val();

        idAula = item.id;

        contador += 1;

        if (item.exibir_free === "Exibir") {
          $("#lista_aulas_id").append(`
                

                    <section>
                        <li class="nav-item">
                        <a class="nav-link collapsed" href="#" data-target="#collapseUtilities" onclick="exibirSection('${
                          item.id
                        }', '${curso_exibir_aulas}')"
                            aria-expanded="true" aria-controls="collapseUtilities">                            
                            <i class="fas fa-fw fa-graduation-cap"></i>
                            <span class="badge badge-success">Grátis</span>
                            <span>${"Aula " +
                              contador +
                              " - " +
                              item.nome}</span>                                                    
                            
                        </a>                                           
                    </section>
                
                `);
        } else if (item.exibir_free === "Não") {
          $("#lista_aulas_id").append(`
                

                    <section>
                        <li class="nav-item">
                        <a class="nav-link collapsed" href="#" data-target="#collapseUtilities" onclick="exibirSection('${
                          item.id
                        }', '${curso_exibir_aulas}')"
                            aria-expanded="true" aria-controls="collapseUtilities">                            
                            <i class="fas fa-fw fa-graduation-cap"></i>
                            <span class="badge badge-secondary">Premium</span>
                            <span>${"Aula " +
                              contador +
                              " - " +
                              item.nome}</span>                        
                        </a>                   
                    </section>
                
                `);
        }
      });

      // // Ao clicar no botão
      // btn_enviar_duvida.addEventListener('click', function () {

      //     var userId = firebase.auth().currentUser.uid;

      //     var lista_usuarios = firebase.database().ref('usuarios').orderByChild("user_id").equalTo(userId);

      //     var nomeUsuario = "";
      //     var idUsuario = "";

      //     // Retrieve new posts as they are added to our database
      //     lista_usuarios.on("child_added", function (snapshot) {
      //         var item = snapshot.val();

      //         nomeUsuario = item.nome_usuario;
      //         idUsuario = item.key_usuario;

      //         createComment(idAula, nomeUsuario, idUsuario, userId);
      //     });

      // });

      // era exibido a paginação, resolvido tirar em 01/02/2019

      // var contarQtdAulas = firebase.database().ref('cursos').child(curso_exibir_aulas).child('aulas');

      // contarQtdAulas.on('child_added', function (snapshot) {
      //     var item = snapshot.val();
      //     qtd_aulas += 1;

      //     $("#paginacao_aulas_id").append(`
      //         <li class="page-item"><button class="page-link" type="button" onclick="exibirSection('${item.id}', '${curso_exibir_aulas}')">Aula ${qtd_aulas}</a></li>
      //     `);

      // });
    }
  });
}

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
function createComment(idAula, nomeUsuario, idUsuario, userId) {
  var data_atual = RetornaDataHoraAtual();

  var newKeyComment = firebase
    .database()
    .ref()
    .child("comentarios")
    .push().key;

  var conteudo = textarea_comentario.value;

  if (conteudo !== "") {
    var data = {
      nome_usuario: nomeUsuario,
      id_usuario: idUsuario,
      user_id: userId,
      data_comentario: data_atual,
      key_comentario: newKeyComment,
      id_aula: idAula,
      conteudo_comentario: conteudo
    };

    return firebase
      .database()
      .ref()
      .child("comentarios")
      .child(newKeyComment)
      .set(data);
  } else {
    alert("O seu comentário está em branco!");
  }
}

function exibirSection(id, curso_exibir_aulas) {
  var listaUsuarios = firebase.database().ref("usuarios");

  var email = firebase.auth().currentUser.email;

  listaUsuarios.on("child_added", function(snapshot) {
    var itemUser = snapshot.val();
    if (itemUser.email_usuario == email) {
      var listaAulasCurso = firebase
        .database()
        .ref("cursos")
        .child(curso_exibir_aulas)
        .child("aulas");

      var contador = 0;

      listaAulasCurso.on("child_added", function(snapshot) {
        var item = snapshot.val();

        contador += 1;

        if (item.id == id) {
          if (item.url === "vazio") {
            document.getElementById("aulas_id").innerHTML = "";

            $("#aulas_id").append(`                    
                            <section id="${item.id}"}>
                                <br>
                                <div class="col-lg-1">
                                </div>
        
                                <div class="col-lg-10" id="aula_carregada_id">
                                <h2>${"Aula " +
                                  contador +
                                  " - " +
                                  item.nome}</h2>                        
                                    <br>
                                
                                    <h5>Descrição da aula:</h5>
                                
                                    <p>
                                        ${item.descricao}
                                    </p>
                                </div>
        
                                <div class="col-lg-1">
                                </div>
                            </section>
                                `);

            // document.getElementById("comentarios_id").innerHTML = "";

            // $("#comentarios_id").append(`
            // <ul>
            //     <li>João Arthur</li>
            //     <li>Jasdfasdfasdfasdfasd</li>
            // </ul>
            // `);
          } else {
            if (itemUser.status_premium === "Liberado") {
              document.getElementById("aulas_id").innerHTML = "";

              $("#aulas_id").append(`
                            <section id="${item.id}">
                                <br>
                            
                                <div class="col-lg-1">
                                </div>
        
                                <div class="col-lg-10" id="aula_carregada_id" >
                                <h2>${"Aula " +
                                  contador +
                                  " - " +
                                  item.nome}</h2>                        
                                
                                
                                    <video class="embed-responsive embed-responsive-21by9" controls controlsList="nodownload">
                                        <source src="${
                                          item.url
                                        }" type="video/mp4">
                                            Seu navegador não suporta a exibição de vídeos!
                                    </video>
                                
                                    <br>
                                    <h5>Descrição da aula:</h5>
                                    <p>
                                        ${item.descricao}
                                    </p>
                                </div>
        
                                <div class="col-lg-1">
                                </div>
                            </section>                  
        
                           `);
            } else if (itemUser.status_premium === "Pendente") {
              var user = firebase.auth().currentUser;

              var dataExpiraPremium = itemUser.data_expira_premium;
              var partesDataExpiraPremium = dataExpiraPremium.split("/");
              var dataExpiraPremiumNew = new Date(
                partesDataExpiraPremium[2],
                partesDataExpiraPremium[1] - 1,
                partesDataExpiraPremium[0]
              );

              if (dataExpiraPremiumNew < new Date()) {
                if (item.exibir_free === "Exibir") {
                  document.getElementById("aulas_id").innerHTML = "";

                  $("#aulas_id").append(`
                            <section id="${item.id}">
                                <br>
                            
                                <div class="col-lg-1">
                                </div>
        
                                <div class="col-lg-10" id="aula_carregada_id" >
                                <h2>${"Aula " +
                                  contador +
                                  " - " +
                                  item.nome}</h2>                        
                                
                                
                                    <video class="embed-responsive embed-responsive-21by9" controls controlsList="nodownload">
                                        <source src="${
                                          item.url
                                        }" type="video/mp4">
                                            Seu navegador não suporta a exibição de vídeos!
                                    </video>
                                
                                    <br>
                                    <h5>Descrição da aula:</h5>
                                    <p>
                                        ${item.descricao}
                                    </p>
                                </div>
        
                                <div class="col-lg-1">
                                </div>
                            </section>                  
        
                           `);
                } else {
                  document
                    .getElementById("link_abre_modal_pagamento_premium")
                    .click();
                }
              } else if (dataExpiraPremiumNew > new Date()) {
                if (user.emailVerified === true) {
                  document.getElementById("aulas_id").innerHTML = "";

                  $("#aulas_id").append(`
                              <section id="${item.id}">
                                  <br>
                              
                                  <div class="col-lg-1">
                                  </div>
          
                                  <div class="col-lg-10" id="aula_carregada_id" >
                                  <h2>${"Aula " +
                                    contador +
                                    " - " +
                                    item.nome}</h2>                        
                                  
                                  
                                      <video class="embed-responsive embed-responsive-21by9" controls controlsList="nodownload">
                                          <source src="${
                                            item.url
                                          }" type="video/mp4">
                                              Seu navegador não suporta a exibição de vídeos!
                                      </video>
                                  
                                      <br>
                                      <h5>Descrição da aula:</h5>
                                      <p>
                                          ${item.descricao}
                                      </p>
                                  </div>
          
                                  <div class="col-lg-1">
                                  </div>
                              </section>                  
          
                             `);
                } else if (user.emailVerified === false) {
                  alert("Confirme seu e-mail para liberar as aulas");
                }
              } else if (dataExpiraPremiumNew == new Date()) {
                if (user.emailVerified === true) {
                  document.getElementById("aulas_id").innerHTML = "";

                  $("#aulas_id").append(`
                              <section id="${item.id}">
                                  <br>
                              
                                  <div class="col-lg-1">
                                  </div>
          
                                  <div class="col-lg-10" id="aula_carregada_id" >
                                  <h2>${"Aula " +
                                    contador +
                                    " - " +
                                    item.nome}</h2>                        
                                  
                                  
                                      <video class="embed-responsive embed-responsive-21by9" controls controlsList="nodownload">
                                          <source src="${
                                            item.url
                                          }" type="video/mp4">
                                              Seu navegador não suporta a exibição de vídeos!
                                      </video>
                                  
                                      <br>
                                      <h5>Descrição da aula:</h5>
                                      <p>
                                          ${item.descricao}
                                      </p>
                                  </div>
          
                                  <div class="col-lg-1">
                                  </div>
                              </section>                  
          
                             `);
                } else if (user.emailVerified === false) {
                  alert("Confirme seu e-mail para liberar as aulas");
                }
              }
            }
          }
          // document.getElementById("comentarios_id").innerHTML = "";

          // $("#comentarios_id").append(`
          // <p>
          //     <h4>João Arthur</h4>
          //     <br>
          //     <p>Jasdfasdfasdfasdfasd</p>
          // </p>
          // `);
        }
      });
    }
  });
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
                        }', '${item.email_usuario}', '${item.nome_usuario}', '${item.key_usuario}') ">
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
  key_usuario
) {
  // preenche os campos do modal
  document.getElementById("nome_usuario_edit").value = nome_usuario;

  document.getElementById("email_usuario_edit").value = email_usuario;

  document.getElementById("celular_usuario_edit").value = celular_usuario;

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
        alert("Dados alterados com sucesso!");
        // fechar modal
        document.getElementById("fechar_modal").click();
      });
    }
  });
}
