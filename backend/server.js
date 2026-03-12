const express = require('express');
const http = require('http');
const cors = require('cors');
const sequelize = require('./db');
const { City, Place, Review, User } = require('./model/models'); // проверьте путь
const placeRoutes = require('./routes/places');
const cityRoutes = require('./routes/cities');
const authRoutes = require('./routes/auth');

const socket = require('./socket'); // импорт

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/places', placeRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/auth', authRoutes);

const server = http.createServer(app);
const io = socket.init(server); // ИНИЦИАЛИЗАЦИЯ

io.on('connection', (socket) => {
    console.log('🔌 Клиент подключён:', socket.id);
    socket.on('disconnect', () => {
        console.log('❌ Клиент отключён:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
sequelize.sync({ alter: true })
    .then(() => {
        console.log('✅ База данных синхронизирована');
        server.listen(PORT, () => {
            console.log(`🚀 Сервер запущен на порту ${PORT}`);
        });
    })
    .catch(err => console.error('❌ Ошибка синхронизации:', err));