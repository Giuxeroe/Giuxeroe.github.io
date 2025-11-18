// Firebase Configuration
// IMPORTANTE: Sostituisci questi valori con quelli del tuo progetto Firebase
// Trova questi valori nella console Firebase: Project Settings > Your apps > Config

const firebaseConfig = {
  apiKey: "AIzaSyDoTocL7TQhrjFRuDMyNcTaw7vtb9NKDB4",
  authDomain: "compleanno-chiara.firebaseapp.com",
  databaseURL: "https://compleanno-chiara-default-rtdb.firebaseio.com",
  projectId: "compleanno-chiara",
  storageBucket: "compleanno-chiara.firebasestorage.app",
  messagingSenderId: "956559134096",
  appId: "1:956559134096:web:8f68f9c588512c6827b715"
};

// Inizializza Firebase
firebase.initializeApp(firebaseConfig);

// Riferimenti ai servizi Firebase
const database = firebase.database();
const storage = firebase.storage();

