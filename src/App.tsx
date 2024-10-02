import React, {useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import { AiOutlineSetting, AiOutlineHome } from 'react-icons/ai';
import ProductTable from './components/ProductTable';
import './index.css'
import SettingsPage from './pages/Settings';
import { getAllUnits } from './api/api'; // Importiere die API-Funktion, falls sie in einer separaten Datei ist

const App: React.FC = () => {
  const handleVibration = () => {
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
  };

  return (
      <Router>
        <div className="App min-h-screen flex flex-col justify-between">
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<ProductTable />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </div>
          <nav className="fixed bottom-0 left-0 right-0 bg-gray-200 p-4 flex justify-around shadow-lg">
            <NavLink
                to="/"
                className={({ isActive }) =>
                    isActive ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'
                }
                end
                onClick={handleVibration}
            >
              <div className="flex flex-col items-center">
                <AiOutlineHome className="text-2xl" />
                <span className="text-xs">Home</span>
              </div>
            </NavLink>

            <NavLink
                to="/settings"
                className={({ isActive }) =>
                    isActive ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'
                }
                onClick={handleVibration}
            >
              <div className="flex flex-col items-center">
                <AiOutlineSetting className="text-2xl" />
                <span className="text-xs">Settings</span>
              </div>
            </NavLink>
          </nav>
        </div>
      </Router>
  );
}

export default App;
