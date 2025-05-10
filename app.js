const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 3000;

const http = require("http");

const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));


io.on("connection", (socket) => {
    socket.on("send-location",(location) => {
        io.emit("location", {id: socket.id, ...location});
    })
    socket.on("disconnect", () => {
        io.emit("User-disconnected", {id: socket.id});
    })
})

app.get("/", (req, res) => {
    res.render("index");
})
server.listen(port,() => {
    console.log("Server is running on port 3000");
})