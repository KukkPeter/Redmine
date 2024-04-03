class API {
    constructor(link = "http://localhost:8000") {
        this.Server = link;
    }

    async Post(url = "", data = {}) {
        const response = await fetch(this.Server + url, {
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
        return response.json(); 
    }

    async Get(url = "") {
        const response = await fetch(this.Server + url);
        return response.json();
    }
}
export default new API();