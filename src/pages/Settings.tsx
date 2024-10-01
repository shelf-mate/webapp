import React, { useState, ChangeEvent } from 'react';
import { AiOutlineMail, AiOutlineBell } from 'react-icons/ai';

const Settings: React.FC = () => {
    const [notifications, setNotifications] = useState<boolean>(true);
    const [email, setEmail] = useState<string>('');

    const handleNotificationChange = () => {
        setNotifications(!notifications);
    };

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleSave = () => {
        // Logik zum Speichern der Einstellungen
        alert('Settings saved!');
    };

    return (
        <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Settings</h2>

    {/* Email Input */}
    <div className="mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <div className="relative">
    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
    <AiOutlineMail className="text-gray-400 text-lg" />
        </span>
        <input
    type="email"
    value={email}
    onChange={handleEmailChange}
    className="border border-gray-300 rounded-lg p-3 pl-10 w-full text-sm focus:ring-blue-500 focus:border-blue-500"
    placeholder="Enter your email"
        />
        </div>
        </div>

    {/* Notifications Toggle */}
    <div className="mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-2">Notifications</label>
        <div className="flex items-center justify-between">
    <div className="flex items-center">
    <AiOutlineBell className="text-gray-400 text-lg mr-2" />
    <span className="text-sm text-gray-700">Enable Notifications</span>
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
    <input
        type="checkbox"
    className="sr-only peer"
    checked={notifications}
    onChange={handleNotificationChange}
    />
    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
        </label>
        </div>
        </div>

    {/* Save Button */}
    <button
        onClick={handleSave}
    className="w-full bg-blue-500 text-white py-3 rounded-lg text-center text-lg hover:bg-blue-600 transition duration-300"
        >
        Save Settings
    </button>
    </div>
);
};

export default Settings;
