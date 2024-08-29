'use client';
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import axios from 'axios';

// Dynamically import ApexCharts with SSR disabled for Next.js compatibility
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface TempGraphProps {
  system: 'System1' | 'System2'; // Specify the system type
  yAxisMin: number; // Minimum value for the Y-axis
  yAxisMax: number; // Maximum value for the Y-axis
}

const TempGraph: React.FC<TempGraphProps> = ({ system, yAxisMin, yAxisMax }) => {
  const [series, setSeries] = useState<{ name: string; data: number[] }[]>([
    { name: 'Heater Temperature', data: [] }
  ]);
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 1000); // Fetch data every second

    return () => clearInterval(interval); // Cleanup interval
  }, [system]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/addData');
      const data = response.data;

      // Access the data based on the system prop
      const systemData = data[system];

      if (systemData) {
        const timestamp = new Date().toLocaleTimeString();

        setCategories(prevCategories => {
          const updatedCategories = [...prevCategories, timestamp].slice(-5); // Keep last 5 timestamps
          return updatedCategories;
        });

        setSeries(prevSeries => [
          {
            name: 'Heater Temperature',
            data: [...prevSeries[0].data, parseFloat(systemData.temp)].slice(-5) // Keep last 5 heater temperatures
          }
        ]);

        setError(null); // Clear any previous errors
      } else {
        setError('No data available for the specified system.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch sensor data');
    }
  };

  const options: ApexOptions = {
    chart: {
      type: "line",
      height: '100%',
      zoom: { enabled: true },
      toolbar: { show: false },
    },
    xaxis: {
      categories: categories,
      title: { text: 'Time' },
    },
    yaxis: {
      min: yAxisMin, // Set minimum value for the Y-axis
      max: yAxisMax, // Set maximum value for the Y-axis
      title: { text: 'Temperature (°C)' },
    },
    stroke: {
      curve: "smooth",
    },
    markers: {
      size: 5,
    },
    tooltip: {
      enabled: true,
      theme: "dark",
      style: { fontSize: '14px' },
      x: { format: "dd/MM/yy HH:mm" },
      y: { formatter: (value) => `${value.toFixed(2)} °C` },
    },
    colors: ["#FF8C00"], // Add colors for the series
  };

  if (error) {
    return <div style={{ textAlign: 'center', color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div className="flex items-center justify-center p-4 md:p-8 w-full">
      <div className="w-full max-w-full lg:max-w-screen-lg">
        <ApexChart 
          options={options} 
          series={series} 
          type="area"
          height={300} 
          width="100%" 
        />
      </div>
    </div>
  );
};

export default TempGraph;
