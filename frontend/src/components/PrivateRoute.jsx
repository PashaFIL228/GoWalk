import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Загрузка...</div>;
    }

    return user && user.role === 'ADMIN' ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;