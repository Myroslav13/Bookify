import { useState, useEffect, type JSX } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

interface ProtectedRouteProps {
   element: JSX.Element;
}

function ProtectedRoute({ element }: ProtectedRouteProps) {
   const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

   useEffect(() => {
      let cancelled = false;

      (async () => {
         try {
            const res = await axios.get("http://localhost:3000/me", {
               withCredentials: true,
            });
            if (!cancelled) setIsAuthenticated(res.status === 200);
         } catch {
            if (!cancelled) setIsAuthenticated(false);
         }
      })();

      return () => {
         cancelled = true;
      };
   }, []);

   if (isAuthenticated === null) return <div>Loading...</div>;
   if (!isAuthenticated) return <Navigate to="/login" replace />;
   return element;
}

export default ProtectedRoute;