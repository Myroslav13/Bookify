import { useState } from 'react'
import Login from './components/Login'
import Register from './components/Register';
import Main from './components/Main';

function App() {
  type Page = 0 | 1 | 2;
  const [currentPage, setCurrentPage] = useState<Page>(0)

  return (
    <>
      {currentPage === 0 ? <Login setCurrentPage = {setCurrentPage}></Login> : null}
      {currentPage === 1 ? <Register setCurrentPage = {setCurrentPage}></Register> : null}
      {currentPage === 2 ? <Main></Main> : null}
    </>
  )
}

export default App
