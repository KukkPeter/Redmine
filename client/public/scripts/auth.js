import API from './api.js';

class Authenticator {
    constructor() { }

    checkAuth(loginPage = false) {
        if(loginPage) {
            if(localStorage.getItem('token') != null) {
                window.location.replace('http://localhost:3000/main');
            } else {
                if(location.href.split('#')[1] == "logout") {
                    API.ShowToast("Sikeres kijelentkezés!", "success");
                }
            }
        } else {
            if(localStorage.getItem('token') == null) {
                window.location.replace('http://localhost:3000/');
            }
            API.Get('/user/myself').then(res => {
                // Sikeres lekérdezés
                API.ShowToast(`Sikeresen bejelentkezve, mint <strong>${res.data.name}</strong>!`, "success");
            }).catch(err => {
                // Sikertelen lekérdezés
                console.err(err);
            });
        }
    }

    login() {
        let email = document.getElementById('floatingInput').value;
        let password = document.getElementById('floatingPassword').value;
        let regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        if(!email || !password) {
            API.ShowToast('Nem adtál meg se email címet se jelszót!', 'danger');
        } else if(!email.match(regex)) {
            API.ShowToast('Hibás email cím!', 'danger');
        } else {
            API.Post("/user/login", { email: email, password: password }).then(res => {
                // Sikeres bejelentkezés
                console.log(res);
                        
                localStorage.setItem('token', res.data.toString());
                window.location.replace('http://localhost:3000/main');
            }).catch(error => {
                // Sikertelen bejelentkezés
                API.ShowToast('Hibás email cím vagy jelszó! Kérlek próbáld újra késöbb.', 'danger');
                console.error(error);
            });
        }
    }

    logout() {
        API.Post('/user/logout').then(res => {
            console.log(res);
            localStorage.clear();
            window.location.replace('http://localhost:3000#logout');
        }).catch(error => {
            console.error(error);
        });
    }
}
(function() {
    window.Auth = new Authenticator();
})();