import { useState } from 'react'
import axios from 'axios'

interface LoginProps {
  currentPage: 0 | 1 | 2;
  setCurrentPage: React.Dispatch<React.SetStateAction<0 | 1 | 2>>;
}

function Login({ currentPage, setCurrentPage }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const response = await axios.get('http://localhost:3000/login', { params: { username } });
    const data = response.data;

    if (data === password) {
      setCurrentPage(1);
    }
  }

  return (
    <>
      <form method="post" action="/login" onSubmit={(e) => handleSubmit(e)}>
        <input type="text" name="username" onChange={(e) => setUsername(e.target.value)}/>
        <input type="password" name="password" onChange={(e) => setPassword(e.target.value)}/>
        <input type="submit"/>
      </form>
    </>
  )
}

export default Login
