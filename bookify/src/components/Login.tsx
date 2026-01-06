import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const navigate = useNavigate();

   async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();

      if (email !== "" && password !== "") {
         try {
            const response = await axios.post(
               "http://localhost:3000/login",
               { email, password },
               { withCredentials: true }
            );

            if (response.status === 200) {
               navigate("/main");
               alert("You have entered successfully!");
            } else if (response.status === 401) {
               setEmail("");
               setPassword("");
               alert("Your login or password is incorrect!");
            }
         } catch (error) {
            alert("Server error. Please try again later.");
         }
      } else {
         alert("Please enter your username and password!");
      }
   }

   return (
      <div className="auth-page">
         <form onSubmit={(e) => handleSubmit(e)}>
            <h1>Login</h1>
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
            <input type="submit" value={"Sign In"} />
            <p onClick={() => navigate("/register")}>
               You haven't registered yet?
            </p>
         </form>
          <a className="btn btn-block" href="http://localhost:3000/auth/google">
            <i className="fab fa-google"></i>
            Login with Google
         </a>
      </div>
   );
}

export default Login;
