// Utlizaremos leaflet
// Al instanciar leaflet crea la variable L
// Initialize the map
const map = L.map('map-template').setView([20, 50], 2);
// .addTo() layer método q permite añadir elemento titleLayer a un elemento
//L.tileLayer('https://a.tile.openstreetmap.de/{z}/{x}/{y}.png').addTo(map);

//Desde aquí, el cliente, tenemos que inicializar la conexión sockets
//con <script src="socket.io/socket.io.js"></script> tenemos io como varaible global
// io es una variable global q al ejecutarla se conecta al servidor y nos devuelve un socket, para enviar o escuchar eventos 
const socket = io();

// Making the map base
// load a tile layer
const url = ('http://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'); 
//L.tileLayer(url).addTo(map);
const tiles = L.tileLayer(url);
tiles.addTo(map);
//control de escala
const scale = L.control.scale();
scale.addTo(map)


// localizacion con precisión alta - utiliza la API del navegador para localizar al usuario
map.locate({ enableHigthAccuracy: true })

//Escucha evento en el mapa cuando el usuario acepta dar la localizcin al navegador
map.on('locationfound', e => {
    //console.log(e);
    const coords = [e.latlng.lat, e.latlng.lng]
    const myMarker = L.marker(coords,{icon: myIcon});
    map.addLayer(myMarker);
    myMarker.bindPopup('You are here at ',);
    
//vamos a emitir un evento(mediante const socket = io(); ) al servidor para q escuche nuestras cordenadas
socket.emit('userCoordinates',e.latlng); //nombre y valor q le pasamos desde el evento q tiene las cordenadas

})


//creamos marcador mediante recepción de socket con coordenadas
socket.on('newUserCoordinates',(coords)=>{
    console.log('we can see New User');
    const marker = L.marker([coords.lat + 1 , coords.lng + 1]);
    marker.bindPopup('Hi! New User');
    map.addLayer(marker);
})

// Creamos marcador manual con coprdenadas fijas
const marker = L.marker([51.5, -0.09]);
marker.bindPopup('Hello There');
map.addLayer(marker);

// Diseño de marcador con icon leaflet obj
const myIcon = L.icon({
    iconUrl: 'https://walkexperience.org/wp-content/uploads/2020/06/Walk-logo-97.png',
    iconSize: [25, 45],
    iconAnchor: [30, 26]

});
const issIcon = L.icon({
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/International-Space-Station_mark.svg/268px-International-Space-Station_mark.svg.png',
    iconSize: [25, 45],
    iconAnchor: [30, 26]
});
//L.marker([0, 0], {icon: myIcon}).addTo(map); //ecuador 0 0

//Con el protocolo webscket el servidor http envía eventos en tiempo real cuando los usuarios se conectan

// Api get coordenates estación espacial
const url_apiISS = 'http://api.open-notify.org/iss-now.json';

// Marcador con posición ISS
async function getISS() {
    const res = await fetch(url_apiISS);
    const data = await res.json();
    const timeSeconds = data.timestamp;
    const {latitude, longitude} = data.iss_position;
    document.getElementById('lat').textContent = latitude;
    document.getElementById('lng').textContent = longitude;
 
    // Creamos marcador ISS
    const markerISS = L.marker([latitude, longitude], {icon: issIcon});
    // time
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    let date = new Date(timeSeconds * 1000);
    // Hours part from the timestamp
    let hours = date.getHours();
    // Minutes part from the timestamp
    let minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    let seconds = "0" + date.getSeconds();
    // Will display time in 10:30:23 format
    let formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

    // Ver hora de paso en pop up
    markerISS.bindPopup('ISS passed at '+formattedTime);
    map.addLayer(markerISS);

    setTimeout(getISS, 20000);
}

getISS().catch((err) => {
    console.log('In catch !!!')
    console.log(err);
});


//botón
const btn = document.getElementById('button');
async function showCoord(){
    const res = await fetch(url_apiISS);
    const data = await res.json();
    console.log(data);
    console.log('data');
}

//btn.addEventListener("click", showCoord());

setTimeout( getISS(),1000);



