import React, { useState } from 'react';
import {Box,Grid,TextField,Button,Typography,InputAdornment,} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalidadeFilter from '../LocalidadeFilter';

function Simulator() {
  const [address, setAddress] = useState('');
  const [finalAddress, setFinalAddress] = useState('');

  const handleAddressSubmit = () => {
    console.log('Endereço enviado:', address);
    console.log('Endereço final:', finalAddress);
  };

  return (
    <Grid item md={12}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 4,
          padding: 4,
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          backgroundColor: '#fff',
          color: '#333',
        }}
      >
        <Typography
          variant="h5"
          component="div"
          fontWeight="medium"
          sx={{ mb: 2 }}
        >
          Simule o preço da sua corrida
        </Typography>
        <Box sx={{ width: '100%' }}>
          <TextField
            label="Digite o endereço de partida"
            variant="outlined"
            fullWidth
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOnIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Digite o endereço de chegada"
            variant="outlined"
            fullWidth
            value={finalAddress}
            onChange={(e) => setFinalAddress(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOnIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <LocalidadeFilter formData={address} setFormData={setAddress} />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddressSubmit}
            startIcon={<SearchIcon />}
            sx={{
              width: '100%',
              height: '48px',
              fontSize: '16px',
              fontWeight: 'bold',
              mt: 2,
            }}
          >
            Buscar
          </Button>
        </Box>
      </Box>
    </Grid>
  );
}

export default Simulator;
