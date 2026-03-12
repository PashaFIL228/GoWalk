import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CityPage from './pages/CityPage';
import PlacePage from './pages/PlacePage';
import AdminPage from "./pages/AdminPage.jsx";
import PrivateRoute from './components/PrivateRoute';

function App() {
    return (
        <BrowserRouter>
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/city/:cityName" element={<CityPage />} />
                        <Route path="/place/:id" element={<PlacePage />} />
                        <Route element={<PrivateRoute />}>
                            <Route path="/admin" element={<AdminPage />} />
                        </Route>
                    </Routes>
                </main>
                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;