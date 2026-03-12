import { Link } from 'react-router-dom';

export default function PlaceCard({ place }) {
    return (
        <div className="border rounded-lg overflow-hidden shadow-lg">
            <img src={place.photo_url || 'https://via.placeholder.com/300'} alt={place.name} className="w-full h-48 object-cover" />
            <div className="p-4">
                <h3 className="text-xl font-bold">{place.name}</h3>
                <p className="text-gray-600">⭐ {place.rating || 'Нет оценок'}</p>
                <p className="text-gray-700 mt-2">{place.description}</p>
                <div className="mt-4 flex gap-2">
                    <Link to={`/place/${place.id}`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Подробнее</Link>
                </div>
            </div>
        </div>
    );
}