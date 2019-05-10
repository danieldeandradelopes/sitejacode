
var user = firebase.auth().currentUser;
var email;

function retornaUsuario() {
    if (user != null) {
        email = user.email;
    }

    return email;
}
