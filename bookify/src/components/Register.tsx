import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const navigate = useNavigate();

   async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();

      if (email !== "" && password !== "") {
         if (password.length < 6) {
            alert("Your password contains less than 6 symbols. Make it bigger");
            return;
         }

         try {
            const response = await axios.post("http://localhost:3000/register", {
               email,
               password,
            });
            
            if (response.data.user) {
               alert("You have registered successfully!");
               navigate("/main");
            }
         } catch (error: any) {
            console.error("Registration error:", error);
            
            if (error.response?.data?.error) {
               alert(error.response.data.error);
            } else {
               alert("Registration failed. Please try again.");
            }
            
            setEmail("");
            setPassword("");
         }
      } else {
         alert("Please enter your username and password!");
      }
   }

   return (
      <div className="auth-page">
         <form onSubmit={(e) => handleSubmit(e)}>
            <h1>Welcome</h1>
            <input
               type="email"
               placeholder="Email"
               name="email"
               onChange={(e) => setEmail(e.target.value)}
               value={email}
            />
            <input
               type="password"
               placeholder="Password"
               name="password"
               onChange={(e) => setPassword(e.target.value)}
               value={password}
            />
            <input type="submit" value={"Register"} />
         </form>
         <a className="btn btn-block" href="http://localhost:3000/auth/google">
            <i className="fab fa-google"></i>
            Sign Up with Google
         </a>
      </div>
   );
}

export default Register;