import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function MinhasNotas() {
  const [notas, setNotas] = useState([]);
  const [error, setError] = useState('');
  const [novaNota, setNovaNota] = useState('');
  const [criandoNota, setCriandoNota] = useState(false);
  const {id} = useParams();

    useEffect(() => {
      fetchNotas();
    }, [id]);

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

  const handleNovaNota = () => {
    setCriandoNota(true);
  };

  const handleSalvarNota = async () => {
    try {
      const response = await axios.post(`http://localhost:3000/${id}/minhas-notas`, {
        conteudo: novaNota
      }, {
        headers: { Authorization: localStorage.getItem('token') }
      });
      setCriandoNota(false);
      setNovaNota('');
      fetchNotas(); // Atualiza a lista de notas após adicionar uma nova
    } catch (err) {
      setError('Erro ao salvar a nota');
    }
  };

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
       {criandoNota ? (
        <div>
          <textarea 
              value={novaNota}
              onChange={(e) => setNovaNota(e.target.value)}
              cols="10"
              rows="2"
              placeholder='Digite aqui a sua nova nota'
          />
          <button onClick={handleSalvarNota}>Salvar Nota</button>
        </div>
      ) : (
      <button className='btn-nova-nota' onClick={handleNovaNota}>Nova nota</button>
      )}
    </div>
  );
}

export default MinhasNotas;