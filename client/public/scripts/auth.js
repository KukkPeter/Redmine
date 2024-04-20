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
                } else if(location.href.split('#')[1] == "tokenExpired") {
                    API.ShowToast("Lejárt a munkameneted! Jelentkezz be újra a folytatáshoz.", "warning");
                }
            }
        } else {
            if(localStorage.getItem('token') == null) {
                window.location.replace('http://localhost:3000/');
            }
            API.Get('/user/myself').then(res => {
                // Sikeres lekérdezés
                localStorage.setItem('tokenExperation', res.data.tokenExperation.toString() + "000");
                API.ShowToast(`Sikeresen bejelentkezve, mint <strong>${res.data.manager.name}</strong>!`, "success");
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
                localStorage.setItem('token', res.data.toString());
                window.location.replace('http://localhost:3000/main');
            }).catch(error => {
                // Sikertelen bejelentkezés
                API.ShowToast(error.message, 'danger');
                console.error(error);
            });
        }
    }

    register() {
        let name = $('#floatingInputName').val();
        let email = $('#floatingInputEmail').val();
        let pwd = $('#floatingPassword').val();
        let pwdAgain = $('#floatingPasswordAgain').val();

        let regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        if(!name || !email || !pwd || !pwdAgain) {
            API.ShowToast('Nem adtál meg valamilyen adatot!', 'danger');
        } else if(!email.match(regex)) {
            API.ShowToast('Hibás email cím!', 'danger');
        } else if(pwd != pwdAgain) {
            API.ShowToast('A jelszó és a jelszó megerősítő nem egyezik!', 'danger');
        } else {
            API.Post("/user/register", { name: name, email: email, password: pwd, passwordAgain: pwdAgain }).then(res => {
                // Sikeres lekérdezés                        
                API.ShowToast(res.message, 'success');
                
                $('#floatingInputName').val("");
                $('#floatingInputEmail').val("");
                $('#floatingPassword').val("");
                $('#floatingPasswordAgain').val("");
            }).catch(error => {
                // Sikertelen lekérdezés
                API.ShowToast(error.message, 'danger');
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