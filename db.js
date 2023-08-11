// Open a database
// Create objectStore
// Make transactions

let db;

let openRequest = indexedDB.open("myDB");
openRequest.addEventListener("success", (e) => {
  console.log("DB Success");
  db = openRequest.result;
});
openRequest.addEventListener("error", (e) => {
  console.log("DB Error");
});
openRequest.addEventListener("upgradeneeded", (e) => {
  console.log("Upgraded");
  db = openRequest.result;

  db.createObjectStore("video", { keyPath: "id" });
  db.createObjectStore("image", { keyPath: "id" });
});
