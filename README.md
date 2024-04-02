
# Rendszerfejlesztés - Redmine

**Első beadandó**

Határidő: *2024. április 4.*  
Feladat: Szerver - Kliens
  

# Útmutató

## NodeJS

A futtatáshoz szükséges környezetet innen tudják letölteni: [NodeJS](https://nodejs.org/en/download)

  

Mi a fejlesztés során a v20.12.0(LTS) verziót használtuk ezért érdemes ezt a verziót feltelepíteni a bonyodalmak elkerülése végett.

  

## Telepítés

A *beadando1* branch letöltése után parancssorból lehet elindítani a szervert és a klienst külön-külön.

**Szerver**

Könyvtárak telepítése:
```
cd server/
npm install
```

Ezután a server mappában található "*.env.example*" nevű fájlt átkell nevezni "*.env*"-re vagy egy "*.env*" nevű fájlt kell létrehozni aminek a tartalma megkell hogy egyezzen meg a "*.env.example*" nevű fájl tartalmával.

  

Ha ezzel megvagyunk akkor már csak futtatnunk kell a szervert:

```
npm run build
npm run watch
```

A szerver alapjáraton a **8000**-es PORT-ot használja. Ha ezt itt megváltoztatjuk, attól a kliens oldalon nem fog változni, ezért ennek a változtatását **nem** javasoljuk!

 
Ha fut a szerver akkor a Swagger Dokumentációt elérhetik a [http://localhost:8000/docs](http://localhost:8000/docs) link alatt.

  

**Kliens**
Könyvtárak telepítése:
```
cd client/
npm install
```

Kliens futtatása:
```
npm start
```

A kliens alapjáraton a **3000**-es PORT-ot használja. Ezt itt nyugodtan változtathatjuk a *frontend.js* fájlban.

Ha futtatjuk a klienst akkor a [http://localhost:3000/](http://localhost:3000/) oldalon elérhetjük azt.
