const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
  cors: {
    origin: "https://myjou.arturolopez.tech",
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
  transports: ["websocket"],
  path: "/api/",
});

app.use(cors());

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Server is running");
});

io.on("connection", (socket) => {
  socket.emit("me", socket.id);
  socket.on("disconnect", () => {
    socket.broadcast.emit("callended");
  });
  socket.on("calluser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("calluser", { signal: signalData, from, name });
  });
  socket.on("answercall", (data) => {
    io.to(data.to).emit("callaccepted", data.signal);
  });
});

server.listen(PORT, () => console.log(`Server listening to port ${PORT}`));
