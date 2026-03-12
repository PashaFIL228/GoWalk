const sequelize = require('./db');
const { City, Place, Review, User } = require('./model/models'); // проверьте путь!
const bcrypt = require('bcrypt');

async function seed() {
    try {
        // ВНИМАНИЕ: force: true удалит все таблицы и создаст заново
        await sequelize.sync({ force: true });
        console.log('✅ Таблицы пересозданы.');

        // 1. Создаём администратора
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create({
            email: 'filimonpas12@gmail.com',
            password: hashedPassword,
            role: 'ADMIN'
        });
        console.log('✅ Администратор создан (admin123)');

        // 2. Создаём город Warsaw
        const warsaw = await City.create({ name: 'Warsaw' });
        console.log('✅ Город Warsaw создан.');

        // 3. Добавляем места
        const places = [
            {
                name: 'Лазенки',
                type: 'park',
                description: 'Красивый парк с дворцом и озером',
                photo_url: 'https://images.unsplash.com/photo-1500382017468-9049fed3aa0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                rating: 4.8,
                latitude: 52.215,
                longitude: 21.035,
                city_id: warsaw.id
            },
            {
                name: 'Набережная Вислы',
                type: 'waterfront',
                description: 'Живописная набережная с видом на реку',
                photo_url: 'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                rating: 4.6,
                latitude: 52.232,
                longitude: 21.025,
                city_id: warsaw.id
            },
            {
                name: 'Смотровая площадка на Дворце культуры',
                type: 'viewpoint',
                description: 'Панорамный вид на Варшаву',
                photo_url: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                rating: 4.5,
                latitude: 52.232,
                longitude: 21.008,
                city_id: warsaw.id
            },
            {
                name: 'Старый город',
                type: 'historic',
                description: 'Исторический центр Варшавы, включённый в список ЮНЕСКО',
                photo_url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                rating: 4.9,
                latitude: 52.250,
                longitude: 21.012,
                city_id: warsaw.id
            }
        ];

        for (const p of places) {
            await Place.create(p);
        }
        console.log('✅ Добавлено 4 места.');

        // 4. Добавляем отзывы
        const firstPlace = await Place.findOne();
        if (firstPlace) {
            await Review.create({
                user_name: 'Анна',
                rating: 5,
                comment: 'Очень красивое место, обязательно вернусь!',
                place_id: firstPlace.id
            });
            await Review.create({
                user_name: 'Иван',
                rating: 4,
                comment: 'Хорошо, но многолюдно в выходные',
                place_id: firstPlace.id
            });
            console.log('✅ Добавлены отзывы.');
        }

        console.log('🎉 База данных успешно заполнена!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Ошибка:', error);
        process.exit(1);
    }
}


seed();