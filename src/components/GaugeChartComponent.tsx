'use client';

import React, { useEffect, useState } from 'react';
import GaugeChart from 'react-gauge-chart';
import { Typography } from '@mui/material';
import axios from 'axios';

interface GaugeChartComponentProps {
  label: string;
  min: number;
  max: number;
  width?: string;
  system: string; // Fetch data based on system
}

const GaugeChartComponent: React.FC<GaugeChartComponentProps> = ({ label, min, max, width = '100%', system }) => {
  const [value, setValue] = useState<number>(0);
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/addData');
        
        // Assuming response.data contains data for both systems
        const data = response.data;

        // Access the data based on the system prop
        const systemData = data[system];
        if (systemData) {
          setError(null); // Reset error state on successful fetch
          if (label === 'pH Level') {
            setValue(parseFloat(systemData.pH_value));
          } else if (label === 'DO Level') {
            setValue(parseFloat(systemData.DO_value));
          } else if (label === 'RPM') {
            setValue(parseFloat(systemData.RPM_value));
          } else if (label === 'Temperature') {  // Handle temp parameter
            setValue(parseFloat(systemData.temp || '0'));
          }
        } else {
          setError('No data available for the specified system.');
        }
      } catch (error) {
        setError('Error fetching data');
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  
    const intervalId = setInterval(fetchData, 1000);
  
    return () => clearInterval(intervalId);
  }, [label, system]);

  if (typeof value !== 'number' || typeof min !== 'number' || typeof max !== 'number') {
    console.error('Invalid prop types: value, min, and max must be numbers.');
    return null;
  }

  if (min === max) {
    console.error('Min and max values must be different.');
    return null;
  }

  const percent = (value - min) / (max - min);

  return (
    <div className="relative flex flex-col items-center p-4" style={{ width }}>
      <Typography variant="h6" className="text-lg md:text-xl font-semibold mb-2 text-center">{label}</Typography>
      
      {error ? (
        <Typography variant="body1" color="error">{error}</Typography>
      ) : (
        <div className="relative w-full">
          <GaugeChart
            id={`gauge-chart-${label}`}
            nrOfLevels={1}
            percent={percent}
            textColor="black"
            needleColor="white"
            colors={['#3498db', '#e0e0e0']}
            arcWidth={0.1}
            arcsLength={[percent, 1 - percent]}
            animate={false}
            formatTextValue={() => ''} // No text value formatting needed
          />
          <div className="absolute inset-0 flex items-center justify-center" style={{ marginTop: '12%' }}>
            <Typography variant="h4" className="text-black font-bold text-lg md:text-xl">{value}</Typography>
          </div>
        </div>
      )}

      <style jsx>{`
        #gauge-chart-${label} .needle {
          display: none !important;
        }
      `}</style>
    </div>
  );
};

export default GaugeChartComponent;
