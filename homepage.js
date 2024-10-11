//importação de funções do firebase para autenticação e firestore e controle de estado
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import {getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import {getFirestore, getDoc, doc} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

  // Configuração do Firebase com as credenciais do projeto! ATENÇÃO NÃO DEIXAR AS CREDENCIAIS EXPOSTAS!
  const firebaseConfig = {
    apiKey: "AIzaSyBGxQKJcl15FvSCEUvjUQajL6j-NaUQUQg",
    authDomain: "loginpwii.firebaseapp.com",
    projectId: "loginpwii",
    storageBucket: "loginpwii.appspot.com",
    messagingSenderId: "281365893072",
    appId: "1:281365893072:web:86ffd0012c334bbebbf3d5"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(); //Configura o Firebase Authentication
  const db = getFirestore(); //Configura o Firestore (Banco de Dados)

  //Monitora o estado de autenticação do usuário
  onAuthStateChanged(auth, (user) => {
    //Busca o ID do usuário autenticado salvo no localStorage
    const loggedInUserId = localStorage.getItem('loggedInUserId');

    //Se o ID estiver no localStorage, tenta obter os dados do Firestore
    if (loggedInUserId) {
      console.log(user);
      const docRef = doc(db, "users", loggedInUserId); //Referência ao documento do usuário no Firestore
    
    getDoc(docRef) //Busca o documento
    .then((docSnap) => {
      //Se o documento existir, exibe os dados na interface
      if(docSnap.exists()) {
        const userData = docSnap.data();
        document.getElementById('loggedUserFName').innerText = userData.firstName;
        document.getElementById('loggedUserEmail').innerText = userData.email;
        document.getElementById('loggedUserLName').innerText = userData.lastName;
      } else {
        console.log("Id não encontrado no Documento!");
      }
    })
    .catch((error) => {
      console.log("Erro ao conectar com o Documento");
    });
  } else {
    console.log("Usuário não encontrado no LocalStorage");
  }
});

//Lógica do logout
const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', () => {
  localStorage.removeItem('loggedInUserId'); //Remove o ID do localStorage
  signOut(auth) //Realiza o logout
  .then(() => {
    window.location.href = 'index.html'; //Redireciona para a página de login
  })
  .catch((error) => {
    console.error('Erro ao sair:', error);
  });
});