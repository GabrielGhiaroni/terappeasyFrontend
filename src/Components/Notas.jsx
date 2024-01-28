import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function MinhasNotas() {
  const [notas, setNotas] = useState([]);
  const [error, setError] = useState('');
  const {id} = useParams();

  useEffect(() => {
    const fetchNotas = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/${id}/minhas-notas`, {
          headers: { Authorization: localStorage.getItem('token') }
        });
        setNotas(response.data); // Atribuindo diretamente o array de notas recebido
      } catch (err) {
        setError('Erro ao buscar notas');
      }
    };

    fetchNotas();
  }, [id]); // A função será executada quando o valor de 'id' mudar

  return (
    <div className="notas-page">
      <h2 className="notas-title">Minhas Notas</h2>
      {notas.length > 0 ? (
        notas.map(nota => (
          <div key={nota.id} className="nota">
          <p className="nota-content">{nota.conteudo}</p>  
          </div>
        ))
      ) : (
        <p className="error-message">Nenhuma nota encontrada.</p>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default MinhasNotas;