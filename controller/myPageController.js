// const Book = require('../models/bookModel');

// exports.getAllBooks = async (req, res) => {
//   try {
//       const books = await Book.find();
//       res.json(books);
//   } catch (error) {
//       res.status(500).json({ error: error.message });
//   }
// };

// exports.createBook = async (req, res) => {
//   try {
//       const newBook = new Book(req.body);
//       await newBook.save();
//       res.status(201).json(newBook);
//   } catch (error) {
//       res.status(500).json({ error: error.message });
//   }
// };

// exports.getBookById = async (req, res) => {
//   try {
//       const book = await Book.findById(req.params.id);
//       if (!book) {
//           return res.status(404).json({ message: 'Book not found' });
//       }
//       res.json(book);
//   } catch (error) {
//       res.status(500).json({ error: error.message });
//   }
// };

// exports.updateBook = async (req, res) => {
//   try {
//       const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
//       if (!updatedBook) {
//           return res.status(404).json({ message: 'Book not found' });
//       }
//       res.json(updatedBook);
//   } catch (error) {
//       res.status(500).json({ error: error.message });
//   }
// };

// exports.deleteBook = async (req, res) => {
//   try {
//       const deletedBook = await Book.findByIdAndDelete(req.params.id);
//       if (!deletedBook) {
//           return res.status(404).json({ message: 'Book not found' });
//       }
//       res.json({ message: 'Book deleted' });
//   } catch (error) {
//       res.status(500).json({ error: error.message });
//   }
// };

exports.getBingoStatus = async (req, res) => {
  try {
    // 기능 구현 영역
  } catch (error) {
    console.error(error);
  }
};
