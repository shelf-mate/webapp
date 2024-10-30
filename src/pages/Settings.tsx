import React, { useState, ChangeEvent } from 'react';
import { AiOutlineBell } from 'react-icons/ai';

const Settings: React.FC = () => {
    const [notifications, setNotifications] = useState<boolean>(true);

    const handleNotificationChange = () => {
        setNotifications(!notifications);
    };

    const handleSave = () => {
        alert('Settings saved!');
    };

    return (
        <div className="container mx-auto p-4">
        <h2 className="tw-1/3 text-xl font-semibold text-center uppercase">Settings</h2>
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
    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-primaryColor peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
        </label>
        </div>
        </div>
            <button
        onClick={handleSave}
    className="w-full bg-primaryColor text-white py-3 rounded-lg text-center text-lg hover:bg-primaryColor transition duration-300"
        >
        Save Settings
    </button>
    </div>
);
};

export default Settings;
