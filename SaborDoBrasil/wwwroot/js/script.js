// Utilidades
function show(el) { el.classList.remove('d-none'); }
function hide(el) { el.classList.add('d-none'); }

// Login
const btnEntrar = document.getElementById('btn-entrar');
const btnSair = document.getElementById('btn-sair');
const modalLogin = document.getElementById('modal-login');
const modalExcluir = document.getElementById('modal-excluir');
const usuarioLogado = document.getElementById('usuario-logado');
const inputEmail = document.querySelector('.input-email');
const inputSenha = document.querySelector('.input-senha');
const btnEntrarModal = document.querySelector('.btn-entrar-modal');
const btnCancelar = document.querySelector('.btn-cancelar');
const loginErro = document.querySelector('.login-erro');

let usuario = null;

btnEntrar.onclick = () => {
    show(modalLogin);
    inputEmail.value = '';
    inputSenha.value = '';
    hide(loginErro);
};
btnCancelar.onclick = () => hide(modalLogin);

btnEntrarModal.onclick = async () => {
    const res = await fetch('/api/usuario/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inputEmail.value, senha: inputSenha.value })
    });
    if (res.ok) {
        usuario = await res.json();
        hide(modalLogin);
        show(usuarioLogado);
        hide(btnEntrar);
        show(btnSair);
        document.querySelectorAll('.comentario-usuario').forEach(i => i.value = usuario.nome);
        // Atualize likes/dislikes do usuário logado se necessário
        document.getElementById('likes-user').textContent = usuario.Likes;
        document.getElementById('dislikes-user').textContent = usuario.Dislikes;
    } else {
        // No login
        if (res.status === 401) {
            loginErro.textContent = "Usuário ou senha incorretos.";
            show(loginErro);
        } else if (!res.ok) {
            loginErro.textContent = "Erro ao tentar login.";
            show(loginErro);
        }
    }
};
btnSair.onclick = () => {
    usuario = null;
    hide(usuarioLogado);
    show(btnEntrar);
    hide(btnSair);
    document.querySelectorAll('.comentario-usuario').forEach(i => i.value = '');
};

// Comentários
const comentarioInputs = document.querySelectorAll('.comentario-input');
document.querySelectorAll('.btn-comentar').forEach((btn, idx) => {
    btn.onclick = () => {
        const input = comentarioInputs[idx];
        const texto = input.value.trim();
        if (!usuario || !texto) return;
        const lista = btn.closest('.publicacao-comentarios').querySelector('.comentario-lista');
        const div = document.createElement('div');
        div.className = 'comentario usuario';
        div.innerHTML = `<span class="comentario-autor">${usuario.nome}</span>
            <span class="comentario-texto">${texto}</span>
            <span class="comentario-acoes">
                <img src="./assets/icones/lapis_editar.svg" alt="Editar" class="btn-editar">
                <img src="./assets/icones/lixeira_deletar.svg" alt="Excluir" class="btn-excluir">
            </span>`;
        lista.appendChild(div);
        input.value = '';
        bindComentarioAcoes(div);
    };
});

function bindComentarioAcoes(div) {
    const btnEditar = div.querySelector('.btn-editar');
    const btnExcluir = div.querySelector('.btn-excluir');
    btnEditar.onclick = () => editarComentario(div);
    btnExcluir.onclick = () => excluirComentario(div);
}

document.querySelectorAll('.comentario.usuario').forEach(bindComentarioAcoes);

// Editar comentário
function editarComentario(div) {
    const textoSpan = div.querySelector('.comentario-texto');
    const textoAntigo = textoSpan.textContent;
    textoSpan.innerHTML = `<b>${textoAntigo}</b>`;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = textoAntigo;
    input.className = 'comentario-input';
    textoSpan.replaceWith(input);
    const btnAtualizar = document.createElement('button');
    btnAtualizar.textContent = 'Atualizar';
    btnAtualizar.className = 'btn-comentar';
    div.appendChild(btnAtualizar);
    btnAtualizar.onclick = () => {
        const novoTexto = input.value.trim();
        if (novoTexto) {
            input.replaceWith(textoSpan);
            textoSpan.textContent = novoTexto;
            btnAtualizar.remove();
        }
    };
}

// Excluir comentário
let comentarioParaExcluir = null;
function excluirComentario(div) {
    comentarioParaExcluir = div;
    show(modalExcluir);
}
document.querySelector('.btn-nao').onclick = () => {
    comentarioParaExcluir = null;
    hide(modalExcluir);
};
document.querySelector('.btn-sim').onclick = () => {
    if (comentarioParaExcluir) comentarioParaExcluir.remove();
    comentarioParaExcluir = null;
    hide(modalExcluir);
};

// Fechar modal login ao clicar fora
modalLogin.onclick = e => { if (e.target === modalLogin) hide(modalLogin); };
modalExcluir.onclick = e => { if (e.target === modalExcluir) hide(modalExcluir); };

// Desabilitar botão comentar se não logado ou input vazio
comentarioInputs.forEach((input, idx) => {
    input.oninput = () => {
        const btn = document.querySelectorAll('.btn-comentar')[idx];
        btn.disabled = !usuario || !input.value.trim();
    };
});
// Inicializa estado dos botões comentar
comentarioInputs.forEach((input, idx) => {
    const btn = document.querySelectorAll('.btn-comentar')[idx];
    btn.disabled = true;
});

// Cadastro
const btnCadastrar = document.getElementById('btn-cadastrar');
const modalCadastro = document.getElementById('modal-cadastro');
const btnCadastrarModal = document.querySelector('.btn-cadastrar-modal');
const btnCancelarCadastro = document.querySelector('.btn-cancelar-cadastro');
const cadastroErro = document.querySelector('.cadastro-erro');
const cadastroSucesso = document.querySelector('.cadastro-sucesso');
const inputNome = document.querySelector('.input-nome');
const inputEmailCadastro = document.querySelector('.input-email-cadastro');
const inputApelido = document.querySelector('.input-apelido');
const inputSenhaCadastro = document.querySelector('.input-senha-cadastro');

btnCadastrar && (btnCadastrar.onclick = () => {
    show(modalCadastro);
    inputNome.value = '';
    inputEmailCadastro.value = '';
    inputApelido.value = '';
    inputSenhaCadastro.value = '';
    hide(cadastroErro);
    hide(cadastroSucesso);
});
btnCancelarCadastro && (btnCancelarCadastro.onclick = () => hide(modalCadastro));

btnCadastrarModal && (btnCadastrarModal.onclick = async () => {
    const nome = inputNome.value.trim();
    const email = inputEmailCadastro.value.trim();
    const apelido = inputApelido.value.trim();
    const senha = inputSenhaCadastro.value.trim();
    if (!nome || !email || !apelido || !senha) {
        cadastroErro.textContent = "Preencha todos os campos.";
        show(cadastroErro);
        return;
    }
    const res = await fetch('/api/usuario/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, apelido, senha })
    });
    if (res.ok) {
        hide(cadastroErro);
        show(cadastroSucesso);
        setTimeout(() => {
            hide(modalCadastro);
        }, 1500);
    } else {
        // No cadastro
        if (res.status === 409) {
            cadastroErro.textContent = "E-mail já cadastrado.";
            show(cadastroErro);
        } else if (!res.ok) {
            cadastroErro.textContent = "Erro ao cadastrar.";
            show(cadastroErro);
        }
    }
});

// Fechar modal cadastro ao clicar fora
modalCadastro && (modalCadastro.onclick = e => { if (e.target === modalCadastro) hide(modalCadastro); });
