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
    <div>
      <h2>Minhas Notas</h2>
      {notas.length > 0 ? (
        notas.map(nota => (
          <div key={nota.id}>{nota.conteudo}</div>
        ))
      ) : (
        <p>Nenhuma nota encontrada.</p>
      )}
      {error && <p>{error}</p>}
    </div>
  );
}

export default MinhasNotas;