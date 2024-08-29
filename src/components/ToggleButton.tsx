'use client';
import React, { useState } from 'react';
import axios from 'axios';

interface ToggleButtonProps {
  label: string;
  postEndpoint: string;
  system: 'System1' | 'System2' | 'Sync';
  stateKey: 'motorState' | 'reverseDirection' | 'syncState';
  onStateChange: (stateKey: 'motorState' | 'reverseDirection' | 'syncState', state: string) => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ label, postEndpoint, system, stateKey, onStateChange }) => {
  const [state, setState] = useState<boolean>(false);

  const handleToggle = () => {
    const newState = !state;
    const stateValue = newState ? 'ON' : 'OFF';

    setState(newState);
    onStateChange(stateKey, stateValue);
    postToggleState(system, stateKey, stateValue);
  };

  const postToggleState = async (system: 'System1' | 'System2' | 'Sync', stateKey: 'motorState' | 'reverseDirection' | 'syncState', stateValue: string) => {
    try {
      let postData;

      if (system === 'Sync') {
        postData = {
          system: 'Sync',
          data: {
            Sync: stateValue === 'ON'
          }
        };
      } else {
        postData = {
          system: system,
          data: {
            [stateKey]: stateValue
          }
        };
      }

      await axios.post(postEndpoint, postData);
    } catch (error) {
      console.error('Error posting toggle state:', error);
    }
  };

  // Determine button class based on system
  const buttonClass = system === 'Sync'
    ? `w-44 max-w-xs md:max-w-sm lg:max-w-md h-12 flex items-center justify-center rounded-lg text-black font-semibold ${state ? 'bg-green-500 text-white' : 'bg-[#DCDCDC]'} transition-all duration-300`
    : `w-full max-w-xs md:max-w-sm lg:max-w-md h-12 md:h-16 lg:h-20 flex items-center justify-center rounded-lg text-black font-semibold ${state ? 'bg-green-500 text-white' : 'bg-[#DCDCDC]'} transition-all duration-300`;
  return (
    <button
      onClick={handleToggle}
      className={buttonClass}
    >
      {label === 'Reverse Switch'
        ? `${label} - ${state ? 'Reverse' : 'Forward'}`
        : `${label} - ${state ? 'ON' : 'OFF'}`}
    </button>
  );
};

export default ToggleButton;
