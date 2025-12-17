import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Login from './components/Login'
import Register from './components/Register';
import Main from './components/Main';

function App() {
  type Page = 0 | 1 | 2;
  const [currentPage, setCurrentPage] = useState<Page>(0)

  return (
    <>
      {currentPage === 0 ? <Login currentPage = {currentPage} setCurrentPage = {setCurrentPage}></Login> : null}
      {currentPage === 1 ? <Register></Register> : null}
      {currentPage === 2 ? <Main></Main> : null}
    </>
  )
}

export default App
