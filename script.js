//obtem os elementos de botão e formulários de login/cadastro
const signUpButton = document.getElementById('signUpButton');
const signInButton = document.getElementById('signInButton');
const signInform = document.getElementById('signIn');
const signUpform = document.getElementById('signUp');

//quando o botão de cadastro é clicado, esconde o formulário de login e mostra o de cadastro
signUpButton.addEventListener('click', function() {
    signInform.style.display = "none";
    signUpform.style.display = "block";
});

//quando o botão de login é clicado, esconde o formulário de cadastro e mostra o de login
signInButton.addEventListener('click', function() {
    signInform.style.display = "block";
    signUpform.style.display = "none";
});