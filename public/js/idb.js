// create variable to hold db connection
let db;
// establish a connection to IndexedDB database called 'pizza_hunt' and set it to version 1
const request = indexedDB.open('budget_tracker', 1);

// this event will emit if the database version changes (nonexistant to version 1, v1 to v2, etc)
request.onupgradeneeded = function (event) {
  // save reference to the database
  const db = event.target.result;
  db.createObjectStore('new_transaction', { autoIncrement: true });
};

// upon success
request.onsuccess = function (event) {
  // when db is successfully created with its object store
  db = event.target.result

  // check if app is online
  if (navigator.onLine) {

  }
};

request.onerror = function (event) {
  console.log(event.target.errorCode)
};