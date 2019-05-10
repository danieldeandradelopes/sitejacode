var logOutButton = document.getElementById('logOutButton');

// Logout
logOutButton.addEventListener('click', function () {
    firebase
        .auth()
        .signOut()
        .then(function () {            
            window.location.replace("index.html");
        }, function (error) {
            console.error(error);
        });
});

