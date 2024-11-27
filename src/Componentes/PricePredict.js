import React from 'react';
import { Box, Grid, Typography } from '@mui/material';

function PricePredict() {

  return (
    <Grid item xs={12}>
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
          sx={{ mb: 1 }}
        >
          O preço da sua corrida é de:
        </Typography>
        <Typography
          variant="h4"
          component="div"
          fontWeight="bold"
          sx={{ color: '#1976D2' }}
        >
          R$ {' '} reais
        </Typography>
      </Box>
    </Grid>
  );
}

export default PricePredict;
