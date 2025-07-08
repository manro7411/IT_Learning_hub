// src/components/InstructionModal.tsx
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
// import Logo from '../assets/logo.png';
import loginImage from '../assets/login.png';
import browserImage from '../assets/browser.png';
import nopasswordImage from '../assets/nopassword1.png';
import networkImage from '../assets/network.png';
import lockImage from '../assets/lock.png';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const InstructionModal = ({ isOpen, onClose }: Props) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[80vh] p-6 z-50 overflow-y-auto">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-black" onClick={onClose}>
          <X size={20} />
        </button>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-blue-700 font-semibold text-sm border-b border-gray-200 w-fit">INSTRUCTION</h2>
        </div>
        <h3 className="text-blue-700 font-semibold text-lg mb-4">Your journey to smarter learning starts here.</h3>
        <div className="text-blue-700 text-sm space-y-4 leading-6">
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <strong>Use Your Official Credentials</strong>
              <div className="pl-5">
                <img src={loginImage} alt="Login example"  className="w-full max-w-sm h-28 object-contain rounded-md "/>
                <ul className="list-disc pl-5">
                  <li>Please log in with your company/organization email and password.</li>
                  <li>If you do not have an account, contact your supervisor or IT support.</li>
                </ul>
              </div>
            </li>
            
            <li>
              <strong>Browser Recommendation</strong>
              <div className="pl-5">
                <img src={browserImage} alt="browser image"  className="w-full max-w-sm h-16 object-contain rounded-md "/>
              <ul className="list-disc pl-5">
                <li>For the best experience, use Google Chrome, Microsoft Edge, or Safari (latest version).</li>
              </ul>
              </div>
            </li>

            <li>
              <strong>Secure Your Information</strong>
              <div className="pl-5">
                <img src={nopasswordImage} alt="nopassword image"  className="w-full max-w-sm h-24 object-contain rounded-md "/>
              <ul className="list-disc pl-5">
                <li>Never share your password with anyone.</li>
                <li>If you suspect unauthorized access, change your password and notify IT.</li>
              </ul>
              </div>
            </li>

            <li>
              <strong>Network Requirement</strong>
              <div className="pl-5">
                <img src={networkImage} alt="network image"  className="w-full max-w-sm h-20 object-contain rounded-md "/>
                <ul className="list-disc pl-5">
                <li>Please ensure you're on the company’s internal/private network or VPN.</li>
              </ul>
              </div>
              
            </li>

            <li>
              <strong>Data Privacy & Usage</strong>
              <div className="pl-5">
                <img src={lockImage} alt="network image"  className="w-full max-w-sm h-20 object-contain rounded-md "/>
                <ul className="list-disc pl-5">
                <li>All activities on this platform are logged for training and security.</li>
                <li>Please use the system responsibly and follow company policies.</li>
              </ul>
              </div>
              
            </li>

            <li>
              <strong>Getting Help ⚠️</strong>
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
