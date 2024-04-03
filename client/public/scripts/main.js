import API from './api.js';

class MainPage {
    constructor() {
        this.showOwnTasks = false;
    }

    loadProjects() {
        API.Get('/projects').then((data) => {
            if(data.status == "200") {
                // Sikeres lekérés
                data.data.forEach(e => {
                    document.getElementById('project-table').innerHTML += `<tr onclick="Main.selectProject(${e.id})" style="cursor: pointer;" id="project-${e.id}">
                        <td>${e.name}</td>
                        <td>${e.description}</td>
                        <td>${e.type_id}</td>
                    </tr>`;
                });
            } else {
                // Sikertelen lekérés
                console.error(data);
            }
        });
    }

    selectProject(id) {
        document.getElementById('tasksTable').innerHTML = "";
        document.getElementById('projectIDSpan').innerHTML = id;

        document.getElementById('btnCheck').checked = false;
        this.showOwnTasks = false;

        API.Get(`/projects/${id}/tasks`).then((data) => {
            if(data.status == "200") {
                // Sikeres lekérdezés
                data.data.forEach(e => {
                    document.getElementById('tasksTable').innerHTML += `<tr id="task-${e.id}-${e.user_id}"><td>${e.name}</td><td>${e.description}</td><td>0</td><td>${e.deadline}</td></tr>`;
                });
                $('#taskModal').modal('show');
            } else {
                // Sikertelen lekérdezés
                console.error(data);
            }
        });
    }

    loadDevelopersList() {
        document.getElementById('developersSelectList').innerHTML = "<option selected>Válassz fejlesztőt</option>";
        API.Get('/developers').then((data) => {
            if(data.status == "200") {
                // Sikeres lekérdezés
                data.data.forEach(e => {
                    document.getElementById('developersSelectList').innerHTML += `<option value="${e.id}">${e.name}</option>`
                });       
                $('#newTaskModal').modal('show');
            } else {
                // Sikertelen lekérdezés
                console.error(data);
            }
        });
    }

    addNewTask() {
        let projectId = document.getElementById('projectIDSpan').innerHTML;

        let name = document.getElementById('newTaskName').value;
        let desc = document.getElementById('newTaskDesc').value;
        let devID = document.getElementById('developersSelectList').value;

        let userId = JSON.parse(localStorage.getItem('user')).id;

        if(!name || !desc || !devID) {
            alert('Kérlek töltsd ki az összes mezőt!');
        } else {
            API.Post(`/projects/${projectId}/newTask`, { name: name, description: desc, developer_id: devID, manager_id: userId }).then((data) => {
                if(data.status == "200") {
                    // Sikeres lekérdezés
                    alert('Feladat hozzáadva a projekthez!');
    
                    $('#newTaskModal').modal('hide');
                    document.getElementById('newTaskName').value = "";
                    document.getElementById('newTaskDesc').value = "";
                    document.getElementById('developersSelectList').innerHTML = "<option selected>Válassz fejlesztőt</option>";
                } else {
                    // Sikertelen lekérdezés
                    console.error(data);
                }
            });
        }
        
    }

    sortList(data) {
        this.resetSort();
        let table = document.getElementById('project-table');
        for (var i = 0, row; row = table.rows[i]; i++) {
            for (var j = 0, col; col = row.cells[j]; j++) {
                if(j == 2 && col.innerHTML != data) {
                    row.style = "display:none;cursor:pointer;";
                }
            }  
        }
    }

    resetSort() {
        let table = document.getElementById('project-table');
        for (var i = 0, row; row = table.rows[i]; i++) {
            for (var j = 0, col; col = row.cells[j]; j++) {
                row.style = "cursor:pointer;";
            }  
        }
    }

    sortTasks() {
        let userId = JSON.parse(localStorage.getItem('user')).id;
        let table = document.getElementById('tasksTable');
      
        if(this.showOwnTasks) {
            this.showOwnTasks = false;
            for (var i = 0, row; row = table.rows[i]; i++) {
                for (var j = 0, col; col = row.cells[j]; j++) {
                    if(j == 2 && row.id.split('-')[2] != userId) {
                        row.style="";
                    }
                }  
            }
        } else {
            this.showOwnTasks = true;
            for (var i = 0, row; row = table.rows[i]; i++) {
                for (var j = 0, col; col = row.cells[j]; j++) {
                    if(j == 2 && row.id.split('-')[2] != userId) {
                        row.style="display:none;";
                    }
                }  
            }
        }
    }
}

(function() {
    window.Main = new MainPage();

    // Projektek betöltése
    window.Main.loadProjects();

    // Kijelentkezés gomb
    document.getElementById('btnLogout').addEventListener('click', window.Auth.logout);

    // Sajat feladatok megtekintese gomb
    document.getElementById('btnCheck').addEventListener('click', window.Main.sortTasks);

    // Új feladat hozzáadása gomb
    document.getElementById('btnAddNewTask').addEventListener('click', window.Main.loadDevelopersList);

    // Hozzáadás gomb
    document.getElementById('btnNewTask').addEventListener('click', window.Main.addNewTask);
})();