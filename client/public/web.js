const taskModal = new bootstrap.Modal('#taskModal', {backdrop: true, focus: true, keyboard: false});
const newTaskModal = new bootstrap.Modal('#newTaskModal', {backdrop: true, focus: true, keyboard: false});
var showOwnTasks = false;

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
      alert('Sikeres bejelentkezés!');

      localStorage.setItem('user', JSON.stringify(data.data));
      window.location.replace('http://localhost:3000/main');
    } else {
      // Sikertelen bejelentkezés
      alert('Hibás email cím vagy jelszó! Kérlek próbáld újra késöbb.');
    }
  });
}

function logout() {
  postData("http://localhost:8000/user/logout", {}).then((data) => {
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
          document.getElementById('project-table').innerHTML += `<tr onclick="selectProject(${e.id})" style="cursor: pointer;" id="project-${e.id}"><td>${e.name}</td><td>${e.description}</td><td>${e.type_id}</td></tr>`;
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

  document.getElementById('btnCheck').checked = false;

  showOwnTasks = false;
  

  fetch(`http://localhost:8000/projects/${id}/tasks`)
    .then((res) => res.json())
    .then((data) => {
      if(data.status == "200") {
        // Sikeres lekérdezés
        data.data.forEach(e => {
          document.getElementById('tasksTable').innerHTML += `<tr id="task-${e.id}-${e.user_id}"><td>${e.name}</td><td>${e.description}</td><td>0</td><td>${e.deadline}</td></tr>`;
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

  let userId = JSON.parse(localStorage.getItem('user')).id;
  
  postData(`http://localhost:8000/projects/${projectId}/newTask`, { name: name, description: desc, developer_id: devID, manager_id: userId }).then((data) => {
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

function sortList(data) {
  resetSort();
  let table = document.getElementById('project-table');
  for (var i = 0, row; row = table.rows[i]; i++) {
    for (var j = 0, col; col = row.cells[j]; j++) {
      if(j == 2 && col.innerHTML != data) {
        row.style = "display:none;cursor:pointer;";
      }
    }  
  }
}

function resetSort() {
  let table = document.getElementById('project-table');
  for (var i = 0, row; row = table.rows[i]; i++) {
    for (var j = 0, col; col = row.cells[j]; j++) {
      row.style = "cursor:pointer;";
    }  
  }
}

function sortTasks() {
  let userId = JSON.parse(localStorage.getItem('user')).id;
  let table = document.getElementById('tasksTable');

  if(showOwnTasks) {
    showOwnTasks = false;
    for (var i = 0, row; row = table.rows[i]; i++) {
      for (var j = 0, col; col = row.cells[j]; j++) {
        if(j == 2 && row.id.split('-')[2] != userId) {
          row.style="";
        }
      }  
    }
  } else {
    showOwnTasks = true;
    for (var i = 0, row; row = table.rows[i]; i++) {
      for (var j = 0, col; col = row.cells[j]; j++) {
        if(j == 2 && row.id.split('-')[2] != userId) {
          row.style="display:none;";
        }
      }  
    }
  }
}

// Main oldal onload metódusa
const MainPage = async () => {
  await checkLogin();

  loadProjects();
}