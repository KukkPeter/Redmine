async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data),
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

function login(){
  var email = document.getElementById('floatingInput').value;
  var password = document.getElementById('floatingPassword').value;

  postData("http://localhost:8000/user/login", {email: email, password: password}).then((data) => {
    if(data.status == "200") {
      // Sikeres bejelentkezés
      console.log(data.data);
      alert('Sikeres bejelentkezés!');

      localStorage.setItem('user', data.data);
      window.location.replace('http://localhost:3000/main');
    } else {
      // Sikertelen bejelentkezés
      alert('Hibás email cím vagy jelszó! Kérlek próbáld újra késöbb.');
    }
  });
}

function checkLogin() {
  if(localStorage.getItem('user') == null) {
    window.location.replace('http://localhost:3000/');
  }
}

function loadProjects() {
  fetch('http://localhost:8000/projects')
    .then((res) => res.json())
    .then((data) => {
      if(data.status == "200") {
        // Sikeres lekérés
        data.data.forEach(e => {
          document.getElementById('project-table').innerHTML += `<tr id="project-${e.id}"><td>${e.name}</td><td>${e.description}</td><td>valamennyi</td><td>${e.type_id}</td></tr>`;
        });
      } else {
        // Sikertelen lekérés
        console.error(data);
      }
    })
}

const MainPage = async () => {
  await checkLogin();

  loadProjects();
}