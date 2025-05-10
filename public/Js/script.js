const socket = io();


if(navigator.geolocation){
    navigator.geolocation.watchPosition((position) => {
       const {latitude, longitude} =  position.coords;
       socket.emit("send-location", {latitude, longitude})

       map.flyTo([latitude, longitude], 16);
    },(error) => {
        console.log(error);
    },
    {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    }
    );
}

const map = L.map("map").setView([0,0],16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

const markers = {};

socket.on("location",(data) => {
    const {id, latitude, longitude} = data;
    // map.setView([latitude, longitude], 10);  

    if(markers[id]){
        markers[id].setLatLng([latitude, longitude]);
    }else{
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

socket.on("User-disconnected", (id) => {
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});