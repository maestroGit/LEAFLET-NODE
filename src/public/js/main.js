// Utlizaremos leaflet
// Al instanciar leaflet crea la variable L
//console.log(L);
const map = L.map('map-template').setView([0, 0], 2);
// .addTo() layer método q permite añadir elemento titleLayer a un elemento
//L.tileLayer('https://a.tile.openstreetmap.de/{z}/{x}/{y}.png').addTo(map);

//Desde aquí, el cliente, tenemos que inicializar la conexión sockets
//con <script src="socket.io/socket.io.js"></script> tenemos io como varaible global
// io es una variable global q al ejecutarla se conecta al servidor y nos devuelve un socket, para enviar o escuchar eventos 
const socket = io();

//mapa base
const url = ('http://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png')
L.tileLayer(url).addTo(map);

// localizacion con precisión alta - utiliza la API del navegador para localizar al usuario
map.locate({ enableHigthAccuracy: true })

//escucha evento en el mapa una vezel usuario acepta dar localizcin al navegador
map.on('locationfound', e => {
    //console.log(e);
    const coords = [e.latlng.lat, e.latlng.lng]
    const marker = L.marker(coords);
    marker.bindPopup('You are here');
    map.addLayer(marker);
    //vamos a emitir un evento(mediante const socket = io(); ) al servidor para q escuche nuestras cordenadas
socket.emit('userCoordinates',e.latlng); //nombre y valor q le pasamos desde el evento q tiene las cordenadas

})


//creamos marcador mediante recepción de socket con coordenadas
socket.on('newUserCoordinates',(coords)=>{
    console.log('we can see New User');
    const marker = L.marker([coords.lat + 1 , coords.lng + 1]);
    marker.bindPopup('Hello New User');
    map.addLayer(marker);
})

// creamos marcador manual
const marker = L.marker([51.5, -0.09]);
marker.bindPopup('Hello There');
map.addLayer(marker);

//
const myIcon = L.icon({
    iconUrl: 'https://walkexperience.org/wp-content/uploads/2020/06/Walk-logo-97.png',//ruta no correcta !!!
    iconSize: [25, 45],
    iconAnchor: [12, 41],
    popupAnchor: [-3, -76],
});
L.marker([50.505, 30.57], {icon: myIcon}).addTo(map);

//Con el protocolo webscket el servidor http envía eventos en tiempo real cuando los usuarios se conectan

// Api get coordenates estación espacial
const url_apiISS = 'http://api.open-notify.org/iss-now.json';
async function getISS() {
    const res = await fetch(url_apiISS);
    const data = await res.json();
    console.log(data);
    const {latitude, longitude} = data.iss_position;
    document.getElementById('lat').textContent = latitude;
    document.getElementById('lng').textContent = longitude;
    // creamos marcador ISS
    const markerISS = L.marker([latitude, longitude]);
    markerISS.bindPopup('Hello ISS');
    map.addLayer(markerISS);
    setTimeout(getISS, 5000);
}

setTimeout( getISS(),2000);



