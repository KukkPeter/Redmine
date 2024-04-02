const taskModal = new bootstrap.Modal('#taskModal', {backdrop: true, focus: true, keyboard: false});
const newTaskModal = new bootstrap.Modal('#newTaskModal', {backdrop: true, focus: true, keyboard: false});

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
          document.getElementById('project-table').innerHTML += `<tr onclick="selectProject(${e.id})" style="cursor: pointer;" id="project-${e.id}"><td>${e.name}</td><td>${e.description}</td><td>valamennyi</td><td>${e.type_id}</td></tr>`;
        });
      } else {
        // Sikertelen lekérés
        console.error(data);
      }
    });
}

function selectProject(id) {
  document.getElementById('tasksTable').innerHTML = "";
  document.getElementById('projectIDSpan').innerHTML = id;

  fetch(`http://localhost:8000/projects/${id}/tasks`)
    .then((res) => res.json())
    .then((data) => {
      if(data.status == "200") {
        // Sikeres lekérdezés
        data.data.forEach(e => {
          document.getElementById('tasksTable').innerHTML += `<tr id="task-${e.id}"><td>${e.name}</td><td>${e.description}</td><td>${e.user_id}</td><td>${e.deadline}</td></tr>`;
        });
        taskModal.show();
      } else {
        // Sikertelen lekérdezés
        console.error(data);
      }
    });
}

function loadDevelopersList() {
  fetch('http://localhost:8000/developers')
    .then((res) => res.json())
    .then((data) => {
      if(data.status == "200") {
        // Sikeres lekérdezés
        data.data.forEach(e => {
          document.getElementById('developersSelectList').innerHTML += `<option value="${e.id}">${e.name}</option>`
        });
        
        newTaskModal.show();
      } else {
        // Sikertelen lekérdezés
        console.error(data);
      }
    });


}

function addNewTask() {
  let projectId = document.getElementById('projectIDSpan').innerHTML;

  let name = document.getElementById('newTaskName').value;
  let desc = document.getElementById('newTaskDesc').value;
  let devID = document.getElementById('developersSelectList').value;

  postData(`http://localhost:8000/projects/${projectId}/newTask`, { name: name, description: desc, developer_id: devID }).then((data) => {
    if(data.status == "200") {
      // Sikeres lekérdezés
      alert('Feladat hozzáadva a projekthez!');
      newTaskModal.hide();
      document.getElementById('newTaskName').value = "";
      document.getElementById('newTaskDesc').value = "";
      document.getElementById('developersSelectList').innerHTML = "<option selected>Válassz fejlesztőt</option>";
    } else {
      // Sikertelen lekérdezés
      console.error(data);
    }
  });
}

const MainPage = async () => {
  await checkLogin();

  loadProjects();
}