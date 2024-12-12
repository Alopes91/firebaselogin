# Projeto de Login utilizando Firebase

Este projeto implementa funcionalidades de autenticação utilizando o Firebase, incluindo cadastro, login, login com conta Google, recuperação de senha e tratamento de erros. Abaixo estão detalhadas as principais implementações e como elas foram configuradas.

## Configuração do Firebase

A configuração do Firebase foi realizada por meio do SDK JavaScript, utilizando as informações fornecidas no console do Firebase. Os serviços inicializados incluem:

- **Firebase Authentication:** Para autenticação de usuários com e-mail/senha e provedor Google.
- **Firestore:** Para armazenamento de dados relacionados aos usuários, como nome e sobrenome.

Trecho de código de configuração:

```javascript
const firebaseConfig = {
    apiKey: "<SUA_API_KEY>",
    authDomain: "<SEU_AUTH_DOMAIN>",
    projectId: "<SEU_PROJECT_ID>",
    storageBucket: "<SEU_STORAGE_BUCKET>",
    messagingSenderId: "<SEU_MESSAGING_SENDER_ID>",
    appId: "<SEU_APP_ID>",
    measurementId: "<SEU_MEASUREMENT_ID>"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
```

## Funcionalidades Implementadas

### Cadastro de Novos Usuários

Os usuários podem criar contas utilizando e-mail e senha. Após o cadastro, os dados do usuário são armazenados no Firestore para futuras referências. Caso o e-mail já esteja em uso, uma mensagem apropriada é exibida.

Trecho de código:

```javascript
createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        const userData = { email, firstName, lastName };

        // Salva os dados no Firestore
        setDoc(doc(db, "users", user.uid), userData);
    })
    .catch((error) => {
        // Tratamento de erros
        if (error.code === 'auth/email-already-in-use') {
            showMessage('Endereço de e-mail já existe', 'signUpMessage');
        } else {
            showMessage('Não foi possível criar usuário', 'signUpMessage');
        }
    });
```

### Login de Usuários Existentes

Permite que usuários cadastrados autentiquem-se utilizando e-mail e senha. Após o login, o UID do usuário é armazenado no `localStorage` para gerenciar a sessão.

Trecho de código:

```javascript
signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        showMessage('Usuário logado com sucesso', 'signInMessage');
        const user = userCredential.user;

        // Salva o UID no localStorage
        localStorage.setItem('loggedInUserId', user.uid);

        window.location.href = 'homepage.html';
    })
    .catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'auth/invalid-credential') {
            showMessage('E-mail ou senha incorretos', 'signInMessage');
        } else {
            showMessage('Essa conta não existe', 'signInMessage');
        }
    });
```

### Login com Conta Google

A autenticação com conta Google foi implementada usando o provedor `GoogleAuthProvider`. Caso o usuário seja autenticado com sucesso, seus dados são armazenados no Firestore e a sessão é gerenciada. Caso contrário, erros são tratados de maneira apropriada.

Trecho de código:

```javascript
const provider = new GoogleAuthProvider();

signInWithPopup(auth, provider)
    .then((result) => {
        const user = result.user;
        const userData = {
            firstName: user.displayName.split(' ')[0],
            lastName: user.displayName.split(' ').slice(1).join(' '),
            email: user.email
        };

        setDoc(doc(db, "users", user.uid), userData, { merge: true });
    })
    .catch((error) => {
        console.error('Erro na autenticação com Google:', error);
    });
```

### Recuperação de Senha

Usuários podem solicitar a redefinição de senha informando o e-mail cadastrado. O sistema verifica se o e-mail existe no Firestore antes de enviar o e-mail de recuperação. Caso ocorra um erro, mensagens claras são exibidas ao usuário.

Trecho de código:

```javascript
sendPasswordResetEmail(auth, email)
    .then(() => {
        alert("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
    })
    .catch((error) => {
        if (error.code === "auth/invalid-email") {
            alert("O e-mail inserido é inválido.");
        } else {
            alert("Ocorreu um erro: " + error.message);
        }
    });
```

### Validação e Tratamento de Erros

Os erros mais comuns, como e-mails duplicados ou credenciais inválidas, são tratados com mensagens amigáveis exibidas na interface. Isso melhora a experiência do usuário e ajuda a identificar problemas rapidamente.

Exemplo de tratamento de erros:

```javascript
.catch((error) => {
    const errorCode = error.code;
    if (errorCode === 'auth/invalid-credential') {
        showMessage('E-mail ou senha incorretos', 'signInMessage');
    } else {
        showMessage('Essa conta não existe', 'signInMessage');
    }
});
```

## Funcionamento do Projeto

Abaixo estão alguns screenshots que ilustram o funcionamento das telas de criação de conta, de login, de login com Google, de conta logada e de recuperação de senha.

### Criação de conta - Início

![Criação de conta - Início](./images/criar%20sua%20conta%20-%20início.PNG)

### Criação de conta - Preenchimento

![Criação de conta - Preenchimento](./images/criando%20conta.PNG)

### Criação de conta - Campo sem formato de e-mail

![Criação de conta - Campo sem formato de e-mail](./images/criando%20conta%20sem%20formato%20de%20e-mail.PNG)

### Login - Início

![Login - Início](./images/login%20-%20início.PNG)

### Login - Preenchimento

![Login - Preenchimento](./images/fazendo%20login.PNG)

### Login - Senha incorreta

![Login - Senha incorreta](./images/e-mail%20ou%20senha%20incorreta.PNG)

### Conta logada por e-mail e senha

![Conta logada por e-mail e senha](./images/conta%20logada.PNG)



## Conclusão

Este projeto demonstra como integrar o Firebase em aplicações web para realizar autenticação segura e gestão de usuários, utilizando recursos modernos e boas práticas de desenvolvimento. Além disso, aborda validação de entrada e recuperação de senha para oferecer uma experiência completa ao usuário.

