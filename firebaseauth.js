//importação de funções do firebase para autenticação e firestore e controle de estado
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import {getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import {getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

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

//Função para exibir mensagens temporárias na interface
function showMessage(message, divId) {
    var messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function() {
        messageDiv.style.opacity = 0;
    }, 5000); //A mensagem desaparece após 5 segundos
}

//Lógica de cadastro de novos usuários
const signUp = document.getElementById("submitSignUp");
signUp.addEventListener('click', (event) => {
    event.preventDefault(); //Previne o comportamento padrão do botão

    //captura dos dados do formulário de cadastro
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const firstName = document.getElementById('fName').value;
    const lastName = document.getElementById('lName').value;

    const auth = getAuth(); //Configura o serviço de autenticação
    const db = getFirestore(); //Conecta ao Firestore (Banco de dados)

    //Cria uma conta com email e senha
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user; //Usuário autenticado
        const userData = {email, firstName, lastName}; //Dados do usuário para salvar

        showMessage('Conta criada com sucesso!', 'signUpMessage'); //exibe mensagem de sucesso

        //Salva os dados do usuário no Firestore
        const docRef = doc(db, "users", user.uid);
        setDoc(docRef, userData)
        .then(() => {
            window.location.href = 'index.html'; //Redireciona para a página de login após cadastro
        })
        .catch((error) => {
            console.error("Erro ao cadastrar no Documento", error);
        });
    })
    .catch((error) => {
        const errorCode = error.code;
        if (errorCode == 'auth/email-already-in-use') {
            showMessage('Email já cadastrado!', 'signUpMessage');
        } else {
            showMessage('impossível criar usuário', 'signUpMessage');
        }
    });
});

//Lógica de login de usuários existentess
const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event) => {
    event.preventDefault(); //previne o comportamento padrão do botão

    //Captura os dados do formulário de login
    const email =  document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const auth = getAuth(); //configura o serviço de autenticação

    //Realiza o login com email e senha
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        showMessage('Logado com sucesso', 'signInMessage'); //exibe mensagem de sucesso
        const user = userCredential.user;

        //Salva o ID do usuário no localStorage
        localStorage.setItem('loggedInUserId', user.uid);

        window.location.href = 'homepage.html'; //Redireciona para a página inicial
    })
    .catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'auth/invalid-credential') {
            showMessage('Email ou Senha incorretas', 'signInMessage');
        } else {
            showMessage('Conta não existe', 'signInMessage');
        }
    });
});