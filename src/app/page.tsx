'use client';

import React, { useState } from 'react';
import System1 from '@/components/System1';
import System2 from '@/components/System2';
import Navbar from '@/components/Navbar';

const Page: React.FC = () => {
  const [syncState, setSyncState] = useState<string>('OFF');

  // Handler to update syncState
  const handleSyncStateChange = (stateKey: 'syncState' | 'motorState' | 'reverseDirection', state: string) => {
    console.log('Sync State Changed:', stateKey, state); // Debugging line
    if (stateKey === 'syncState') {
      setSyncState(state);
    }
    // Handle other state keys if necessary
  };

  return (
    <div>
      <Navbar onSyncStateChange={handleSyncStateChange} />
      <div className="p-8 bg-gray-200 min-h-screen flex justify-center">
        {/* Display content based on syncState */}
        {syncState === 'ON' ? (
          <System1 />
        ) : (
          <div className="flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-5 p-8">
            <System1 />
            <System2 />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
