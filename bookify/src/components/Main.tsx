import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "./Modal";

interface Book {
   id: number;
   name: string;
   author: string;
   reaction: string;
   rate: number;
   date_read: string;
}

function Main() {
   const [allBooks, setAllBooks] = useState<Book[]>([]);
   const [showBook, setShowBook] = useState<boolean>(false);
   const [bookToEdit, setBookToEdit] = useState<number>(0);
   const [currentUserId, setCurrentUserId] = useState<number>(0);

   async function handleDelete(id: number) {
      try {
         await axios.delete(`http://localhost:3500/delete/${id}`, { withCredentials: true });
         await gettingAllBooks();
      } catch (err) {
         console.error("Failed to delete", err);
      }
   }

   function handleEdit(id: number) {
      setShowBook(true);
      setBookToEdit(id);
   }

   async function gettingAllBooks() {
      try {
         let userId = currentUserId;

         if (!userId) {
            const responseMe = await axios.get("http://localhost:3000/me", {
               withCredentials: true,
            });
            const userData = responseMe.data;
            userId = userData.id;
            setCurrentUserId(userId);
         }

         if (!userId) return;

         const response = await axios.get("http://localhost:3500/getAll", {
            params: { id: userId },
            withCredentials: true,
         });
         const data = response.data;
         setAllBooks(Array.isArray(data) ? data : []);
      } catch (err) {
         console.error("Failed to fetch books", err);
         setAllBooks([]);
      }
   }

   useEffect(() => {
      gettingAllBooks();
   }, []);

   useEffect(() => {
      if (showBook) {
         document.body.style.overflow = "hidden";
      } else {
         document.body.style.overflow = "auto";
      }
   }, [showBook]);

   return (
      <>
         <h1 className="h1-main">Your books</h1>
         <div className="container-books">
            {allBooks.length !== 0 ? (
               <>
                  {allBooks.map((el) => (
                     <div key={el.id} className="book-data">
                        <h2>
                           «{el.name}» by {el.author}
                        </h2>
                        <h4>
                           Rate: {el.rate}/10. Date read:{" "}
                           {new Date(el.date_read).toLocaleDateString("uk-UA")}
                        </h4>
                        <h4>{el.reaction}</h4>
                        <div className="container-change">
                           <button onClick={() => handleEdit(el.id)}>Edit</button>
                           <button onClick={() => handleDelete(el.id)}>
                              Delete
                           </button>
                        </div>
                     </div>
                  ))}
               </>
            ) : (
               <p>You still don't have any books? Add one</p>
            )}
            <button
               onClick={() => {
                  setBookToEdit(0);
                  setShowBook(true);
               }}
            >
               Add a new book review
            </button>
         </div>
         {showBook === true ? (
            <Modal
               bookToEdit={bookToEdit}
               currentUserId={currentUserId}
               setShowBook={setShowBook}
               gettingAllBooks={gettingAllBooks}
            ></Modal>
         ) : null}
      </>
   );
}

export default Main;
