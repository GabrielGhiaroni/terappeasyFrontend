import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {FaPencilAlt, FaTrash} from 'react-icons/fa';

function MinhasNotas() {
  const [notas, setNotas] = useState([]);
  const [error, setError] = useState('');
  const [novaNota, setNovaNota] = useState('');
  const [criandoNota, setCriandoNota] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editTexto, setEditTexto] = useState('');
  const [mostrarConfirmacaoModal, setMostrarConfirmacaoModal] = useState(false);
  const [notaParaDeletar, setNotaParaDeletar] = useState(null);
  const {id} = useParams();

    useEffect(() => {
      fetchNotas();
    }, [id]);

    const fetchNotas = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/notas/${id}`, {
          headers: { Authorization: localStorage.getItem('token') }
        });
        setNotas(response.data);
      } catch (err) {
        setError('Erro ao buscar notas');
      }
    };

  const handleNovaNota = () => {
    setCriandoNota(true);
  };

  const handleSalvarNota = async () => {
    try {
      const response = await axios.post(`http://localhost:3000/notas/${id}`, {
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

  const handleEditarNota = (notaId, texto) => {
    setEditId(notaId);
    setEditTexto(texto);
  }

  const handleSalvarEdicao = async () => {
    try {
      const response = await axios.put(`http://localhost:3000/notas/${editId}`, { conteudo: editTexto }, { headers: { Authorization: localStorage.getItem('token') } });
      
      // Atualiza a nota no estado sem recarregar todas do servidor
      const notasAtualizadas = notas.map(nota => {
        if (nota.id === editId) {
          return { ...nota, conteudo: editTexto }; // Atualiza o conteúdo da nota editada
        }
        return nota; // Retorna as outras notas sem alteração
      });

      setNotas(notasAtualizadas); // Atualiza o estado com as notas atualizadas
      setEditId(null); // Sai do modo de edição
      setEditTexto(''); // Limpa o campo de edição
    } catch (error) {
      setError('Erro ao salvar nota.');
    }
  }
  
  const handleDeletarNota = async (notaId) => {
    try {
      await axios.delete(`http://localhost:3000/notas/${notaId}`, {
        headers: {Authorization: localStorage.getItem('token')}
      });
      //aqui, estou filtrando todas as notas que não possuem um id igual ao id da nota passanda como parâmetro.
      //essas notas serão novamente incluidas num array, equanto a nota que for igual será descartada.
      setNotas(notas.filter(nota => nota.id !== notaId));
      setMostrarConfirmacaoModal(false); //fecha a modal após a exclusão.
      setNotaParaDeletar(null); //reseta a nota selecionada.
    } catch (error) {
      setError('Erro ao deletar nota.');
      setMostrarConfirmacaoModal(false); //fecha  modal em caso de erro.
    }
  };

  const confirmarDeletarNota = (notaId) => {
    setMostrarConfirmacaoModal(true);
    setNotaParaDeletar(notaId);
  };

  return (
    <div className="notas-page">
      <h2 className="notas-title">Minhas Notas</h2>
      {notas.length > 0 ? (
        notas.map(nota => (
          <div key={nota.id} className="nota">
            {editId === nota.id ? (
              <div>
                <textarea value={editTexto} onChange={(e) => setEditTexto(e.target.value)} cols="10" rows="5"/>
                <button onClick={handleSalvarEdicao}>Salvar</button>
              </div>
            ) : (
              /*primeiro exibe a nota normalmente, com o lápis do lado.
                quando eu clico no ícone do lápis, eu chamo a função handleEditarNota,
                passando o id da nota por parâmetro para eu atualizar o setEditId com esse id,
                assim como o novo conteúdo da nota para eu atualizar o setEditTexto com esse novo conteúdo.              
              */
              <div className='nota-content'>
                <p>{nota.conteudo}</p>
                <div className='icones-notas'>
                  <FaPencilAlt className='fa-pencil-alt' onClick={() => handleEditarNota(nota.id, nota.conteudo)}/>
                  <FaTrash className='fa-trash' onClick={() => confirmarDeletarNota(nota.id)} />
                </div>
              </div>
            )}
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
        {mostrarConfirmacaoModal && (
          <div className="modal">
            <h4>ATENÇÃO!</h4>
            <p>Tem certeza de que deseja excluir esta nota?</p>
            <button className='btn-cancelar' onClick={() => setMostrarConfirmacaoModal(false)}>Voltar</button>
            <button className='btn-excluir' onClick={() => handleDeletarNota(notaParaDeletar)}>Excluir</button>
          </div>
        )}
    </div>
  );
}

export default MinhasNotas;