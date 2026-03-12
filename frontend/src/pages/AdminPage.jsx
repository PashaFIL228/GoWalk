import { useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../services/api';

export default function AdminPage() {
    const [cityName, setCityName] = useState('');
    const [name, setName] = useState('');
    const [type, setType] = useState('park');
    const [description, setDescription] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            await axios.post(`${API_BASE}/places`, {
                cityName,
                name,
                type,
                description,
                photo_url: photoUrl,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude)
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setMessage('Место успешно добавлено!');
            // Очистить форму
            setCityName('');
            setName('');
            setDescription('');
            setPhotoUrl('');
            setLatitude('');
            setLongitude('');
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка при добавлении');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Админ-панель: добавить место</h1>
            {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{message}</div>}
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1">Город</label>
                    <input
                        type="text"
                        value={cityName}
                        onChange={(e) => setCityName(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1">Название места</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1">Тип</label>
                    <select value={type} onChange={(e) => setType(e.target.value)} className="w-full border rounded px-3 py-2">
                        <option value="park">Парк</option>
                        <option value="waterfront">Набережная</option>
                        <option value="viewpoint">Смотровая площадка</option>
                        <option value="historic">Историческое место</option>
                    </select>
                </div>
                <div>
                    <label className="block mb-1">Описание</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        rows="3"
                    />
                </div>
                <div>
                    <label className="block mb-1">URL фото</label>
                    <input
                        type="url"
                        value={photoUrl}
                        onChange={(e) => setPhotoUrl(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1">Широта</label>
                        <input
                            type="number"
                            step="any"
                            min="-90"
                            max="90"
                            value={latitude}
                            onChange={(e) => setLatitude(e.target.value)}
                            required
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Долгота</label>
                        <input
                            type="number"
                            step="any"
                            min="-180"
                            max="180"
                            value={longitude}
                            onChange={(e) => setLongitude(e.target.value)}
                            required
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Добавить место
                </button>
            </form>
        </div>
    );
}