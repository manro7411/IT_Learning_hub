// src/components/InstructionModal.tsx
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
// import Logo from '../assets/logo.png';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const InstructionModal = ({ isOpen, onClose }: Props) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

      {/* Modal Content */}
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 z-50">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-black" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-blue-700 font-semibold text-sm border-b border-gray-200 w-fit">instruction</h2>
          {/* <img src={Logo} alt="Bangkok Bank Logo" className="h-6" /> */}
        </div>

        {/* Title */}
        <h3 className="text-blue-700 font-semibold text-lg mb-4">Your journey to smarter learning starts here.</h3>

        {/* Body */}
        <div className="text-blue-700 text-sm space-y-4 leading-6">
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <strong>Use Your Official Credentials</strong>
              <ul className="list-disc pl-5">
                <li>Please log in with your company/organization email and password.</li>
                <li>If you do not have an account, contact your supervisor or IT support.</li>
              </ul>
            </li>
            <li>
              <strong>Browser Recommendation</strong>
              <ul className="list-disc pl-5">
                <li>For the best experience, use Google Chrome, Microsoft Edge, or Safari (latest version).</li>
              </ul>
            </li>
            <li>
              <strong>Secure Your Information</strong>
              <ul className="list-disc pl-5">
                <li>Never share your password with anyone.</li>
                <li>If you suspect unauthorized access, change your password and notify IT.</li>
              </ul>
            </li>
            <li>
              <strong>Network Requirement</strong>
              <ul className="list-disc pl-5">
                <li>Please ensure you're on the company’s internal/private network or VPN.</li>
              </ul>
            </li>
            <li>
              <strong>Data Privacy & Usage</strong>
              <ul className="list-disc pl-5">
                <li>All activities on this platform are logged for training and security.</li>
                <li>Please use the system responsibly and follow company policies.</li>
              </ul>
            </li>
            <li>
              <strong>Getting Help</strong>
              <ul className="list-disc pl-5">
                <li>If you have trouble logging in, contact the User Guide or IT support.</li>
              </ul>
            </li>
          </ol>
        </div>
      </div>
    </Dialog>
  );
};

export default InstructionModal;
