class API {
    constructor(link = "http://localhost:8000") {
      this.Server = link;

      this.Socket = io(this.Server);

      this.Socket.on('handshake', () => {
        console.log('%c[SOCKET] %cSikeresen kapcsolódva!', 'color: #fcec03', 'color: white');
      });

      this.Socket.on('deadTasks', (message) => {
        console.log('%c[SOCKET] %cÜzenet érkezett! (deadTasks)', 'color: #fcec03', 'color: white');
        let names = "";
        message.forEach(element => {
          if(names === "") names += element.name;
          else names += `, ${element.name}`;
        });

        this.ShowToast(`Ezek a feladatok lejártak: ${names}.`, 'danger');
      });
      
      this.Socket.on('almostDeadTasks', (message) => {
        console.log('%c[SOCKET] %cÜzenet érkezett! (almostDeadTasks)', 'color: #fcec03', 'color: white');
        let names = "";
        message.forEach(element => {
          if(names === "") names += element.name;
          else names += `, ${element.name}`;
        });

        this.ShowToast(`Ezek a feladatok hamarosan lejárnak: ${names}.`, 'warning');
      });
    }

    async ShowToast(text, style = "primary") {
      let random = Date.now() + `_${Math.floor(Math.random() * 1000)}`;
      let toast = `<div class="toast text-bg-${style}" role="alert" id="myToast_${random}" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
          <img src="http://localhost:3000/icon.png" class="rounded me-2" alt="Redmine Icon" width="20">
          <strong class="me-auto">Redmine</strong>
          <small>3-as Csapat</small>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          ${text}
        </div>
      </div>`;

      //$('#toastContainer').html(toast);
      document.getElementById('toastContainer').innerHTML += toast;

      $(`#myToast_${random}`).toast('show');

      setTimeout(function() {
        $(`#myToast_${random}`).fadeOut("slow", function() {
          this.remove();
        });
      }, 3000);
    }

    async checkTimeout() {
      let timeStamp = localStorage.getItem('tokenExperation');
      let diff = parseInt(timeStamp) - Date.now();
      if(diff < 10) {
        localStorage.clear();
        window.location.href="http://localhost:3000/#tokenExpired";
      } else {
        // TOKEN VALID
        //console.info("%cTOKEN VALID", 'color: #32a852');
      }
    }

    async Post(url = "", data = {}) {
      await this.checkTimeout();

      let headers = {
        "Content-Type": "application/json",
      };

      if(localStorage.getItem('token') != null) {
        headers["Authorization"] = `Bearer ${localStorage.getItem('token')}`;
      }

      return new Promise(async (resolve, reject) => {
        const response = await fetch(this.Server + url, {
          method: "POST",
          mode: "cors",
          cache: "no-cache",
          credentials: "same-origin",
          headers: headers,
          redirect: "follow",
          referrerPolicy: "no-referrer",
          body: JSON.stringify(data),
        });
        
        response.json().then(data => {
          if(data.status == 200) {
            console.log(`%c[API] %cPost kérés! (${url})`, 'color: #03c6fc', 'color: white');
            return resolve(data);
          } else {
            this.ShowToast('Hiba történt a művelet során! Hiba a consoleban.', 'danger');
            return reject(data);
          }
        }); 
      });
    }

    async Get(url = "") {
      await this.checkTimeout();

      let headers = {
        "Content-Type": "application/json",
      };

      if(localStorage.getItem('token') != null) {
        headers["Authorization"] = `Bearer ${localStorage.getItem('token').toString()}`;
      }

      return new Promise(async (resolve, reject) => {
        const response = await fetch(this.Server + url, {
          mode: "cors",
          cache: "no-cache",
          credentials: "same-origin",
          headers: headers,
          redirect: "follow",
          referrerPolicy: "no-referrer"
        });

        response.json().then(data => {
          if(data.status == 200) {
            console.log(`%c[API] %cGET kérés! (${url})`, 'color: #03c6fc', 'color: white');
            return resolve(data);
          } else {
            this.ShowToast('Hiba történt a művelet során! Hiba a consoleban.', 'danger');
            return reject(data);
          }
        })
      });
    }

    async Delete(url = "") {
      await this.checkTimeout();

      let headers = {
        "Content-Type": "application/json",
      };

      if(localStorage.getItem('token') != null) {
        headers["Authorization"] = `Bearer ${localStorage.getItem('token').toString()}`;
      }

      return new Promise(async (resolve, reject) => {
        const response = await fetch(this.Server + url, {
          method: "DELETE",
          mode: "cors",
          cache: "no-cache",
          credentials: "same-origin",
          headers: headers,
          redirect: "follow",
          referrerPolicy: "no-referrer"
        });
        
        response.json().then(data => {
          if(data.status == 200) {
            console.log(`%c[API] %cDELETE kérés! (${url})`, 'color: #03c6fc', 'color: white');
            return resolve(data);
          } else {
            this.ShowToast('Hiba történt a művelet során! Hiba kód a consoleban.', 'danger');
            return reject(data);
          }
        }); 
      });
    }

    async SendMessage(type, message) {
      if(this.Socket) {
        console.log(`%c[SOCKET] %cÜzenet elküldve! (${type})`, 'color: #fcec03', 'color: white');
        this.Socket.emit(type, message);
      } else console.error("Socket hiba!");
    }
}
export default new API();