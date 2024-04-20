class API {
    constructor(link = "http://localhost:8000") {
        this.Server = link;
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
          headers: headers
        });

        response.json().then(data => {
          if(data.status == 200) {
            resolve(data);
          } else {
            reject(data);
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
          referrerPolicy: "no-referrer",
          body: JSON.stringify(data),
        });
        
        response.json().then(data => {
          if(data.status == 200) {
            return resolve(data);
          } else {
            return reject(data);
          }
        }); 
      });
    }
}
export default new API();