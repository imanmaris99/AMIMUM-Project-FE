import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

const steps = [
  'Alamat Toko',
  'Alamat Tujuan',
  'Spesifikasi Paket',
];

interface StepperProps {
  currentStep: number;
}

const HorizontalLinearAlternativeLabelStepper: React.FC<StepperProps> = ({ currentStep }) => {
  return (
    <Box sx={{ width: '100%' }} className="bg-customGreen5 p-4 w-96">
      <Stepper 
        activeStep={currentStep}
        alternativeLabel
        sx={{
          '& .MuiStepIcon-root.Mui-active': {
            color: 'hsl(var(--primary))',
          },
          '& .MuiStepIcon-root.Mui-completed': {
            color: 'hsl(var(--primary))',
          },
          '& .MuiStepLabel-root': {
            color: 'gray',
          },
        }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel className="whitespace-nowrap">{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}

export default HorizontalLinearAlternativeLabelStepper;
