// src/components/Navbar.tsx
import React from 'react';
import Image from 'next/image'; // Use Next.js Image component
import haxlogo1 from '@/components/haxlogo1.png'; // Import the logo image
import ToggleButton from '@/components/ToggleButton'; // Import the ToggleButton component

// Define the props type for Navbar
interface NavbarProps {
  onSyncStateChange: (stateKey: 'syncState' | 'motorState' | 'reverseDirection', state: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSyncStateChange }) => {
  // Handler for state change from ToggleButton
  const handleStateChange = (stateKey: 'motorState' | 'reverseDirection' | 'syncState', state: string) => {
    console.log(`State changed for ${stateKey}: ${state}`);
    onSyncStateChange(stateKey, state); // Call the passed handler
  };

  return (
    <nav className="bg-[#00308F] p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Using the Image component */}
        <Image src={haxlogo1} alt="Logo" width={100} height={40} className="h-8" />

        {/* ToggleButton used for sync state */}
        <ToggleButton
          label="SYNC Systems"
          postEndpoint="http://localhost:3001/data"
          system="Sync" // Adjust system as needed
          stateKey="syncState" // Key for sync state
          onStateChange={handleStateChange}
        />
      </div>
    </nav>
  );
};

export default Navbar;
