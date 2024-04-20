import API from './api.js';

class Authenticator {
    constructor() { }

    checkAuth(loginPage = false) {
        if(loginPage) {
            if(localStorage.getItem('token') != null) {
                window.location.replace('http://localhost:3000/main');
            }
        } else {
            if(localStorage.getItem('token') == null) {
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
            API.Post("/user/login", { email: email, password: password }).then(res => {
                // Sikeres bejelentkezés
                alert(res.message);
                console.log(res);
                        
                localStorage.setItem('token', res.data.toString());
                window.location.replace('http://localhost:3000/main');
            }).catch(error => {
                // Sikertelen bejelentkezés
                alert('Hibás email cím vagy jelszó! Kérlek próbáld újra késöbb.');
                console.error(error);
            });
        }
    }

    logout() {
        API.Post('/user/logout').then(res => {
            localStorage.clear();window.location.replace('http://localhost:3000');
            alert(res.message);
        }).catch(error => {
            console.error(error);
        });
    }
}
(function() {
    window.Auth = new Authenticator();
})();