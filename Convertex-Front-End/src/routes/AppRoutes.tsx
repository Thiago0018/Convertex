import { Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home';
import { ConversionPage } from '../pages/ConversionPage';

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/conversao" element={<ConversionPage />} />
        </Routes>
    );
}

export default AppRoutes;