import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPlacesByCity } from '../services/api';

// Иконки для типов мест
const typeIcons = {
    all: '🏞️',
    park: '🌳',
    waterfront: '🌊',
    viewpoint: '🌇',
    historic: '🏛'
};

const typeLabels = {
    all: 'Все',
    park: 'Парки',
    waterfront: 'Набережные',
    viewpoint: 'Смотровые',
    historic: 'Исторические'
};

export default function CityPage() {
    const { cityName } = useParams();
    const navigate = useNavigate();
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const { data } = await getPlacesByCity(cityName);
                setPlaces(data);
            } catch (err) {
                alert('Город не найден или ошибка сервера');
            } finally {
                setLoading(false);
            }
        };
        fetchPlaces();
    }, [cityName]);

    const filteredPlaces = filter === 'all' ? places : places.filter(p => p.type === filter);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Заголовок города */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <h1 className="text-4xl font-bold mb-2">{cityName}</h1>
                    <p className="text-xl text-blue-100">
                        {places.length} {places.length === 1 ? 'место' : places.length < 5 ? 'места' : 'мест'} для прогулок
                    </p>
                </div>
            </div>

            {/* Фильтры в виде иконок */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-8">
                <div className="bg-white rounded-lg shadow-lg p-4 inline-flex flex-wrap gap-2">
                    {Object.keys(typeIcons).map(key => (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
                            className={`flex items-center px-4 py-2 rounded-full transition-all ${
                                filter === key
                                    ? 'bg-blue-600 text-white shadow-md scale-105'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <span className="mr-2 text-lg">{typeIcons[key]}</span>
                            {typeLabels[key]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Сетка мест */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {filteredPlaces.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">В этой категории пока нет мест</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPlaces.map(place => (
                            <div
                                key={place.id}
                                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                                onClick={() => navigate(`/place/${place.id}`)}
                            >
                                <div className="h-48 overflow-hidden">
                                    <img
                                        src={place.photo_url || 'https://via.placeholder.com/400x200?text=Нет+фото'}
                                        alt={place.name}
                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-5">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xl font-semibold text-gray-800">{place.name}</h3>
                                        <span className="flex items-center text-yellow-500">
                                            <span className="text-lg mr-1">★</span>
                                            {place.rating || '0.0'}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {place.description || 'Описание отсутствует'}
                                    </p>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <span className="mr-2">{typeIcons[place.type]}</span>
                                        <span>{typeLabels[place.type]}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}