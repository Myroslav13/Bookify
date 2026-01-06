import {
   BrowserRouter as Router,
   Routes,
   Route,
   Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Main from "./components/Main";

function App() {
   return (
      <Router>
         <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
               path="/main"
               element={<ProtectedRoute element={<Main />} />}
            />
         </Routes>
      </Router>
   );
}

export default App;