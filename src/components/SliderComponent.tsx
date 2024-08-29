import React, { useState } from 'react';
import axios from 'axios';

interface SliderComponentProps {
  system: string;
  postEndpoint: string;
  motorState: string;
  reverseDirection: string;
}

const SliderComponent: React.FC<SliderComponentProps> = ({ system, postEndpoint, motorState, reverseDirection }) => {
  const [sliderValue, setSliderValue] = useState<number>(0);

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setSliderValue(value);

    // Prepare the data to be sent in the required format
    const data = {
      system,
      data: {
        motorState,
        reverseDirection,
        motorSpeed: value,
      },
    };

    // Send data to the endpoint
    axios.post(postEndpoint, data)
      .then(response => {
        console.log('Data sent successfully:', response.data);
      })
      .catch(error => {
        console.error('Error sending data:', error);
      });
  };

  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-lg p-4">
      <div className="slider-container">
        <h2 className="text-lg text-center font-semibold text-gray-800 mb-2">Motor Speed Control</h2>
        <input
          id="motorSpeedSlider"
          type="range"
          min={0}
          max={4000}
          value={sliderValue}
          onChange={handleSliderChange}
          className="w-full mt-2 bg-gray-200 rounded-lg"
        />
        <label htmlFor="motorSpeedSlider" className="block text-sm text-center font-medium text-gray-700">
          Motor Speed: {sliderValue} RPM
        </label>
      </div>
    </div>
  );
};

export default SliderComponent;
