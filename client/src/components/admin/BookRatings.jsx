import React, { useEffect, useState } from "react";
import axios from "axios";

const BookRatings = () => {
  const [bookdata, setBookdata] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [averageRatings, setAverageRatings] = useState({});

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3001/get-dbcollections",
          "books"
        );
        setBookdata(response.data.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    // Calculate average ratings for each book
    const avgRatings = {};
    bookdata.forEach((book) => {
      const totalRatings = book.ratings.reduce(
        (acc, curr) => acc + curr.rating,
        0
      );
      const avgRating = totalRatings / book.ratings.length;
      avgRatings[book._id] = avgRating.toFixed(1); // Round to 1 decimal place
    });
    setAverageRatings(avgRatings);

    // Filter books based on search term
    const filtered = bookdata.filter((book) =>
      book.bkName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBooks(filtered);
  }, [bookdata, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="main-book relative overflow-hidden flex flex-col">
      <h1 className="tbhead text-3xl -mb-10">Ratings of Books</h1>
      <div className="search">
        <input
          type="text"
          placeholder="Search by book name"
          value={searchTerm}
          onChange={handleSearchChange}
          className="h-12 bg-neutral-800  text-white px-4  border-2 border-white w-[99%] rounded-md placeholder-gray-200 "
        />
      </div>
      <div className="scrollDi">
        <table className="border-collapse w-full mt-4">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Book Name</th>
              <th className="border border-gray-300 px-4 py-2">
                Average Rating
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map((book) => (
              <tr key={book._id} className="border border-gray-300">
                <td className="border border-gray-300 px-4 py-2">
                  {book.bkName}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {averageRatings[book._id]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookRatings;
