import { useEffect, useState } from 'react'
import axios from 'axios';

interface MainProps {
  currentUserId: number;
}

interface Book {
    id: number;
    name: string;
    author: string;
    reaction: string;
    rate: number;
    date_read: string;
}

function Main({currentUserId}: MainProps) {
  const [allBooks, setAllBooks] = useState<Book[]>([]);

  async function gettingAllBooks() {
    const response = await axios.get("http://localhost:3500/getAll", { params: { id: currentUserId } });
    const data = response.data;
    setAllBooks(data);
    console.log(currentUserId, data);
  }

  useEffect(() => { gettingAllBooks() }, []);

  return (
    <>
      <h1>Your books</h1>
      <div className='container-books'>
        {allBooks.map(el => (
          <div key={el.id} className='book-data'>
            <h2>«{el.name}» by {el.author}</h2>
            <h4>Rate: {el.rate}/10. Date rate: {el.date_read}</h4>
            <h4>{el.reaction}</h4>
          </div>
        ))}
      </div>
    </>
  )
}

export default Main