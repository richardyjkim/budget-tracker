// create variable to hold db connection
let db;
// establish a connection to IndexedDB database called 'budge_tracker' and set it to version 1
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
    uploadTransaction
  }
};

request.onerror = function (event) {
  console.log(event.target.errorCode)
};

// this function will executed if we attempt to submit a new transaction and when it is offline
function saveRecord(record) {
  // open a new transaction with the databse with read and write permissions
  const transaction = db.transaction(['new_transaction'], 'readwrite');
  // access the object store for 'new_transaction'
  const budgetObjectStore = transaction.objectStore('new_transaction');
  // add record to your store with add method
  budgetObjectStore.add(record);
};

function uploadTransaction() {
  // open a transaction on db
  const transaction = db.transaction(['new_transaction'], 'readwrite');
  // access object store
  const budgetObjectStore = transaction.objectStore('new_transaction');
  // get all records from store and set to a variable
  const getAll = budgetObjectStore.getAll()
  // upon successful .getAll() execution, run this function
  getAll.onsuccess = function () {
    // if there was data indexedDb's store, send it to api server
    if (getAll.result.length > 0) {
      fetch('/api/transaction', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(serverResponse => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }
          // open one more transaction
          const transaction = db.transaction(['new_transaction'], 'readwrite');
          // access object store
          const budgetObjectStore = transaction.objectStore('new_transaction');
          // clear all items in store
          budgetObjectStore.clear();

          alert('All saved transactions has been submitted!');
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
// listen for app coming back online
window.addEventListener('online', uploadTransaction);