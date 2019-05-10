// Buttons
var loginButton = document.getElementById("loginButton");
// var authFacebookButton = document.getElementById('authFacebookButton');
// var authTwitterButton = document.getElementById('authTwitterButton');
// var authGoogleButton = document.getElementById('authGoogleButton');
// var authGitHubButton = document.getElementById('authGitHubButton');
// var authAnonymouslyButton = document.getElementById('authAnonymouslyButton');
// var createUserButton = document.getElementById('createUserButton');
var logOutButton = document.getElementById("loginButton");

// Inputs
var emailInput = document.getElementById("emailInput");
var passwordInput = document.getElementById("passwordInput");

// Displays
var displayName = document.getElementById("displayName");

// Criar novo usuário
// createUserButton.addEventListener('click', function () {
//     firebase
//         .auth()
//         .createUserWithEmailAndPassword(emailInput.value, passwordInput.value)
//         .then(function () {
//             alert('Bem vindo ' + emailInput.value);
//         })
//         .catch(function (error) {
//             console.error(error.code);
//             console.error(error.message);
//             alert('Falha ao cadastrar, verifique o erro no console.')
//         });
// });

passwordInput.addEventListener("keyup", function(e) {
  var key = e.which || e.keyCode;
  if (key == 13) {
    firebase
      .auth()
      .signInWithEmailAndPassword(emailInput.value, passwordInput.value)
      .then(function(result) {
        window.location.href = "pagina-inicial.html";
      })
      .catch(function(error) {
        // console.error(error.code);
        // console.error(error.message);
        alert("Falha ao autenticar, verifique usuário e senha.");
      });
  }
});

emailInput.addEventListener("keyup", function(e) {
  var key = e.which || e.keyCode;
  if (key == 13) {
    passwordInput.focus();
  }
});

// Autenticar com E-mail e Senha
loginButton.addEventListener("click", function() {
  firebase
    .auth()
    .signInWithEmailAndPassword(emailInput.value, passwordInput.value)
    .then(function(result) {
      window.location.href = "pagina-inicial.html";
    })
    .catch(function(error) {
      // console.error(error.code);
      // console.error(error.message);
      alert("Falha ao autenticar, verifique usuário e senha.");
    });
});

// // Logout
// logOutButton.addEventListener('click', function () {
//     firebase
//         .auth()
//         .signOut()
//         .then(function () {
//             // displayName.innerText = 'Você não está autenticado';
//             alert('Você se deslogou');
//             window.location.replace("index.html");
//         }, function (error) {
//             console.error(error);
//         });
// });

// // Autenticar Anônimo
// authAnonymouslyButton.addEventListener('click', function () {
//     firebase
//         .auth()
//         .signInAnonymously()
//         .then(function (result) {
//             console.log(result);
//             displayName.innerText = 'Bem vindo, desconhecido';
//             alert('Autenticado Anonimamente');
//         })
//         .catch(function (error) {
//             console.error(error.code);
//             console.error(error.message);
//             alert('Falha ao autenticar, verifique o erro no console.')
//         });
// });

// // Autenticar com GitHub
// authGitHubButton.addEventListener('click', function () {
//     // Providers
//     var provider = new firebase.auth.GithubAuthProvider();
//     signIn(provider);
// });

// // Autenticar com Google
// authGoogleButton.addEventListener('click', function () {
//     // Providers
//     var provider = new firebase.auth.GoogleAuthProvider();
//     signIn(provider);
// });

// // Autenticar com Facebook
// authFacebookButton.addEventListener('click', function () {
//     // Providers
//     var provider = new firebase.auth.FacebookAuthProvider();
//     signIn(provider);
// });

// // Autenticar com Twitter
// authTwitterButton.addEventListener('click', function () {
//     // Providers
//     var provider = new firebase.auth.TwitterAuthProvider();
//     signIn(provider);
// });

function signIn(provider) {
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(function(result) {
      console.log(result);
      var token = result.credential.accessToken;
      displayName.innerText = "Bem vindo, " + result.user.displayName;
    })
    .catch(function(error) {
      console.log(error);
      alert("Falha na autenticação");
    });
}
