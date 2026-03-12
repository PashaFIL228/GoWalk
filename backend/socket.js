const { Server } = require('socket.io');

let io;

module.exports = {
    init: (server) => {
        io = new Server(server, {
            cors: {
                origin: "http://localhost:5173",
                methods: ["GET", "POST"],
                credentials: true
            }
        });
        return io;
    },
    getIO: () => {
        if (!io) {
            throw new Error('Socket.io не инициализирован');
        }
        return io;
    }
};