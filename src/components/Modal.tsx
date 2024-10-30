import React, { ReactNode } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

interface ModalProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50 p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-lg">
                <div className="flex justify-between items-center pb-4 border-b">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <button onClick={onClose} className="text-2xl">
                        <AiOutlineClose />
                    </button>
                </div>
                <div className="mt-4 overflow-y-auto">{children}</div>
                <button onClick={onClose} className="w-full p-4 text-center text-blue-500 bg-white border-t mt-4 rounded-b-3xl">
                    Done
                </button>
            </div>
        </div>
    );
};

export default Modal;
