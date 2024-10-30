import React, { ReactNode } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

interface ModalProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    onConfirm?: () => void;
    confirmButtonLabel?: string;
    confirmButtonColor?: string;
}

const Modal: React.FC<ModalProps> = ({
                                         title,
                                         isOpen,
                                         onClose,
                                         children,
                                         onConfirm,
                                         confirmButtonLabel = 'Save',
                                         confirmButtonColor = 'bg-primaryColor' // Standardfarbe
                                     }) => {
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

                <div className="flex mt-4">
                    {onConfirm ? (
                        <button
                            onClick={onConfirm}
                            className={`w-full p-3 mt-2 rounded-md text-white ${confirmButtonColor}`}
                        >
                            {confirmButtonLabel}
                        </button>
                    ) : (
                        <button
                            onClick={onClose}
                            className="w-full py-4 px-6 text-center text-primaryColor bg-white border-t rounded-3xl"
                        >
                            Done
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;
