function login(){
    var email = document.getElementById('floatingInput').value;
    var password = document.getElementById('floatingPassword').value;

    // Előre beállított felhasználónév és jelszó
    var correctEmail = "asd";
    var correctPassword = "asd";

    // Ellenőrzés
    if (email === correctEmail && password === correctPassword) {
      alert("Sikeres bejelentkezés!");
        window.location.replace("main.html")
    } else {
      alert("Hibás felhasználónév vagy jelszó!");
    }

    return false;
}