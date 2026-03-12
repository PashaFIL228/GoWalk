import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';



export default function Header() {
    const { user, loading, logout } = useAuth();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('login');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Закрыть меню при клике вне области
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const openLogin = () => {
        setModalMode('login');
        setModalOpen(true);
    };

    const openRegister = () => {
        setModalMode('register');
        setModalOpen(true);
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    if (loading) {
        return (
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
                    <span className="text-2xl mr-2">🌍</span>
                    <span>Загрузка...</span>
                </div>
            </header>
        );
    }

    return (
        <>
            <header className="bg-white shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/" className="flex items-center space-x-2">
                            <span className="text-2xl">🌍</span>
                            <span className="font-bold text-xl text-gray-800">Городские прогулки</span>
                        </Link>

                        <nav className="flex items-center space-x-4">
                            <Link to="/" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                                Главная
                            </Link>

                            {user ? (
                                <div className="relative" ref={menuRef}>
                                    <button
                                        onClick={toggleMenu}
                                        className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 focus:outline-none"
                                    >
                                        {/* Первая буква email как аватар */}
                                        {user.email ? user.email[0].toUpperCase() : 'U'}
                                    </button>

                                    {isMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                                            <div className="px-4 py-2 text-sm text-gray-700 border-b">
                                                {user.email}
                                            </div>
                                            {user.role === 'ADMIN' && (
                                                <Link
                                                    to="/admin"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    Админ-панель
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => {
                                                    logout();
                                                    setIsMenuOpen(false);
                                                }}
                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                            >
                                                Выйти
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-x-2">
                                    <button
                                        onClick={openLogin}
                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                    >
                                        Вход
                                    </button>
                                    <button
                                        onClick={openRegister}
                                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                    >
                                        Регистрация
                                    </button>
                                </div>
                            )}
                        </nav>
                    </div>
                </div>
            </header>

            <AuthModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                initialMode={modalMode}
            />
        </>
    );
}