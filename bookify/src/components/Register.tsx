import { useState } from 'react'
import axios from 'axios';

interface RegisterProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<0 | 1 | 2>>;
  setCurrentUserId: React.Dispatch<React.SetStateAction<number>>;
}

function Register({setCurrentPage, setCurrentUserId}: RegisterProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
      
    if (email !== "" && password !== "") {
      if (password.length < 6) {
        alert("You password contains less than 6 symbols. Make it bigger");
        return;
      }

      const response = await axios.post('http://localhost:3000/register', { "email":email, "password":password });
      const data = response.data;

      if (data !== false) {
        setCurrentUserId(data);
        setCurrentPage(2);
        alert("You have registered successfully!");
      } else {
        setEmail("");
        setPassword("");
        alert("This username is already used");
      }
    } else {
      alert("Please enter your username and password!");
    }
  }

  return (
    <div className='auth-page'>
      <form method="POST" action="/register" onSubmit={(e) => handleSubmit(e)}>
        <h1>Welcome</h1>
        <input type="email" placeholder="Email" name="email" onChange={(e) => setEmail(e.target.value)} value={email}/>
        <input type="password" placeholder="Password" name="password" onChange={(e) => setPassword(e.target.value)} value={password}/>
        <input type="submit" value={"Register"}/>
      </form>
    </div>
  )
}

export default Register
