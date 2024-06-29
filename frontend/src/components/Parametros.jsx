import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../backend/src/routes/api';
import { Container, Box, Paper, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TextField, Button, useMediaQuery } from '@mui/material';
import Swal from 'sweetalert2';

const Parametros = () => {
  const { numero, cama } = useParams();
  const navigate = useNavigate();
  const [parametros, setParametros] = useState({
    pas: '',
    pad: '',
    fc: '',
    fr: '',
    temp: '',
    peso: '',
    talla: '',
    spo2: '',
    glucometria: '',
    HemoglucotestPreprandial: '',
    HemoglucotestPostprandial: ''
  });
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [dniPaciente, setDniPaciente] = useState('');
  const [nombrePaciente, setNombrePaciente] = useState('');
  const [apellidoPaciente, setApellidoPaciente] = useState('');

  useEffect(() => {
    const fetchParametros = async () => {
      try {
        const habitacionResponse = await api.get(`/habitaciones/${numero}/${cama}`);
        const pacienteDni = habitacionResponse.data.pacienteDni;

        if (pacienteDni) {
          setDniPaciente(pacienteDni);

          const pacienteResponse = await api.get(`/pacientes/${pacienteDni}`);
          setNombrePaciente(pacienteResponse.data.nombre);
          setApellidoPaciente(pacienteResponse.data.apellido);

          const parametrosResponse = await api.get(`/parametros/${pacienteDni}`);
          setParametros(parametrosResponse.data);
        } else {
          console.error('No se encontró el DNI del paciente en la habitación:', numero, cama);
        }
      } catch (error) {
        console.error('Error al fetchear los parámetros:', error.message);
      }
    };

    fetchParametros();
  }, [numero, cama]);

  const handleChange = (e, parametro) => {
    const { value } = e.target;
    setParametros(prevState => ({
      ...prevState,
      [parametro]: value
    }));
  };

  const handleSave = async () => {
    try {
      const response = await api.post('/parametros/', {
        dniPaciente,
        ...parametros
      });
      console.log('Respuesta del servidor:', response.data);

      const pacienteResponse = await api.get(`/pacientes/${response.data.dniPaciente}`);
      setNombrePaciente(pacienteResponse.data.nombre);
      setApellidoPaciente(pacienteResponse.data.apellido);

      setParametros(response.data); // Actualiza el estado con los datos guardados  
      // Muestra la alerta de éxito
      Swal.fire({
        icon: 'success',
        title: 'Datos guardados',
        text: 'Los parámetros clínicos han sido guardados exitosamente',
        confirmButtonText: 'OK'
      }).then(() => {
        // Redirige a la habitación después de cerrar la alerta
        navigate(`/habitaciones/${numero}/${cama}`);
      });

    } catch (error) {
      console.error('Error al guardar los parámetros:', error.message);

      // Muestra la alerta de error
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al guardar los parámetros. Por favor, inténtelo nuevamente.',
        confirmButtonText: 'OK'
      });
    }
  };

  const getClasificacion = (parametro, valor) => {
    const numericValue = parseFloat(valor);
    switch (parametro) {
      case 'pas':
        if (numericValue < 90) return 'Hipotensión';
        if (numericValue > 120) return 'HTA nivel 1';
        return 'Normal';
      case 'pad':
        if (numericValue < 60) return 'Hipotensión';
        if (numericValue > 90) return 'HTA nivel 1';
        return 'Normal';
      case 'fc':
        if (numericValue < 60) return 'Bradicardia';
        if (numericValue > 100) return 'Taquicardia';
        return 'Normal';
      case 'fr':
        if (numericValue < 12) return 'Bradipnea';
        if (numericValue > 20) return 'Taquipnea';
        return 'Normal';
      case 'temp':
        if (numericValue < 35.5) return 'Hipotermia';
        if (numericValue > 37.4) return 'Fiebre';
        return 'Normal';
      case 'spo2':
        if (numericValue < 95) return 'Hipoxemia';
        return 'Normal';
      case 'glucometria':
        if (numericValue < 70) return 'Hipoglucemia';
        if (numericValue > 110) return 'Hiperglucemia';
        return 'Normal';
      case 'HemoglucotestPreprandial':
        if (numericValue < 70) return 'Hipoglucemia';
        if (numericValue > 110) return 'Hiperglucemia';
        return 'Normal';
      case 'HemoglucotestPostprandial':
        if (numericValue < 70) return 'Hipoglucemia';
        if (numericValue > 140) return 'Hiperglucemia';
        return 'Normal';
      default:
        return '';
    }
  };

  if (!parametros) {
    return <p>Cargando parámetros...</p>;
  }

  return (
    <Container>
      <Paper elevation={2} style={{
        maxWidth: 1200,
        maxHeight: 1060,
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 1)',
        margin: 'auto', marginTop: 50
      }}>
        <Box p={3}>
          <Typography variant="h4" align="center" gutterBottom>
            Parámetros Clínicos - Habitación {numero} - Cama {cama}
          </Typography>
          <Typography align="center" gutterBottom>
            Paciente: {nombrePaciente || 'Sin nombre'} {apellidoPaciente || 'Sin apellido'} (DNI: {dniPaciente})
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>Parámetros Clínicos</TableCell>
                  {!isMobile && (
                    <>
                      <TableCell style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>Valor Referencia Mín.</TableCell>
                      <TableCell style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>Valor Referencia Máx.</TableCell>
                    </>
                  )}
                  <TableCell style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>Valor Tomado</TableCell>
                  {!isMobile && <TableCell style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>Unidades</TableCell>}
                  <TableCell style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>Clasificación</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {['pas', 'pad', 'fc', 'fr', 'temp', 'peso', 'talla', 'spo2', 'glucometria', 'HemoglucotestPreprandial', 'HemoglucotestPostprandial'].map(parametro => (
                  <TableRow key={parametro}>
                    <TableCell style={{ backgroundColor: '#f8f8f8' }}>{getParametroName(parametro)}</TableCell>
                    {!isMobile && (
                      <>
                        <TableCell>{getValorReferenciaMin(parametro)}</TableCell>
                        <TableCell>{getValorReferenciaMax(parametro)}</TableCell>
                      </>
                    )}
                    <TableCell>
                      <TextField
                        value={parametros[parametro] || ''}
                        onChange={(e) => handleChange(e, parametro)}
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    </TableCell>
                    {!isMobile && <TableCell>{getUnidades(parametro)}</TableCell>}
                    <TableCell>{getClasificacion(parametro, parametros[parametro])}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box mt={2} display="flex" justifyContent="center">
            <Button variant="contained" color="primary" onClick={handleSave}>
              Guardar
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

const getParametroName = (parametro) => {
  switch (parametro) {
    case 'pas': return 'P.A. Sistólica';
    case 'pad': return 'P.A. Diastólica';
    case 'fc': return 'Frecuencia Cardíaca';
    case 'fr': return 'Frecuencia Respiratoria';
    case 'temp': return 'Temperatura';
    case 'peso': return 'Peso (por referencia)';
    case 'talla': return 'Talla (por referencia)';
    case 'spo2': return 'Saturación de Oxígeno';
    case 'glucometria': return 'Glucometría';
    case 'HemoglucotestPreprandial': return 'Hemoglucotest Preprandial';
    case 'HemoglucotestPostprandial': return 'Hemoglucotest Postprandial';
    default: return '';
  }
};

const getValorReferenciaMin = (parametro) => {
  switch (parametro) {
    case 'pas': return 90;
    case 'pad': return 60;
    case 'fc': return 60;
    case 'fr': return 12;
    case 'temp': return 35.5;
    case 'spo2': return 95;
    case 'glucometria': return 70;
    case 'HemoglucotestPreprandial': return 70;
    case 'HemoglucotestPostprandial': return 70;
    default: return '';
  }
};

const getValorReferenciaMax = (parametro) => {
  switch (parametro) {
    case 'pas': return 120;
    case 'pad': return 90;
    case 'fc': return 100;
    case 'fr': return 20;
    case 'temp': return 37.4;
    case 'spo2': return 100;
    case 'glucometria': return 110;
    case 'HemoglucotestPreprandial': return 110;
    case 'HemoglucotestPostprandial': return 140;
    default: return '';
  }
};

const getUnidades = (parametro) => {
  switch (parametro) {
    case 'pas': 
    case 'pad': return 'mmHg';
    case 'fc': 
    case 'fr': return 'lpm';
    case 'temp': return '°C';
    case 'peso': return 'kg';
    case 'talla': return 'cm';
    case 'spo2': return '%';
    case 'glucometria':
    case 'HemoglucotestPreprandial':
    case 'HemoglucotestPostprandial': return 'mg/dl';
    default: return '';
  }
};

export default Parametros;
