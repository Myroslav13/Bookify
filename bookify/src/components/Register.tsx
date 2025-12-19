import { useState } from 'react'
import axios from 'axios';

interface RegisterProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<0 | 1 | 2>>;
}

function Register({setCurrentPage}: RegisterProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const response = await axios.post('http://localhost:3000/register', { "username":username, "password":password });
    const data = response.data;
    console.log(data);

    if (data !== false) {
      setCurrentPage(2);
    } else {
      setUsername("");
      setPassword("");
    }
  }

  return (
    <>
      <form method="post" action="/register" onSubmit={(e) => handleSubmit(e)}>
        <h1>Welcome</h1>
        <input type="text" placeholder="Username" name="username" onChange={(e) => setUsername(e.target.value)} value={username}/>
        <input type="password" placeholder="Password" name="password" onChange={(e) => setPassword(e.target.value)} value={password}/>
        <input type="submit" value={"Register"}/>
      </form>
    </>
  )
}

export default Register
