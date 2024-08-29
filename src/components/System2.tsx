'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ToggleButton from '@/components/ToggleButton';
import SliderComponent from '@/components/SliderComponent';
import GaugeChartComponent from '@/components/GaugeChartComponent';
import { TextField, Typography } from '@mui/material';
import ValueDialog from '@/components/ValueDialog';
import TempGraph from '@/components/TempGraph';
import Button from '@/components/Button';
import Indicator from '@/components/Indicator'; // Import Indicator component

const System2: React.FC = () => {
    const [softLow2, setSoftLow2] = useState<string>('');
    const [softHigh2, setSoftHigh2] = useState<string>('');
    const [heaterTemp2, setHeaterTemp2] = useState<string>('');
    const [doSoftLow2, setDoSoftLow2] = useState<string>('');
    const [doSoftHigh2, setDoSoftHigh2] = useState<string>('');

    const [motorState, setMotorState] = useState<string>('OFF');
    const [reverseDirection, setReverseDirection] = useState<string>('OFF');

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogValues, setDialogValues] = useState<{ [key: string]: string }>({});

    const [indicators, setIndicators] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const fetchIndicators = async () => {
            try {
                const response = await axios.get('http://localhost:3001/addData');
                const data = response.data;
                // Set indicators for System2
                setIndicators(data.System2 || {});
            } catch (error) {
                console.error('Error fetching indicators', error);
            }
        };

        fetchIndicators();
        const interval = setInterval(fetchIndicators, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleDialogOpen = (title: string, values: { [key: string]: string }) => {
        setDialogTitle(title);
        setDialogValues(values);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleDialogSubmit = (values: { [key: string]: string }) => {
        if (dialogTitle === 'Set pH Soft Limits') {
            setSoftLow2(values.softLow || '');
            setSoftHigh2(values.softHigh || '');
        } else if (dialogTitle === 'Set DO Soft Limit') {
            setDoSoftLow2(values.doSoftLow || '');
            setDoSoftHigh2(values.doSoftHigh || '');
        } else if (dialogTitle === 'Set Temperature for Heater') {
            setHeaterTemp2(values.temp || '');
        }
        handleDialogClose();
    };

    const handleStateChange = (stateKey: 'motorState' | 'reverseDirection' | 'syncState', state: string) => {
        if (stateKey === 'motorState') {
            setMotorState(state);
        } else if (stateKey === 'reverseDirection') {
            setReverseDirection(state);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto bg-gray-100 dark:bg-gray-100 p-4 rounded-lg shadow-md flex flex-col space-y-6">
            <Typography variant="h6" className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4 text-center">System 2 Controls</Typography>
            <Typography variant="h6" className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 text-center">Indicators</Typography>
            <div className="bg-white dark:bg-gray-100 p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <Indicator label="Manual mode" isActive={indicators['System2.MANUAL_CONTROL_INDICATOR'] ?? false} />
                    <Indicator label="Acid Pump" isActive={indicators['System2.ACID_PUMP'] ?? false} />
                    <Indicator label="Base Pump" isActive={indicators['System2.BASE_PUMP'] ?? false} />
                    <Indicator label="Oxygen Valve" isActive={indicators['System2.OXYGEN_VALVE'] ?? false} />
                    <Indicator label="Nitrogen Valve" isActive={indicators['System2.NITROGEN_VALVE'] ?? false} />
                    <Indicator label="Heater" isActive={indicators['System2.TEMP_RELAY'] ?? false} />
                </div>
            </div>
            <div className="bg-white dark:bg-gray-100 p-8 rounded-lg shadow-md flex flex-col md:flex-row gap-8">
                <div className="flex-1 flex flex-col items-center space-y-4">
                    <Typography variant="h6" className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 text-center">Motor Controls</Typography>
                    <ToggleButton
                        label="Motor ON / OFF"
                        postEndpoint="http://localhost:3001/data"
                        system="System2"
                        stateKey="motorState"
                        onStateChange={handleStateChange}
                    />
                    <ToggleButton
                        label="REVERSE Switch"
                        postEndpoint="http://localhost:3001/data"
                        system="System2"
                        stateKey="reverseDirection"
                        onStateChange={handleStateChange}
                    />
                </div>
                <div className="flex-1 flex flex-col items-center space-y-4">
                    <Typography variant="h6" className="text-xl font-semibold text-gray-800 dark:text-gray-900 mb-4 text-center">Speed of Motor</Typography>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <GaugeChartComponent
                            label="RPM"
                            min={0}
                            max={4000}
                            system="System2"
                        />
                    </div>
                </div>
            </div>
            <div className="flex-1 flex flex-row items-center space-y-4">
                <SliderComponent
                    system="System2"
                    postEndpoint="http://localhost:3001/data"
                    motorState={motorState}
                    reverseDirection={reverseDirection}
                />
            </div>
            <Typography variant="h6" className="text-2xl font-semibold text-gray-100 dark:text-gray-900 mb-4 text-center">System 2 Set Values</Typography>
            <div className="bg-white dark:bg-gray-100 p-5 rounded-lg shadow-md flex flex-col items-center gap-4">
                <div className="flex flex-col md:flex-row gap-28 w-full">
                    <Button
                        onClick={() => handleDialogOpen('Set pH Soft Limits', { softLow: softLow2, softHigh: softHigh2 })}
                        label="Set pH Soft Limits"
                        className="w-full md:w-auto"
                    />
                    <Button
                        onClick={() => handleDialogOpen('Set DO Soft Limit', { doSoftLow: doSoftLow2, doSoftHigh: doSoftHigh2 })}
                        label="Set DO Soft Limit"
                        className="w-full md:w-auto"
                    />
                    <Button
                        onClick={() => handleDialogOpen('Set Temperature for Heater', { temp: heaterTemp2 })}
                        label="Set Temperature for Heater 2"
                        className="w-full md:w-auto"
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                <div className="bg-white dark:bg-gray-100 p-5 rounded-md shadow-md">
                    <Typography variant="h6" className="text-xl font-semibold text-gray-800 dark:text-gray-800 mb-4 text-center">pH Limits</Typography>
                    <TextField
                        label="Soft Low Value"
                        value={softLow2}
                        onChange={(e) => setSoftLow2(e.target.value)}
                        className="w-full text-center"
                        InputProps={{ readOnly: true }}
                    />
                    <TextField
                        label="Soft High Value"
                        value={softHigh2}
                        onChange={(e) => setSoftHigh2(e.target.value)}
                       className="w-full text-center mt-4"
                        InputProps={{ readOnly: true }}
                    />
                </div>
                <div className="bg-white dark:bg-gray-100 p-5 rounded-md shadow-md">
                    <Typography variant="h6" className="text-xl font-semibold text-gray-800 dark:text-gray-800 mb-4 text-center">DO Limits</Typography>
                    <TextField
                        label="Soft Low Value"
                        value={doSoftLow2}
                        onChange={(e) => setDoSoftLow2(e.target.value)}
                        className="w-full text-center"
                        InputProps={{ readOnly: true }}
                    />
                    <TextField
                        label="Soft High Value"
                        value={doSoftHigh2}
                        onChange={(e) => setDoSoftHigh2(e.target.value)}
                        className="w-full text-center mt-4"
                        InputProps={{ readOnly: true }}
                    />
                </div>
                <div className="bg-white dark:bg-gray-100 p-5 rounded-md shadow-md">
                    <Typography variant="h6" className="text-xl font-semibold text-gray-800 dark:text-gray-800 mb-4 text-center">Heater Temp</Typography>
                    <TextField
                        label="Temperature"
                        value={heaterTemp2}
                        onChange={(e) => setHeaterTemp2(e.target.value)}
                        className="w-full text-center"
                        InputProps={{ readOnly: true }}
                    />
                </div>
                     <div className="col-span-1 lg:col-span-5 grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <Typography variant="h6" className="text-xl font-semibold text-gray-800 mb-4 text-center">pH Level</Typography>
                        <GaugeChartComponent
                            label="pH Level"
                            min={0}
                            max={14}
                            system="System2"
                        />
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <Typography variant="h6" className="text-xl font-semibold text-gray-800 mb-4 text-center">DO Level</Typography>
                        <GaugeChartComponent
                            label="DO Level"
                            min={0}
                            max={100}
                            system="System2"
                        />
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <Typography variant="h6" className="text-xl font-semibold text-gray-800 mb-4 text-center">Temperature Graph</Typography>
                <TempGraph system="System2" yAxisMin={0} yAxisMax={100} />
            
           
                </div>
            <ValueDialog
                open={dialogOpen}
                title={dialogTitle}
                system='System2'
                initialValues={dialogValues}
                onClose={handleDialogClose}
                onSubmit={handleDialogSubmit}
            />
        </div>
    );
};

export default System2;
