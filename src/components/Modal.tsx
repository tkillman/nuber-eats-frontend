import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log("event.key", event.key);
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 pointer-events-auto h-screen w-screen">
      <div className="relative w-full max-w-screen-sm bg-white rounded-lg shadow-lg pointer-events-auto p-3 mx-10">
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold text-center">{title}</h2>
          <button
            className="text-gray-500 hover:text-gray-700 text-5xl leading-[0] font-semibold"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
