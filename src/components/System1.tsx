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

const System1: React.FC = () => {
    const [softLow1, setSoftLow1] = useState<string>('');
    const [softHigh1, setSoftHigh1] = useState<string>('');
    const [heaterTemp1, setHeaterTemp1] = useState<string>('');
    const [doSoftLow1, setDoSoftLow1] = useState<string>('');
    const [doSoftHigh1, setDoSoftHigh1] = useState<string>('');

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
                // Set indicators for System1
                setIndicators(data.System1 || {});
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
            setSoftLow1(values.softLow || '');
            setSoftHigh1(values.softHigh || '');
        } else if (dialogTitle === 'Set DO Soft Limit') {
            setDoSoftLow1(values.doSoftLow || '');
            setDoSoftHigh1(values.doSoftHigh || '');
        } else if (dialogTitle === 'Set Temperature for Heater 1') {
            setHeaterTemp1(values.temp || '');
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
        <div className="w-100% max-w-4xl mx-auto bg-gray-100 p-4 rounded-lg shadow-md flex flex-col space-y-6">
            <Typography variant="h6" className="text-2xl font-semibold text-gray-800 mb-4 text-center">System 1 Controls</Typography>
            <Typography variant="h6" className="text-xl font-semibold text-gray-800 mb-4 text-center">Indicators</Typography>
            <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <Indicator label="Manual mode" isActive={indicators['System1.MANUAL_CONTROL_INDICATOR'] ?? false} />
                    <Indicator label="Acid Pump" isActive={indicators['System1.ACID_PUMP'] ?? false} />
                    <Indicator label="Base Pump" isActive={indicators['System1.BASE_PUMP'] ?? false} />
                    <Indicator label="Oxygen Valve" isActive={indicators['System1.OXYGEN_VALVE'] ?? false} />
                    <Indicator label="Nitrogen Valve" isActive={indicators['System1.NITROGEN_VALVE'] ?? false} />
                    <Indicator label="Heater" isActive={indicators['System1.TEMP_RELAY'] ?? false} />
                </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md flex flex-col md:flex-row gap-8">
                <div className="flex-1 flex flex-col items-center space-y-4">
                    <Typography variant="h6" className="text-xl font-semibold text-gray-800 mb-4 text-center">Motor Controls</Typography>
                    <ToggleButton
                        label="Motor ON / OFF"
                        postEndpoint="http://localhost:3001/data"
                        system="System1"
                        stateKey="motorState"
                        onStateChange={handleStateChange}
                    />
                    <ToggleButton
                        label="REVERSE Switch"
                        postEndpoint="http://localhost:3001/data"
                        system="System1"
                        stateKey="reverseDirection"
                        onStateChange={handleStateChange}
                    />
                </div>
                <div className="flex-1 flex flex-col items-center space-y-4">
                    <Typography variant="h6" className="text-xl font-semibold text-gray-800 mb-4 text-center">Speed of Motor</Typography>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <GaugeChartComponent
                            label="RPM"
                            min={0}
                            max={4000}
                            system="System1"
                        />
                    </div>
                </div>
            </div>
            <div className="flex-1 flex flex-row items-center space-y-4">
                <SliderComponent
                    system="System1"
                    postEndpoint="http://localhost:3001/data"
                    motorState={motorState}
                    reverseDirection={reverseDirection}
                />
            </div>
            <Typography variant="h6" className="text-2xl font-semibold text-gray-800 mb-4 text-center">System 1 Set Values</Typography>
            <div className="bg-white p-5 rounded-lg shadow-md flex flex-col items-center gap-4">
                <div className="flex flex-col md:flex-row gap-28 w-full">
                    <Button
                        onClick={() => handleDialogOpen('Set pH Soft Limits', { softLow: softLow1, softHigh: softHigh1 })}
                        label="Set pH Soft Limits"
                       
                        className="w-full md:w-auto"
                    />
                    <Button
                        onClick={() => handleDialogOpen('Set DO Soft Limit', { doSoftLow: doSoftLow1, doSoftHigh: doSoftHigh1 })}
                        label="Set DO Soft Limit"
                       
                        className="w-full md:w-auto"
                    />
                    <Button
                        onClick={() => handleDialogOpen('Set Temperature for Heater', { temp: heaterTemp1 })}
                        label="Set Temperature for Heater 1"
                     
                        className="w-full md:w-auto"
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                <div className="bg-white p-5 rounded-md shadow-md">
                    <Typography variant="h6" className="text-xl font-semibold text-gray-800 mb-4 text-center">pH Limits</Typography>
                    <TextField
                        label="Soft Low Value"
                        value={softLow1}
                        onChange={(e) => setSoftLow1(e.target.value)}
                        className="w-full text-center"
                        InputProps={{ readOnly: true }}
                    />
                    <TextField
                        label="Soft High Value"
                        value={softHigh1}
                        onChange={(e) => setSoftHigh1(e.target.value)}
                         className="w-full text-center mt-4"
                        InputProps={{ readOnly: true }}
                    />
                </div>
                <div className="bg-white p-5 rounded-md shadow-md">
                    <Typography variant="h6" className="text-xl font-semibold text-gray-800 mb-4 text-center">DO Limits</Typography>
                    <TextField
                        label="Soft Low Value"
                        value={doSoftLow1}
                        onChange={(e) => setDoSoftLow1(e.target.value)}
                        className="w-full text-center"
                        InputProps={{ readOnly: true }}
                    />
                    <TextField
                        label="Soft High Value"
                        value={doSoftHigh1}
                        onChange={(e) => setDoSoftHigh1(e.target.value)}
                        className="w-full text-center mt-4"
                        InputProps={{ readOnly: true }}
                    />
                </div>
                <div className="bg-white p-5 rounded-md shadow-md">
                    <Typography variant="h6" className="text-xl font-semibold text-gray-800 mb-4 text-center">Temperature</Typography>
                    <TextField
                        label="Temperature"
                        value={heaterTemp1}
                        onChange={(e) => setHeaterTemp1(e.target.value)}
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
                system='System1'
                initialValues={dialogValues}
                onClose={handleDialogClose}
                onSubmit={handleDialogSubmit}
            />
        </div>
    );
};

export default System1;
