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
  const [bookName, setBookName] = useState<string>("");
  const [bookAuthor, setBookAuthor] = useState<string>("");
  const [bookReaction, setBookReaction] = useState<string>("");
  const [bookRate, setBookRate] = useState<number>(1);
  const [bookDate, setBookDate] = useState<string>("");
  const [showBook, setShowBook] = useState<boolean>(false);

  async function handleDelete(id:number) {
    try {
      await axios.delete(`http://localhost:3500/delete/${id}`);
      await gettingAllBooks();
    } catch (err) {
      console.error("Failed to delete", err);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setShowBook(false);

    if (bookName !== "" || bookAuthor !== "" || bookReaction !== "") {
      const response = await axios.post('http://localhost:3500/add', { "name":bookName, "author":bookAuthor, "user_id":currentUserId, "reaction":bookReaction, "rate":bookRate, "date_read":bookDate});
      const data = response.data;

      if (data && data.id) {
        alert("Book added successfully!");
        await gettingAllBooks();
        setShowBook(false);
        setBookName("");
        setBookAuthor("");
        setBookReaction("");
        setBookRate(1);
        setBookDate("");
      } else {
        alert("Could not add the book. Please try again.");
      }
    }
  }

  async function gettingAllBooks() {
    try {
      const response = await axios.get("http://localhost:3500/getAll", { params: { id: currentUserId } });
      const data = response.data;
      setAllBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch books", err);
      setAllBooks([]);
    }
  }

  useEffect(() => {gettingAllBooks()}, []);

  // useEffect(() => {
  //   if (showBook) {
  //     document.body.style.overflow = 'hidden';
  //   } else {
  //     document.body.style.overflow = 'auto';
  //   }
  //   return () => {
  //     document.body.style.overflow = 'auto';
  //   };
  // }, [showBook]);

  return (
    <>
      <h1 className='h1-main'>Your books</h1>
      {allBooks.length !== 0 ? 
        <div className='container-books'>
          {allBooks.map(el => (
            <div key={el.id} className='book-data'>
              <h2>«{el.name}» by {el.author}</h2>
              <h4>Rate: {el.rate}/10. Date read: {new Date(el.date_read).toLocaleDateString('uk-UA')}</h4>
              <h4>{el.reaction}</h4>
              <div className='container-change'>
                <button>Edit</button>
                <button onClick={() => handleDelete(el.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
        : 
        <p>You still don't have any books? Add one</p>
      }
      <button onClick={() => setShowBook(true)}>Add a new book review</button>
      {showBook === true ? 
        <form method="POST" action="/add" onSubmit={(e) => handleSubmit(e)} className='form-add'>
          <input type='text' name='name' placeholder='Book name' onChange={(e) => setBookName(e.target.value)} value={bookName}></input>
          <input type='text' name='author' placeholder='Book author' onChange={(e) => setBookAuthor(e.target.value)} value={bookAuthor}></input>
          <input type='text' name='reaction' placeholder='Reaction' onChange={(e) => setBookReaction(e.target.value)} value={bookReaction}></input>
          <select name='rate' onChange={(e) => setBookRate(Number(e.target.value))} value={bookRate}>
            <option value={0}>Select rate</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
            <option value={6}>6</option>
            <option value={7}>7</option>
            <option value={8}>8</option>
            <option value={9}>9</option>
            <option value={10}>10</option>
          </select>
          <input type='date' name='date_read' onChange={(e) => setBookDate(e.target.value)} value={bookDate}></input>
          <input type='submit'></input>
        </form>
        :
        null
      }
    </>
  )
}

export default Main