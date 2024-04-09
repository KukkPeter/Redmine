import API from './api.js';

class MainPage {
    constructor() {
        this.showOwnTasks = false;
    }

    loadProjects() {
        API.Get('/projects').then((data) => {
            if(data.status == "200") {
                // Sikeres lekérés
                API.Get('/types').then((types_data) => {
                    if(types_data.status == "200") {
                        // Sikeres lekérdezés

                        // Szűrő feltöltése
                        types_data.data.forEach(e => {
                            document.getElementById('sortDropdown').innerHTML += `<li><a class="dropdown-item" onclick="Main.sortList('${e.name}')" href="#">${e.name}</a></li>`;
                        });
                        document.getElementById('sortDropdown').innerHTML += `<li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item" onclick="Main.resetSort()" href="#">Szűrő visszaállítása</a></li>`;

                        // Tábla feltöltése
                        data.data.forEach(e => {
                            let type = types_data.data.find(x => x.id == e.type_id);
    
                            if(type) {
                                document.getElementById('project-table').innerHTML += `<tr onclick="Main.selectProject(${e.id})" style="cursor: pointer;" id="project-${e.id}">
                                    <td>${e.name}</td>
                                    <td>${e.description}</td>
                                    <td>${type.name}</td>
                                </tr>`;
                            } else {
                                document.getElementById('project-table').innerHTML += `<tr onclick="Main.selectProject(${e.id})" style="cursor: pointer;" id="project-${e.id}">
                                    <td>${e.name}</td>
                                    <td>${e.description}</td>
                                    <td>${e.type_id}</td>
                                </tr>`;
                            }    
                        });
                    } else {
                        // Sikertelen lekérés
                        console.error(types_data.data);
                    }
                });
            } else {
                // Sikertelen lekérés
                console.error(data.data);
            }
        });
    }

    selectProject(id) {
        document.getElementById('tasksTable').innerHTML = "";
        document.getElementById('developersTable').innerHTML = "";
        document.getElementById('projectIDSpan').innerHTML = id;

        document.getElementById('btnCheck').checked = false;
        this.showOwnTasks = false;

        // Cím betöltése
        API.Get(`/projects/${id}`).then((data) => {
            if(data.status == "200") {
                // Sikeres lekérdezés
                document.getElementById('taskModalTitle').innerHTML = `Projekt: ${data.data.name}`;
            } else {
                // Sikertelen lekérdezés
                console.error(data.data);
            }
        });

        // Feladatok betöltése
        API.Get(`/projects/${id}/tasks`).then((data) => {
            if(data.status == "200") {
                // Sikeres lekérdezés -- /projects/{id}/tasks
                data.data.forEach(e => {
                    API.Get(`/user/${e.user_id}`).then((user_data) => {
                        if(user_data.status == "200") {
                            // Sikeres lekérdezés -- /user/{id}
                            let deadLine = new Date(e.deadline);
                            let data = "";
                            if(deadLine.setHours(0,0,0,0) == new Date().setHours(0,0,0,0)) {
                                data = ` class="text-danger"`;
                            }
                            
                            document.getElementById('tasksTable').innerHTML += `<tr id="task-${e.id}-${e.user_id}">
                                <td>${e.name}</td>
                                <td>${e.description}</td>
                                <td${data}>${new Date(e.deadline).toLocaleDateString()}</td>
                                <td>${user_data.data.name}</td>
                            </tr>`;
                        } else {
                            // Sikertelen lekérdezés -- /user/{id}
                            console.error(user_data.data);
                        }
                    });
                });
                $('#taskModal').modal('show');
            } else {
                // Sikertelen lekérdezés -- /projects/{id}/tasks
                console.error(data);
            }
        });

        // Fejlesztők betöltése
        API.Get(`/projects/${id}/developers`).then((data) => {
            if(data.status == "200") {
                // Sikeres lekérdezés -- /projects/id/developers
                data.data.forEach(e => {
                    API.Get(`/developers/${e.developer_id}`).then((developer_data) => {
                        if(developer_data.status == "200") {
                            // Sikeres lekérdezés -- /developers/{id}
                            document.getElementById('developersTable').innerHTML += `<tr id="developer-${id}-${e.developer_id}">
                                <td>${developer_data.data.name}</td>    
                                <td>${developer_data.data.email}</td>
                            </tr>`;
                        } else {
                            // Sikertelen lekérdezés -- /developers/{id}
                            console.error(developer_data.data);
                        }
                    });
                });
            } else {
                // Sikertelen lekérdezés -- /projects/id/developers
                console.error(data.data);
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

    // "Bejelentkezve, mint ..." szöveg feltöltése
    document.getElementById('loggedInUsername').innerHTML = JSON.parse(localStorage.getItem('user')).name;

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