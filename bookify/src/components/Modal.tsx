import { useEffect, useState } from 'react'
import axios from 'axios';

interface ModalProps {
  bookToEdit: number;
  currentUserId: number;
  setShowBook: React.Dispatch<React.SetStateAction<boolean>>;
  gettingAllBooks: () => Promise<void>;
}

function Modal({bookToEdit, currentUserId, setShowBook, gettingAllBooks}: ModalProps) {
  const [bookName, setBookName] = useState<string>("");
  const [bookAuthor, setBookAuthor] = useState<string>("");
  const [bookReaction, setBookReaction] = useState<string>("");
  const [bookRate, setBookRate] = useState<number>(1);
  const [bookDate, setBookDate] = useState<string>("");

  function toInputDate(value: string) {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    const corrected = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return corrected.toISOString().split('T')[0];
  }

  async function insertBookData(id:number) {
    const response = await axios.get(`http://localhost:3500/get/${id}`);
    const data = response.data;
    setBookName(data.name);
    setBookAuthor(data.author);
    setBookReaction(data.reaction);
    setBookRate(data.rate);
    setBookDate(toInputDate(data.date_read));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setShowBook(false);

    if (bookName !== "" || bookAuthor !== "" || bookReaction !== "") {
        var response, text;
        if (!bookToEdit) {
            response = await axios.post('http://localhost:3500/add', {"name":bookName, "author":bookAuthor, "user_id":currentUserId, "reaction":bookReaction, "rate":bookRate, "date_read":bookDate});
            text = "Book added successfully!";
        } else {
            response = await axios.put(`http://localhost:3500/edit/${bookToEdit}`, {"name":bookName, "author":bookAuthor, "user_id":currentUserId, "reaction":bookReaction, "rate":bookRate, "date_read":bookDate});
            text = "Book edited successfully!";
        }

        const data = response.data;

        if (data) {
            alert(text);
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

  useEffect(() => {
    if (bookToEdit) {
      insertBookData(bookToEdit);
    }
  }, [bookToEdit]);

  return (
    <div className="modalOverlay">
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
    </div>
  )
}

export default Modal