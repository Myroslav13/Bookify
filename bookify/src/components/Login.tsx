import { useState } from 'react'
import axios from 'axios'

interface LoginProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<0 | 1 | 2>>;
}

function Login({ setCurrentPage }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (username !== "" && password !== "") {
      const response = await axios.get('http://localhost:3000/login', { params: { username, password } });
      const data = response.data;
      console.log(data);

      if (data == true) {
        setCurrentPage(2);
        alert("You have entered successfully!");
      } else {
        setUsername("");
        setPassword("");
        alert("Your login or password is incorrect!");
      }
    } else {
      alert("Please enter your username and password!");
    }
  }

  return (
    <>
      <form method="post" action="/login" onSubmit={(e) => handleSubmit(e)}>
        <h1>Login</h1>
        <input type="text" placeholder="Username" name="username" onChange={(e) => setUsername(e.target.value)} value={username}/>
        <input type="password" placeholder="Password" name="password" onChange={(e) => setPassword(e.target.value)} value={password}/>
        <input type="submit" value={"Sign In"}/>
        <p onClick={() => setCurrentPage(1)}>You haven't registered yet?</p>
      </form>
    </>
  )
}

export default Login
