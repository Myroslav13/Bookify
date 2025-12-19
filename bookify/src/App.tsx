import { useState } from 'react'
import Login from './components/Login'
import Register from './components/Register';
import Main from './components/Main';

function App() {
  type Page = 0 | 1 | 2;
  const [currentPage, setCurrentPage] = useState<Page>(0);
  const [currentUserId, setCurrentUserId] = useState(0);

  return (
    <>
      {currentPage === 0 ? <Login setCurrentPage = {setCurrentPage} setCurrentUserId={setCurrentUserId}></Login> : null}
      {currentPage === 1 ? <Register setCurrentPage = {setCurrentPage} setCurrentUserId={setCurrentUserId}></Register> : null}
      {currentPage === 2 ? <Main currentUserId = {currentUserId}></Main> : null}
    </>
  )
}

export default App
