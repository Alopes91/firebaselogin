// Importa as funções necessárias do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, setDoc, doc, getDocs, collection, query, where } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Configurações do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBGxQKJcl15FvSCEUvjUQajL6j-NaUQUQg",
    authDomain: "loginpwii.firebaseapp.com",
    projectId: "loginpwii",
    storageBucket: "loginpwii.firebasestorage.app",
    messagingSenderId: "281365893072",
    appId: "1:281365893072:web:86ffd0012c334bbebbf3d5"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(); // Configura o serviço de autenticação
const db = getFirestore(); // Conecta ao Firestore

// Função para autenticar com o Google
function signInWithGoogle() {
    const provider = new GoogleAuthProvider();

signInWithPopup(auth, provider)
    .then(async (result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        const displayName = user.displayName; // Nome completo do usuário
        const email = user.email; // E-mail do usuário
        const [firstName, ...lastName] = displayName.split(" ");
        const lastNameJoined = lastName.join(" ");

        // Cria ou atualiza o documento do usuário no Firestore
        const docRef = doc(db, "users", user.uid);
        const userData = {
            firstName,
            lastName: lastNameJoined,
            email,
        };

        await setDoc(docRef, userData, { merge: true });

        // Salva o UID do usuário no localStorage
        localStorage.setItem("loggedInUserId", user.uid);

        // Redireciona para a página inicial
        window.location.href = "homepage.html";

    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.error('Erro na autenticação com Google:', error);
    });
}

// Associa evento de clique ao botão Google
// Seleciona todos os botões com a classe 'google-login-btn'
const googleLoginButtons = document.querySelectorAll('.google-login-btn');

// Adiciona o evento de clique para cada botão
googleLoginButtons.forEach(button => {
    button.addEventListener('click', signInWithGoogle);
});

// Função para exibir mensagens temporárias na interface
function showMessage(message, divId) {
    var messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function() {
        messageDiv.style.opacity = 0;
    }, 5000); // A mensagem desaparece após 5 segundos
}

// Lógica de cadastro de novos usuários
const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', (event) => {
    event.preventDefault(); // Previne o comportamento padrão do botão

    // Captura os dados do formulário de cadastro
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const firstName = document.getElementById('fName').value;
    const lastName = document.getElementById('lName').value;

    // Cria uma conta com e-mail e senha
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user; // Usuário autenticado
        const userData = { email, firstName, lastName }; // Dados do usuário para salvar

        showMessage('Conta criada com sucesso', 'signUpMessage'); // Exibe mensagem de sucesso

        // Salva os dados do usuário no Firestore
        const docRef = doc(db, "users", user.uid);
        setDoc(docRef, userData)
        .then(() => {
            window.location.href = 'index.html'; // Redireciona para a página de login após cadastro
        })
        .catch((error) => {
            console.error("Error writing document", error);
        });
    })
    .catch((error) => {
        const errorCode = error.code;
        if (errorCode == 'auth/email-already-in-use') {
            showMessage('Endereço de e-mail já existe', 'signUpMessage');
        } else {
            showMessage('Não é possível criar usuário', 'signUpMessage');
        }
    });
});

// Lógica de login de usuários existentes
const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event) => {
    event.preventDefault(); // Previne o comportamento padrão do botão

    // Captura os dados do formulário de login
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Realiza o login com e-mail e senha
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        showMessage('Usuário logado com sucesso', 'signInMessage'); // Exibe mensagem de sucesso
        const user = userCredential.user;

        // Salva o ID do usuário no localStorage
        localStorage.setItem('loggedInUserId', user.uid);

        window.location.href = 'homepage.html'; // Redireciona para a página inicial
    })
    .catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'auth/invalid-credential') {
            showMessage('E-mail ou senha incorreta', 'signInMessage');
        } else {
            showMessage('Essa conta não existe', 'signInMessage');
        }
    });
});

// Função para recuperação de senha
async function recoverPassword() {
    // Captura o e-mail do usuário
    const email = prompt("Por favor, insira seu e-mail para recuperação de senha:");

    if (!email) {
        alert("E-mail não pode estar vazio!");
        return;
    }

    try {
        // Verifica a existência do e-mail no Firestore
        const usersRef = collection(db, "users"); // Coleção de usuários
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            alert("Usuário não encontrado. Verifique o e-mail informado.");
            return;
        }

        // Envia o e-mail de recuperação se o e-mail existir
        await sendPasswordResetEmail(auth, email);
        alert("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;

        if (errorCode === "auth/invalid-email") {
            alert("O e-mail inserido é inválido. Tente novamente.");
        } else {
            alert("Ocorreu um erro: " + errorMessage);
        }
    }
}

// Adiciona evento ao link "Esqueceu a senha?"
const recoverLink = document.querySelector(".recover a");
recoverLink.addEventListener("click", (event) => {
    event.preventDefault();
    recoverPassword();
});