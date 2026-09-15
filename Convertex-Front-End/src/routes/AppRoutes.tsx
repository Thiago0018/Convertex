import { Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home';
import { ConvertionPage } from '../pages/ConvertionPage';


export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/conversao" element={<ConvertionPage />} />
        </Routes>
    );
}

export default AppRoutes;