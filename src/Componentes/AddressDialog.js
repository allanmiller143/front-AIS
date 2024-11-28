import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { Cancel } from '@mui/icons-material';

function AddressDialog({ setAddress, dialogOpen, setDialogOpen, isOrigin, dialogFields, setDialogFields }) {
  const states = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDialogSubmit = () => {
    const fullAddress = `${dialogFields.houseNumber} ${dialogFields.street}, ${dialogFields.neighborhood}, ${dialogFields.city}, ${dialogFields.state}, ${dialogFields.country}`;
    setAddress(fullAddress);
    handleDialogClose();
  };

  const resetFields = () => {
    setDialogFields({
      street: '',
      city: '',
      state: '',
      neighborhood: '',
      houseNumber: '',
      country: '',
    });
    setAddress('');
  };

  return (
    <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <Typography variant="h6" component="span" style={{ flexGrow: 1 }}>
            Insira os detalhes do endereço
          </Typography>
          <IconButton edge="end" color="inherit" onClick={handleDialogClose} aria-label="close">
            <Cancel />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Rua"
          fullWidth
          variant="outlined"
          margin="dense"
          value={dialogFields.street}
          onChange={(e) => setDialogFields({ ...dialogFields, street: e.target.value })}
        />
        <TextField
          label="Número da Casa"
          fullWidth
          variant="outlined"
          margin="dense"
          value={dialogFields.houseNumber}
          onChange={(e) => setDialogFields({ ...dialogFields, houseNumber: e.target.value })}
        />
        <TextField
          label="Bairro"
          fullWidth
          variant="outlined"
          margin="dense"
          value={dialogFields.neighborhood}
          onChange={(e) => setDialogFields({ ...dialogFields, neighborhood: e.target.value })}
        />
        <TextField
          label="Cidade"
          fullWidth
          variant="outlined"
          margin="dense"
          value={dialogFields.city}
          onChange={(e) => setDialogFields({ ...dialogFields, city: e.target.value })}
        />
        
        {/* Campo de Estado com Select */}
        <FormControl fullWidth variant="outlined" margin="dense">
          <InputLabel>Estado</InputLabel>
          <Select
            value={dialogFields.state}
            onChange={(e) => setDialogFields({ ...dialogFields, state: e.target.value })}
            label="Estado"
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 300,
                  width: 250,
                },
              },
            }}
          >
            {states.map((state) => (
              <MenuItem key={state} value={state}>
                {state}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <TextField
          label="País"
          fullWidth
          variant="outlined"
          margin="dense"
          value={dialogFields.country}
          onChange={(e) => setDialogFields({ ...dialogFields, country: e.target.value })}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={resetFields} color="secondary">
          Resetar campos
        </Button>
        <Button onClick={handleDialogSubmit} color="primary" variant="contained">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddressDialog;
