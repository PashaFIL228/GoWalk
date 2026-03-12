import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRandomPlace, getPopularPlaces } from '../services/api';

export default function HomePage() {
    const [city, setCity] = useState('');
    const [popularPlaces, setPopularPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPopular = async () => {
            try {
                const { data } = await getPopularPlaces();
                setPopularPlaces(data);
            } catch (err) {
                console.error('Ошибка загрузки популярных мест:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPopular();
    }, []);

    const handleCitySubmit = (e) => {
        e.preventDefault();
        if (city.trim()) navigate(`/city/${city}`);
    };

    const handleRandom = async () => {
        try {
            const { data } = await getRandomPlace();
            navigate(`/place/${data.id}`);
        } catch (err) {
            alert('Ошибка получения случайного места');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Hero секция (без изменений) */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div className="absolute top-0 left-0 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-0 left-20 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
                    <div className="text-center">
                        <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight mb-4">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                                Городские прогулки
                            </span>
                        </h1>
                        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                            Откройте для себя самые красивые места для прогулок в любом городе мира
                        </p>

                        {/* Форма поиска */}
                        <div className="mt-10 max-w-xl mx-auto">
                            <form onSubmit={handleCitySubmit} className="flex flex-col sm:flex-row gap-3">
                                <div className="flex-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        placeholder="Введите город (например, Warsaw)"
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-105"
                                >
                                    Найти
                                </button>
                            </form>
                        </div>

                        {/* Кнопка случайного места */}
                        <div className="mt-6">
                            <button
                                onClick={handleRandom}
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-105"
                            >
                                <span className="mr-2">🎲</span>
                                Случайное место
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Секция популярных мест */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                    Популярные направления
                </h2>
                {loading ? (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {popularPlaces.map((place) => (
                            <div
                                key={place.id}
                                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                                onClick={() => navigate(`/place/${place.id}`)}
                            >
                                <div className="h-48 overflow-hidden">
                                    <img
                                        src={place.photo_url || 'https://via.placeholder.com/300'}
                                        alt={place.name}
                                        className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-800">{place.name}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{place.City?.name}</p>
                                    <div className="flex items-center mt-1">
                                        <span className="text-yellow-500 mr-1">★</span>
                                        <span className="text-sm text-gray-600">{place.rating || '0.0'}</span>
                                    </div>
                                    <span className="inline-block mt-2 px-2 py-1 text-xs font-medium text-indigo-800 bg-indigo-100 rounded-full">
                                        {place.type === 'park' && '🌳 Парк'}
                                        {place.type === 'waterfront' && '🌊 Набережная'}
                                        {place.type === 'historic' && '🏛 Историческое'}
                                        {place.type === 'viewpoint' && '🌇 Смотровая'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}