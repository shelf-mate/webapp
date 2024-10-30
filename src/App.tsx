import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import { AiOutlineSetting, AiOutlineHome } from 'react-icons/ai';
import ProductTable from './components/ProductTable';
import './index.css';
import SettingsPage from './pages/Settings';
import { getToken } from "firebase/messaging";
import { messaging } from './firebase';
import ProductDetail from "./pages/ProductDetail";
import Resources from "./pages/Resources";
import {FaThList} from "react-icons/fa";

const App: React.FC = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    const requestPermission = async () => {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("Notification permission granted.");

        try {
          const token = await getToken(messaging, { vapidKey: 'YOUR_VAPID_KEY' });
          console.log("Token:", token);
          setFcmToken(token);
        } catch (error) {
          console.error("Error retrieving token:", error);
        }
      } else {
        console.log("Unable to get permission to notify.");
      }
    };

    requestPermission();
  }, []);

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
              <Route path="/resources" element={<Resources />} />
              <Route path="/product/:id" element={<ProductDetail />} />
            </Routes>
          </div>
          <nav className="fixed bottom-0 left-0 right-0 bg-white border p-4 flex justify-around shadow-lg">
            <NavLink
                to="/"
                className={({ isActive }) =>
                    isActive ? 'text-primaryColor' : 'text-gray-500 hover:text-primaryColor'
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
                to="/resources"
                className={({ isActive }) =>
                    isActive ? 'text-primaryColor' : 'text-gray-500 hover:text-primaryColor'
                }
                end
                onClick={handleVibration}
            >
              <div className="flex flex-col items-center">
                <FaThList className="text-2xl" />
                <span className="text-xs">Resources</span>
              </div>
            </NavLink>
            <NavLink
                to="/settings"
                className={({ isActive }) =>
                    isActive ? 'text-primaryColor' : 'text-gray-500 hover:text-primaryColor'
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
};

export default App;
