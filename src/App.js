import React, { useState } from 'react';
import './App.css';
import Map from './Map';
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalidadeFilter from './LocalidadeFilter';
import Simulator from './Componentes/Simulator';
import PricePredict from './Componentes/PricePredict';

function App() {
  const [address, setAddress] = useState('');
  const [finalAddress, setFinalAddress] = useState('');
  const [formData, setFormData] = useState({});
  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };


  const handleAddressSubmit = () => {
    // Aqui você pode enviar o endereço ao componente Map via props ou callback
    console.log('Endereço enviado:', address);
    console.log('Endereço final:', finalAddress);
  };

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
          Encontre o caminho ideal para seu destino
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
            <Map address={address} />
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
          <Simulator/>
          <PricePredict/>
          </Box>
        </Grid>
        
      </Grid>
    </div>
  );
}

export default App;
