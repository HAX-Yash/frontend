import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';

interface ValueDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: { [key: string]: string }) => void;
  system: 'System1' | 'System2';
  title: string;
  initialValues: { [key: string]: string };
}

const ValueDialog: React.FC<ValueDialogProps> = ({ open, onClose, onSubmit, system, title, initialValues }) => {
  const [values, setValues] = useState<{ [key: string]: string }>(initialValues);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleSubmit = async () => {
    try {
      // Post data to the backend
      const response = await axios.post('http://localhost:3001/data', {
        system,
        data: values,
      });

      console.log('Data posted successfully:', response.data);
      onSubmit(values); // Pass values to parent component
      onClose(); // Close dialog
    } catch (error) {
      console.error('Error posting data', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {title === 'Set pH Soft Limits' && (
          <>
            <TextField
              label="Soft Low Value"
              name="softLow"
              value={values.softLow || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Soft High Value"
              name="softHigh"
              value={values.softHigh || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </>
        )}
        {title === 'Set DO Soft Limit' && (
          <>
            <TextField
              label="DO Soft Low Value"
              name="doSoftLow"
              value={values.doSoftLow || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="DO Soft High Value"
              name="doSoftHigh"
              value={values.doSoftHigh || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </>
        )}
        {title === 'Set Temperature for Heater' && (
          <TextField
            label="Temperature"
            name="temp"
            value={values.temp || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ValueDialog;
