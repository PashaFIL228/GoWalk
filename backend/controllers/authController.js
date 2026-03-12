const { User } = require('../model/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator'); // если используете

const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';

// Регистрация
exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Проверяем, существует ли пользователь
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
        }

        // Хешируем пароль
        const hashedPassword = await bcrypt.hash(password, 10);

        // Создаём пользователя
        const user = await User.create({
            email,
            password: hashedPassword,
            role: 'USER'
        });

        // Генерируем токен
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            SECRET_KEY,
            { expiresIn: '30d' }
        );

        res.status(201).json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// Вход
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Ищем пользователя
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Неверный email или пароль' });
        }

        // Проверяем пароль
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Неверный email или пароль' });
        }

        // Генерируем токен
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            SECRET_KEY,
            { expiresIn: '30d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// Получить информацию о текущем пользователе (по токену)
exports.getMe = async (req, res) => {
    try {
        // Токен должен быть передан в заголовке Authorization: Bearer <token>
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Не авторизован' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Не авторизован' });
        }

        const decoded = jwt.verify(token, SECRET_KEY);
        const user = await User.findByPk(decoded.id, {
            attributes: { exclude: ['password'] } // не возвращаем пароль
        });

        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        res.json(user);
    } catch (err) {
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Неверный или просроченный токен' });
        }
        console.error(err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};