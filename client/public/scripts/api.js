class API {
    constructor(link = "http://localhost:8000") {
        this.Server = link;
    }

    async ShowToast(text, style = "primary") {
      let toast = `<div class="toast text-bg-${style}" role="alert" id="myToast" aria-live="assertive" aria-atomic="true">
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

      $('#toastContainer').html(toast);

      $('#myToast').toast('show');
    }

    async Post(url = "", data = {}) {
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
            return resolve(data);
          } else {
            this.ShowToast('Hiba történt a művelet során! Hiba kód a consoleban.', 'danger');
            return reject(data);
          }
        }); 
      });
    }

    async Get(url = "") {
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
            return resolve(data);
          } else {
            this.ShowToast('Hiba történt a művelet során! Hiba kód a consoleban.', 'danger');
            return reject(data);
          }
        })
      });
    }

    async Delete(url = "") {
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
            return resolve(data);
          } else {
            this.ShowToast('Hiba történt a művelet során! Hiba kód a consoleban.', 'danger');
            return reject(data);
          }
        }); 
      });
    }
}
export default new API();