import { useState } from "react";
import axios from "axios";

function Login() {
    
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);
    const [mostrarNotas, setMotrarNotas] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3000/login',
            JSON.stringify({email, senha}),
                {
                    headers: {'Content-Type': 'application/json'}
                }
        );
            setUser(response.data.usuario);
            localStorage.setItem('token', response.data.token);

        } catch (error) {
            if (!error?.response) {
                setError('Erro ao acessar o servidor.');
            } else if (error.response.status === 401) {
                setError('Usuário ou senha inválidos.');
            }
        }
    };

    const handleLogout = async (e) => {
        e.preventDefault();
        setUser(null);
        setError('');
    };

    const handleNotas = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.get('http://localhost:3000/:id/minhas-notas')
            setMotrarNotas(response.data)
            console.log(response.data)
        } catch (error) {
            if (!error?.response) {
                setError('Erro ao acessar o servidor.');
            } else if (error.response.status === 401) {
                setError('Usuário ou senha inválidos.');
            }
        }
    }

    return(
        <div className='login-form-wrap'>
        {user == null ? (
            <div>
            <h2>Login</h2>
            <form className="login-form">
                <input type="email"
                    name='email'
                    placeholder='Seu e-mail'
                    required
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input type="password"
                    name='password'
                    placeholder='Sua senha'
                    required
                    onChange={(e) => setSenha(e.target.value)}/>
                <button type='submit'
                    className='btn-login'
                    onClick={(e) => handleLogin(e)}
                    >Login</button>
            </form>
            <p>{error}</p>
        </div> 
        ) : (
            <div>
                <h2>Olá, {user.nome}</h2>
                <button 
                        type="button"
                        className="btn-login"
                        onClick={(e) => handleLogout(e)}>Logout
                </button>
                <button 
                    type="button"
                    className="btn-login"
                    onClick={handleNotas}>Minhas Notas
                </button>
            </div>
        )}
         </div>
        
    );
  }

  export default Login;