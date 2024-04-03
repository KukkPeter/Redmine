import API from './api.js';

class Authenticator {
    constructor() { }

    checkAuth(loginPage = false) {
        if(loginPage) {
            if(localStorage.getItem('user') != null) {
                window.location.replace('http://localhost:3000/main');
            }
        } else {
            if(localStorage.getItem('user') == null) {
                window.location.replace('http://localhost:3000/');
            }
        }
    }

    login() {
        let email = document.getElementById('floatingInput').value;
        let password = document.getElementById('floatingPassword').value;
        let regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        if(!email || !password) {
            alert('Nem adtál meg se email címet se jelszót!');
        } else if(!email.match(regex)) {
            alert('Hibás email cím!');
        } else {
            API.Post("/user/login", { email: email, password: password }).then((data) => {
              if(data.status == "200") {
                // Sikeres bejelentkezés
                alert('Sikeres bejelentkezés!');
          
                localStorage.setItem('user', JSON.stringify(data.data));
                window.location.replace('http://localhost:3000/main');
              } else {
                // Sikertelen bejelentkezés
                alert('Hibás email cím vagy jelszó! Kérlek próbáld újra késöbb.');
              }
            });
        }
    }

    logout() {
        API.Post('/user/logout').then((data) => {
            if(data.status=="200") {
                // Sikeres lekérdezés
                localStorage.clear();
                window.location.replace('http://localhost:3000');
            } else {
                // Sikertelen lekérdezés
                console.error(data);
            }
        });
    }
}
(function() {
    window.Auth = new Authenticator();
})();