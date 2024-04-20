import API from './api.js';

class MainPage {
    constructor() {
        $('#btnCheck').attr("showOwnTasks", false);
    }

    loadProjects() {
        API.Get('/projects').then(res => {
            // Sikeres lekérdezés
            API.Get('/types').then(types_res => {
                // Sikeres lekérdezés

                // Szűrő feltöltése
                types_res.data.forEach(e => {
                    document.getElementById('sortDropdown').innerHTML += `<li><a class="dropdown-item" onclick="Main.sortList('${e.name}')" href="#">${e.name}</a></li>`;
                });
                document.getElementById('sortDropdown').innerHTML += `<li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" onclick="Main.resetSort()" href="#">Szűrő visszaállítása</a></li>`;

                // Tábla feltöltése
                res.data.forEach(e => {
                    let type = types_res.data.find(x => x.id == e.type_id);

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
            }).catch(err => {
                // Sikertelen lekérdezés
                console.error(err);
            });
        }).catch(err => {
            // Sikertelen lekérdezés
            console.error(err);
        });
    }

    selectProject(id) {
        document.getElementById('tasksTable').innerHTML = "";
        document.getElementById('developersTable').innerHTML = "";
        document.getElementById('projectIDSpan').innerHTML = id;

        document.getElementById('btnCheck').checked = false;
        $('#btnCheck').attr("showOwnTasks", false);

        // Cím betöltése
        API.Get(`/projects/${id}`).then(res => {
            // Sikeres lekérdezés
            document.getElementById('taskModalTitle').innerHTML = `Projekt: ${res.data.name}`;            
        }).catch(err => {
            // Sikertelen lekérdezés
            console.error(err);
        });

        // Feladatok betöltése
        API.Get(`/projects/${id}/tasks`).then(res => {
            // Sikeres lekérdezés
            res.data.forEach(e => {
                API.Get(`/user/${e.user_id}`).then(res_user => {
                    // Sikeres lekérdezés
                    let deadLine = new Date(parseInt(e.deadline));
                    let data = "";
                    if(deadLine.setHours(0,0,0,0) < new Date().setHours(0,0,0,0)) {
                        data = ` class="bg-danger text-white"`;
                    }

                    if(deadLine.setHours(0,0,0,0) == new Date().setHours(0,0,0,0)) {
                        data = ` class="bg-warning"`;
                    }
                    
                    document.getElementById('tasksTable').innerHTML += `<tr id="task-${e.id}-${e.user_id}">
                        <td>${e.name}</td>
                        <td>${e.description}</td>
                        <td${data}>${new Date(parseInt(e.deadline)).toLocaleDateString()}</td>
                        <td>${res_user.data.name}</td>
                    </tr>`;
                }).catch(err => {
                    // Sikertelen lekérdezés
                    console.error(err);
                });
            });
            $('#taskModal').modal('show');
        }).catch(err => {
            // Sikertelen lekérdezés
            console.error(err);
        });

        // Fejlesztők betöltése
        API.Get(`/projects/${id}/developers`).then(res => {
            // Sikeres lekérdezés -- /projects/id/developers
            res.data.forEach(e => {
                API.Get(`/developers/${e.id}`).then(res_developer => {
                    // Sikeres lekérdezés -- /developers/{id}
                    document.getElementById('developersTable').innerHTML += `<tr id="developer-${id}-${e.developer_id}">
                        <td>${res_developer.data.name}</td>    
                        <td>${res_developer.data.email}</td>
                    </tr>`;
                }).catch(err => {
                    // Sikertelen lekérdezés -- /developers/{id}
                    console.error(err);
                });
            });
        }).catch(err => {
            // Sikertelen lekérdezés -- /projects/id/developers
            console.error(err);
        });
    }

    loadDevelopersList() {
        document.getElementById('developersSelectList').innerHTML = "<option selected>Válassz fejlesztőt</option>";
        API.Get('/developers').then(res => {
            // Sikeres lekérdezés
            res.data.forEach(e => {
                document.getElementById('developersSelectList').innerHTML += `<option value="${e.id}">${e.name}</option>`
            });       
            $('#newTaskModal').modal('show');
        }).catch(err => {
            // Sikertelen lekérdezés
            console.error(err);
        });
    }

    addNewTask() {
        let projectId = document.getElementById('projectIDSpan').innerHTML;

        let name = document.getElementById('newTaskName').value;
        let desc = document.getElementById('newTaskDesc').value;
        let devID = document.getElementById('developersSelectList').value;

        if(!name || !desc || !devID) {
            API.ShowToast('Kérlek töltsd ki az összes mezőt!', 'warning');
        } else {
            API.Get('/user/myself').then(res_self => {
                // Sikeres lekérdezés
                API.Post(`/projects/${projectId}/newTask`, { name: name, description: desc, developer_id: devID, manager_id: res_self.data.id }).then(res => {
                    // Sikeres lekérdezés
                    API.Toast(res.message, 'success');
    
                    $('#newTaskModal').modal('hide');
                    document.getElementById('newTaskName').value = "";
                    document.getElementById('newTaskDesc').value = "";
                    document.getElementById('developersSelectList').innerHTML = "<option selected>Válassz fejlesztőt</option>";
                }).catch(err => {
                    // Sikertelen lekérdezés
                    console.error(err);
                });
            }).catch(err => {
                // Sikertelen lekérdezés
                console.error(err);
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
        API.Get('/user/myself').then(res => {
            // Sikeres lekérdezés
            let userId = res.data.id;
            let table = document.getElementById('tasksTable');

            if($('#btnCheck').attr('showOwnTasks') == 'true') {
                $('#btnCheck').attr('showOwnTasks', false);
                for (var i = 0, row; row = table.rows[i]; i++) {
                    for (var j = 0, col; col = row.cells[j]; j++) {
                        if(j == 2 && row.id.split('-')[2] != userId) {
                            row.style="";
                        }
                    }  
                }
            } else {
                $('#btnCheck').attr('showOwnTasks', true);
                for (var i = 0, row; row = table.rows[i]; i++) {
                    for (var j = 0, col; col = row.cells[j]; j++) {
                        if(j == 2 && row.id.split('-')[2] != userId) {
                            row.style="display:none;";
                        }
                    }  
                }
            }
        }).catch(err => {
            // Sikertelen lekérdezés
            console.error(err);
        });
    }
}

(function() {
    window.Main = new MainPage();
    window.API = API;
    // "Bejelentkezve, mint ..." szöveg feltöltése
    API.Get('/user/myself').then(res => {
        // Sikeres lekérdezés
        document.getElementById('loggedInUsername').innerHTML = res.data.name;
    }).catch(err => {
        // Sikertelen lekérdezés
        console.log(err);
    });

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