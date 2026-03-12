import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPlaceById, addReview } from '../services/api';
import Map from '../components/Map';
import { socket } from '../services/socket';

const typeIcons = {
    park: '🌳',
    waterfront: '🌊',
    viewpoint: '🌇',
    historic: '🏛'
};

const typeLabels = {
    park: 'Парк',
    waterfront: 'Набережная',
    viewpoint: 'Смотровая площадка',
    historic: 'Историческое место'
};

export default function PlacePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [place, setPlace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviewName, setReviewName] = useState('');
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');

    // Функция загрузки места (вынесена наверх)
    const fetchPlace = async () => {
        try {
            const { data } = await getPlaceById(id);
            setPlace(data);
        } catch (err) {
            alert('Ошибка загрузки');
        } finally {
            setLoading(false);
        }
    };

    // Загрузка при монтировании и изменении id
    useEffect(() => {
        fetchPlace();
    }, [id]);

    // Подписка на сокет-событие
    useEffect(() => {
        const handleReviewAdded = (updatedPlace) => {
            // Если обновлённое место соответствует текущему id, обновляем state
            if (updatedPlace.id === parseInt(id)) {
                setPlace(updatedPlace);
            }
        };

        socket.on('reviewAdded', handleReviewAdded);

        // Очистка при размонтировании
        return () => {
            socket.off('reviewAdded', handleReviewAdded);
        };
    }, [id]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            await addReview(id, { user_name: reviewName, rating: reviewRating, comment: reviewComment });
            // После отправки не нужно запрашивать данные, так как придёт событие
            setReviewName('');
            setReviewRating(5);
            setReviewComment('');
        } catch (err) {
            alert('Ошибка отправки отзыва');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!place) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Место не найдено</h2>
                    <button
                        onClick={() => navigate('/')}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        Вернуться на главную
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero секция с изображением */}
            <div className="relative h-96 bg-gray-900">
                <img
                    src={place.photo_url || 'https://via.placeholder.com/1200x400?text=Нет+фото'}
                    alt={place.name}
                    className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center text-white mb-2">
                        <span className="text-2xl mr-2">{typeIcons[place.type]}</span>
                        <span className="text-lg bg-white bg-opacity-20 rounded-full px-3 py-1">
                            {typeLabels[place.type]}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{place.name}</h1>
                    <div className="flex items-center text-white">
                        <span className="text-yellow-400 text-2xl mr-1">★</span>
                        <span className="text-xl mr-2">{place.rating}</span>
                        <span className="text-white text-opacity-80">({place.Reviews?.length || 0} отзывов)</span>
                    </div>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 text-white transition"
                >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
            </div>

            {/* Основное содержание */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Левая колонка: описание и детали */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                            <h2 className="text-2xl font-bold mb-4">О месте</h2>
                            <p className="text-gray-700 leading-relaxed">
                                {place.description || 'Описание пока не добавлено.'}
                            </p>
                        </div>

                        {/* Карта */}
                        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                            <h2 className="text-2xl font-bold mb-4">На карте</h2>
                            <div className="rounded-lg overflow-hidden">
                                <Map latitude={place.latitude} longitude={place.longitude} name={place.name} />
                            </div>
                            <div className="mt-4 flex gap-2">
                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                >
                                    🗺️ Построить маршрут
                                </a>
                            </div>
                        </div>

                        {/* Отзывы */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-2xl font-bold mb-4">Отзывы</h2>
                            {place.Reviews && place.Reviews.length > 0 ? (
                                <div className="space-y-4">
                                    {place.Reviews.map(review => (
                                        <div key={review.id} className="border-b border-gray-200 pb-4 last:border-0">
                                            <div className="flex items-center mb-2">
                                                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                                                    {review.user_name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold">{review.user_name}</p>
                                                    <div className="flex items-center">
                                                        {[1,2,3,4,5].map(star => (
                                                            <svg key={star} className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-gray-700 ml-14">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-4">Пока нет отзывов. Будьте первым!</p>
                            )}

                            {/* Форма добавления отзыва */}
                            <form onSubmit={handleReviewSubmit} className="mt-6 border-t pt-6">
                                <h3 className="text-xl font-semibold mb-4">Оставить отзыв</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <input
                                        type="text"
                                        placeholder="Ваше имя"
                                        value={reviewName}
                                        onChange={(e) => setReviewName(e.target.value)}
                                        className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    <select
                                        value={reviewRating}
                                        onChange={(e) => setReviewRating(e.target.value)}
                                        className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} звезд</option>)}
                                    </select>
                                </div>
                                <textarea
                                    placeholder="Ваш комментарий"
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    rows="3"
                                    className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition transform hover:scale-105"
                                >
                                    Отправить отзыв
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Правая колонка: информация о городе и т.д. */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
                            <h3 className="text-lg font-semibold mb-3">Информация</h3>
                            <div className="space-y-3 text-sm">
                                <p><span className="font-medium">Город:</span> {place.City?.name}</p>
                                <p><span className="font-medium">Тип:</span> {typeLabels[place.type]}</p>
                                <p><span className="font-medium">Координаты:</span> {place.latitude}, {place.longitude}</p>
                                {place.City && (
                                    <button
                                        onClick={() => navigate(`/city/${place.City.name}`)}
                                        className="w-full mt-4 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                                    >
                                        ← Другие места в {place.City.name}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}