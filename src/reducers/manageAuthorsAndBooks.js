// Through combineReducer, we're telling Redux to produce a reducer which will return a state that has both a key of books with a value equal to the return value of the booksReducer() and a key of authors with a value equal to the return value of the authorsReducer(). Now if you look at the booksReducer() and the authorsReducer() you will see that each returns a default state of an empty array.

import { combineReducers } from "redux";
import uuid from "uuid";

const rootReducer = combineReducers({
  authors: authorsReducer,
  books: booksReducer
});

export default rootReducer;

function booksReducer(state = [], action) {
  let idx;
  switch (action.type) {
    case "ADD_BOOK":
      return [...state, action.book];

    case "REMOVE_BOOK":
      idx = state.findIndex(book => book.id  === action.id)
      return [...state.slice(0, idx), ...state.slice(idx + 1)];

    default:
      return state;
  }
}
// if you want to have more than one reducer respond to the same action, you can.
// in our application, when a user inputs information about a book, the user also inputs the author's name. It would be handy if, when a user submits a book with an author, that author is also added to our author array. In authorsReducer, we can include a switch case for "ADD_BOOK":

function authorsReducer(state = [], action) {
// we no longer retrieve the list of authors with a call to state.authors, but can access the list of authors simply by calling state.
  let idx;
  switch (action.type) {
    case "ADD_AUTHOR":
      return [...state, action.author];

    case "REMOVE_AUTHOR":
      idx = state.findIndex(author => author.id  === action.id)
      return [...state.slice(0, idx), ...state.slice(idx + 1)];

    case "ADD_BOOK":
      let existingAuthor = state.filter(
        author => author.authorName === action.book.authorName
      );
      if (existingAuthor.length > 0) {
        return state;
      } else {
        return [...state, { authorName: action.book.authorName, id: uuid() }];
      } // We're using a useful package, uuid, to handle unique ID generation. 
    default:
      return state;
  }
} 
// In the new "ADDBOOK" case, we're checking to see if an authorName matches with the name dispatches from the BookInput component. If the name already exists, state is returned unchanged. If the name is not present, it is added to the author array.
