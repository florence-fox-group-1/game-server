const httpServer = require("http").createServer();
const PORT = process.env.PORT || 3000
const io = require("socket.io")(httpServer, {
  // ...
});

io.on("connection", (socket) => {
  // ...
});

httpServer.listen(PORT, () => console.log(`This app running on server ${PORT}`));