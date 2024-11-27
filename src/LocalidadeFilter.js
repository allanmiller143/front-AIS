/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useCallback } from 'react';
import { Box, TextField, FormControl } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';

const LocalidadeFilter = ({ formData, setFormData }) => {
    const [enderecos, setEnderecos] = useState([]); // Endereços retornados pela API
    const [loading, setLoading] = useState(false); // Estado de carregamento
    const [inputValue, setInputValue] = useState(''); // Valor digitado pelo usuário
    const [searchValue, setSearchValue] = useState(''); // Valor enviado para busca

    // Chave da API (substitua pela sua chave do Google Places API)
    const API_KEY = 'AIzaSyAVeHeLlZpHTRW5PHirwQkDBc3yCg3rN94';

    // Função que busca endereços completos na Google Places API
    const fetchEnderecos = useCallback(async (searchTerm) => {
        setLoading(true); // Inicia o carregamento
        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
                {
                    params: {
                        input: searchTerm,
                        key: API_KEY,
                        types: 'geocode', // Busca apenas endereços
                        language: 'pt-BR', // Configura o idioma para português
                    },
                }
            );

            // Formata os endereços retornados
            const enderecosFormatados = response.data.predictions.map(
                (pred) => pred.description
            );
            setEnderecos(enderecosFormatados);
        } catch (error) {
            console.error('Erro ao buscar endereços:', error);
            setEnderecos([]); // Limpa os endereços se houver erro
        }
        setLoading(false); // Termina o carregamento
    }, []);

    // Atualiza o valor de busca com debounce para evitar excesso de chamadas
    const handleInputChange = (event, newInputValue) => {
        setInputValue(newInputValue); // Atualiza o inputValue imediatamente

        // Atualiza o valor de busca apenas quando houver mais de 3 caracteres
        if (newInputValue && newInputValue.length >= 3) {
            setSearchValue(newInputValue); // Define o valor de busca
            fetchEnderecos(newInputValue); // Faz a busca de endereços
        } else {
            setEnderecos([]); // Limpa os resultados se o valor for menor que 3 caracteres
        }
    };

    // Função que lida com a seleção de um endereço
    const handleSelectChange = (event, newValue) => {
        if (newValue) {
            // Atualiza o formData com o endereço completo selecionado
            setFormData((prevFormData) => ({
                ...prevFormData,
                enderecoCompleto: newValue, // Salva o endereço completo
            }));
        }
    };

    return (
        <Box sx={{ width: '100%', pb: 2 }}>
            <FormControl fullWidth margin="none">
                <Autocomplete
                    freeSolo
                    options={enderecos} // Usa os endereços retornados da API
                    loading={loading} // Mostra o ícone de carregamento
                    inputValue={inputValue} // Mostra o valor atual do input
                    onInputChange={handleInputChange} // Função de mudança de valor
                    onChange={handleSelectChange} // Captura a mudança de seleção
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Digite um endereço"
                            variant="outlined"
                            InputProps={{
                                ...params.InputProps,
                            }}
                        />
                    )}
                />
            </FormControl>
        </Box>
    );
};

export default LocalidadeFilter;
