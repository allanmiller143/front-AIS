import React, { useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  InputAdornment,

} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios';
import AddressDialog from './AddressDialog';

function Simulator({coordinates, setCoordinates,address, setAddress,finalAddress, setFinalAddress,dialogFields, setDialogFields,dialogFinalFields, setDialogFinalFields}) {

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogFinalOpen, setDialogFinalOpen] = useState(false);
  const [isOrigin, setIsOrigin] = useState(true);


  const handleDialogOpen = (isOriginAddress) => {
    setIsOrigin(isOriginAddress);
    setDialogOpen(true);
  };

  const handleDialogFinalOpen = (isOriginAddress) => {
    setIsOrigin(isOriginAddress);
    setDialogFinalOpen(true);
  };

  const geocodeAddress = async (address) => {
    if(address === '') {
      alert('Digite um endereço');
      return null;
    }
    try {
      const apiKey = 'AIzaSyAVeHeLlZpHTRW5PHirwQkDBc3yCg3rN94'; // Substitua pela sua chave de API
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address: address,
            key: apiKey,
          },
        }
      );
      if (response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry.location;
        return { lat, lng };
      } else {
        alert('Endereço não encontrado');
        return null;
      }
    } catch (error) {
      console.error('Erro ao geocodificar endereço:', error);
      alert('Erro ao geocodificar endereço.');
      return null;
    }
  };

  const handleAddressSubmit = async () => {
    const originCoords = await geocodeAddress(address);
    const destinationCoords = await geocodeAddress(finalAddress);

    if(originCoords === null || destinationCoords === null) { 
      return
    }

    if (originCoords && destinationCoords) {
      setCoordinates({
        origin: originCoords,
        destination: destinationCoords,
      });
      console.log('Coordenadas:', {
        origin: originCoords,
        destination: destinationCoords,
      });
    }

    const routeData = {
      latOrigin: originCoords.lat,
      lngOrigin: originCoords.lng,
      latDest: destinationCoords.lat,
      lngDest: destinationCoords.lng,
    };
    console.log(routeData);
    
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
            label="Endereço de partida"
            variant="outlined"
            fullWidth
            value={address}
            onClick={() => handleDialogOpen(true)}
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
            label="Endereço de chegada"
            variant="outlined"
            fullWidth
            value={finalAddress}
            onClick={() => handleDialogFinalOpen(false)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOnIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
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
      <AddressDialog setAddress={setAddress} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} isOrigin={isOrigin} dialogFields={dialogFields} setDialogFields={setDialogFields} />
      <AddressDialog setAddress={setFinalAddress} dialogOpen={dialogFinalOpen} setDialogOpen={setDialogFinalOpen} isOrigin={isOrigin}  dialogFields={dialogFinalFields} setDialogFields={setDialogFinalFields}/>

     
    </Grid>
  );
}

export default Simulator;
