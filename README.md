
# Rendszerfejlesztés - Redmine
  
**Harmadik beadandó**  

Határidő: *2024. április 24.*   
Feladat: Authorizáció, Authentikáció
  
# Útmutató
## NodeJS  

A futtatáshoz szükséges környezetet innen tudják letölteni: [NodeJS](https://nodejs.org/en/download)
  
Mi a fejlesztés során a v20.12.0(LTS) verziót használtuk ezért érdemes ezt a verziót feltelepíteni a bonyodalmak elkerülése végett.

## XAMPP Control Panel
Az adatbázis működéséhez telepíteni kell a *XAMPP Control Panel*-t amin keresztül tudunk futtatni MySQL adatbázist.  

Innen tudják letölteni: [XAMPP Control Panel](https://www.apachefriends.org/download.html)
  
A telepítés után el kell indítani az Apache illetve a MySQL modult. Az Apache azért kell, elérjük az adatbázis kezelőfelületét, a "*phpmyadmin*"-t. 
  
Ha elindítottuk ezt a két modult, akkor a [http://localhost/phpmyadmin](http://localhost/phpmyadmin) oldalon elérjük ezt a felületet.
  
A felület megnyitása után a menüből válasszuk ki az **IMPORT** fület és importáljuk be a "*server/team_3_redmine.sql*" fájlt.
Ez az SQL fájl automatikusan létrehozza a *team_3_redmine* nevű adatbázist a benne használt táblákkal illetve fel is tölti azokat a táblákat adatokkal.
  
## Telepítés  

A *beadando1* branch letöltése után parancssorból lehet elindítani a szervert és a klienst külön-külön.  
  
**Szerver**  
Könyvtárak telepítése:  
```
cd server/
npm install
```
  
Ezután a server mappában található "*.env.example*" nevű fájlt átkell nevezni "*.env*"-re vagy egy "*.env*" nevű fájlt kell létrehozni aminek a tartalmának megkell hogy egyezzen meg a "*.env.example*" nevű fájl tartalmával.
  
Ha ezzel megvagyunk akkor már csak futtatnunk kell a szervert:
  
```
npm run build
npm run watch
```
  
**!!FONTOS!!**    
A szervert ne futassuk amíg az adatbázis nincs elindítva illetve nincsen beimportálva a *team_3_redmine.sql* fájl! 

A szerver alapjáraton a **8000**-es PORT-ot használja. Ha ezt itt megváltoztatjuk, attól a kliens oldalon nem fog változni és a kliens ezáltal használhatatlan lesz, ezért ennek a változtatását **nem** javasoljuk!  

Ha mégis változtatni akarják ezt a portot akkor ne felejtsék el változtatni a "*client/public/scripts/api.js*" fájl elején található constructorban is megváltoztatni a link portját! 
  
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
  
Ha futtatjuk a klienst akkor a [http://localhost:3000/](http://localhost:3000/) oldalon elérhetjük azt alapértelmezetten.

### Bejelentkezéshez használható adatok:
 |      Email     |   Jelszó    |
 |----------------|:-----------:|
 | teszt@elek.hu  | tesztelek0  |
 | teszt@tamas.hu | teszttamas1 |
 | teszt@bela.hu  | tesztbela2  |
