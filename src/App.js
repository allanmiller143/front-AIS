import React, { useState } from 'react';
import './App.css';
import Map from './Map';
import {
  Box,
  Grid,
  Typography,

} from '@mui/material';
import PricePredict from './Componentes/PricePredict';
import Simulator from './Componentes/Simulator';

function App() {
  const [coordinates, setCoordinates] = useState({ origin: null, destination: null });
  const [address, setAddress] = useState('');
  const [finalAddress, setFinalAddress] = useState('');
  const [resetTriggered, setResetTriggered] = useState(false);

  const [dialogFields, setDialogFields] = useState({
    street: '',
    city: '',
    state: '',
    neighborhood: '',
    houseNumber: '',
    country: '',
  });
  const [dialogFinalFields, setDialogFinalFields] = useState({
    street: '',
    city: '',
    state: '',
    neighborhood: '',
    houseNumber: '',
    country: '',
  });

  const [pricePredict, setPricePredict] = useState(null);
  const [loading,setLoading] = useState(false);


  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1E3C72, #2A5298)',
        color: '#fff',
      }}
    >
      <Box
        sx={{
          textAlign: 'center',
          mb: 4,
        }}
      >
        <Typography variant="h3" component="div" fontWeight="bold">
          CalcUber
        </Typography>
        <Typography variant="subtitle1" component="div">
          Saiba o preço da sua corrida
        </Typography>
      </Box>

      <Grid container spacing={4} sx={{ width: '100%', maxWidth: '1200px' }}>
        {/* Mapa */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              height: '60vh',
              borderRadius: 4,
              overflow: 'hidden',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              backgroundColor: '#fff',
            }}
          >
          <Map resetTriggered={resetTriggered} setResetTriggered={setResetTriggered}  setLoading  = {setLoading} setPricePredict={setPricePredict} coordinates={coordinates} address={address} setAddress={setAddress} finalAddress={finalAddress} setFinalAddress={setFinalAddress} dialogFields={dialogFields} setDialogFields={setDialogFields} dialogFinalFields={dialogFinalFields} setDialogFinalFields={setDialogFinalFields}   />
        </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              height: '60vh',
              borderRadius: 4,
              overflow: 'hidden',
              gap: 2,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
          <Simulator setPricePredict={setPricePredict} setLoading = {setLoading} resetTriggered={resetTriggered} setResetTriggered={setResetTriggered} coordinates={coordinates} setCoordinates={setCoordinates} address={address} setAddress={setAddress} finalAddress={finalAddress} setFinalAddress={setFinalAddress} dialogFields={dialogFields} setDialogFields={setDialogFields} dialogFinalFields={dialogFinalFields} setDialogFinalFields={setDialogFinalFields} />

          <PricePredict loading = {loading} pricePredict={pricePredict}/>
          </Box>
        </Grid>
        
      </Grid>
    </div>
  );
}

export default App;
