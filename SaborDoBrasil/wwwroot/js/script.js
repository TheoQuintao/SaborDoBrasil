document.addEventListener('DOMContentLoaded', function() {
    // Estado da aplicação
    const state = {
        loggedIn: false,
        currentUser: null,
        currentPublication: null,
        currentComment: null
    };

    // Elementos DOM
    const loginBtn = document.getElementById('login-btn');
    const userProfile = document.getElementById('user-profile');
    const loginModal = new bootstrap.Modal('#loginModal');
    const commentModal = new bootstrap.Modal('#commentModal');
    const deleteModal = new bootstrap.Modal('#deleteCommentModal');
    const modalLoginBtn = document.getElementById('modalLoginBtn');
    const submitCommentBtn = document.getElementById('submitCommentBtn');
    const commentText = document.getElementById('commentText');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

    // Event Listeners
    loginBtn.addEventListener('click', toggleLogin);
    modalLoginBtn.addEventListener('click', handleLogin);
    commentText.addEventListener('input', toggleCommentButton);
    submitCommentBtn.addEventListener('click', submitComment);
    confirmDeleteBtn.addEventListener('click', deleteComment);

    // Interações com publicações
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', handleLike);
    });

    document.querySelectorAll('.dislike-btn').forEach(btn => {
        btn.addEventListener('click', handleDislike);
    });

    document.querySelectorAll('.comment-btn').forEach(btn => {
        btn.addEventListener('click', openCommentModal);
    });

    document.querySelectorAll('.publication-image').forEach(img => {
        img.addEventListener('click', function() {
            const pubId = this.closest('.publication-card').querySelector('.like-btn').dataset.id;
            openCommentModal({ currentTarget: { dataset: { id: pubId } } });
        });
    });

    document.querySelectorAll('.icon-delete').forEach(icon => {
        icon.addEventListener('click', function() {
            deleteModal.show();
        });
    });

    // Buscar publicações da API e renderizar
    const container = document.getElementById('publications-container');

    fetch('/api/publicacoes')
      .then(res => res.json())
      .then(publicacoes => {
        console.log('Publicações recebidas:', publicacoes); // <-- Adicione esta linha
        container.innerHTML = '';
        publicacoes.forEach(pub => {
          container.innerHTML += `
            <div class="publication-card">
              <img src="${pub.imagem || 'assets/images/default.png'}" alt="${pub.titulo}" class="publication-image">
              <h4>${pub.titulo}</h4>
              <p class="publication-location">${pub.local}</p>
              <div class="interaction-buttons">
                <button class="interaction-btn like-btn" data-id="${pub.id}">
                  <img src="assets/icons/flecha_cima_vazia.svg" alt="Like" class="icon">
                  <span class="like-count">${pub.likes || 0}</span>
                </button>
                <button class="interaction-btn dislike-btn" data-id="${pub.id}">
                  <img src="assets/icons/flecha_baixo_vazia.svg" alt="Dislike" class="icon">
                  <span class="dislike-count">${pub.dislikes || 0}</span>
                </button>
                <button class="interaction-btn comment-btn" data-id="${pub.id}">
                  <img src="assets/icons/chat.svg" alt="Comentar" class="icon">
                  <span class="comment-count">${pub.comentarios ? pub.comentarios.length : 0}</span>
                </button>
              </div>
            </div>
          `;
        });
      });

    // Funções
    function toggleLogin() {
        if (state.loggedIn) {
            logout();
        } else {
            loginModal.show();
        }
    }

    function handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha: password })
        })
        .then(res => {
            if (!res.ok) throw new Error('Login inválido');
            return res.json();
        })
        .then(user => {
            state.loggedIn = true;
            state.currentUser = user;
            loginBtn.textContent = 'Sair';
            userProfile.classList.remove('d-none');
            document.getElementById('user-name').textContent = user.nome;
            document.getElementById('user-avatar').src = user.foto || 'https://randomuser.me/api/portraits/men/1.jpg';
            // Feche o modal de login se necessário
            loginModal.hide();
        })
        .catch(err => {
            alert('Usuário ou senha inválidos!');
        });
    }

    function logout() {
        state.loggedIn = false;
        state.currentUser = null;
        loginBtn.textContent = 'Entrar';
        userProfile.classList.add('d-none');

        // Resetar interações do usuário
        document.querySelectorAll('.like-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.querySelector('.icon').src = 'assets/icons/flecha_cima_vazia.svg';
        });

        document.querySelectorAll('.dislike-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.querySelector('.icon').src = 'assets/icons/flecha_baixo_vazia.svg';
        });
    }

    function handleLike(e) {
        if (!state.loggedIn) {
            loginModal.show();
            return;
        }

        const btn = e.currentTarget;
        const countElement = btn.querySelector('.like-count');
        let count = parseInt(countElement.textContent);

        if (btn.classList.contains('active')) {
            // Remover like
            btn.classList.remove('active');
            btn.querySelector('.icon').src = 'assets/icons/flecha_cima_vazia.svg';
            count--;
            state.currentUser.likes--;
        } else {
            // Adicionar like
            btn.classList.add('active');
            btn.querySelector('.icon').src = 'assets/icons/flecha_cima_cheia.svg';
            count++;
            state.currentUser.likes++;

            // Remover dislike se existir
            const dislikeBtn = btn.closest('.interaction-buttons').querySelector('.dislike-btn');
            if (dislikeBtn.classList.contains('active')) {
                dislikeBtn.classList.remove('active');
                dislikeBtn.querySelector('.icon').src = 'assets/icons/flecha_baixo_vazia.svg';
                const dislikeCount = parseInt(dislikeBtn.querySelector('.dislike-count').textContent);
                dislikeBtn.querySelector('.dislike-count').textContent = dislikeCount - 1;
                state.currentUser.dislikes--;
            }
        }

        countElement.textContent = count;
        document.getElementById('user-likes').textContent = state.currentUser.likes;
        document.getElementById('total-likes').textContent = 
            parseInt(document.getElementById('total-likes').textContent) + (btn.classList.contains('active') ? 1 : -1);
    }

    function handleDislike(e) {
        if (!state.loggedIn) {
            loginModal.show();
            return;
        }

        const btn = e.currentTarget;
        const countElement = btn.querySelector('.dislike-count');
        let count = parseInt(countElement.textContent);

        if (btn.classList.contains('active')) {
            // Remover dislike
            btn.classList.remove('active');
            btn.querySelector('.icon').src = 'assets/icons/flecha_baixo_vazia.svg';
            count--;
            state.currentUser.dislikes--;
        } else {
            // Adicionar dislike
            btn.classList.add('active');
            btn.querySelector('.icon').src = 'assets/icons/flecha_baixo_cheia.svg';
            count++;
            state.currentUser.dislikes++;

            // Remover like se existir
            const likeBtn = btn.closest('.interaction-buttons').querySelector('.like-btn');
            if (likeBtn.classList.contains('active')) {
                likeBtn.classList.remove('active');
                likeBtn.querySelector('.icon').src = 'assets/icons/flecha_cima_vazia.svg';
                const likeCount = parseInt(likeBtn.querySelector('.like-count').textContent);
                likeBtn.querySelector('.like-count').textContent = likeCount - 1;
                state.currentUser.likes--;
            }
        }

        countElement.textContent = count;
        document.getElementById('user-dislikes').textContent = state.currentUser.dislikes;
        document.getElementById('total-dislikes').textContent = 
            parseInt(document.getElementById('total-dislikes').textContent) + (btn.classList.contains('active') ? 1 : -1);
    }

    function openCommentModal(e) {
        if (!state.loggedIn) {
            loginModal.show();
            return;
        }

        const pubId = e.currentTarget.dataset.id;
        state.currentPublication = pubId;

        // Simular dados da publicação
        const pubElement = document.querySelector(`.publication-card .like-btn[data-id="${pubId}"]`).closest('.publication-card');
        const pubImage = pubElement.querySelector('.publication-image').src;
        const pubTitle = pubElement.querySelector('h4').textContent;
        const pubLocation = pubElement.querySelector('.publication-location').textContent;

        document.getElementById('commentPublicationImage').src = pubImage;
        document.getElementById('commentPublicationTitle').textContent = pubTitle;
        document.getElementById('commentPublicationLocation').textContent = pubLocation;

        commentModal.show();
    }

    function toggleCommentButton() {
        submitCommentBtn.disabled = commentText.value.trim() === '';
    }

    function submitComment() {
        const comment = commentText.value.trim();
        if (comment === '') return;

        // Adicionar novo comentário
        const commentsSection = document.getElementById('commentsSection');
        const newComment = document.createElement('div');
        newComment.className = 'comment-item';
        newComment.innerHTML = `
            <div class="d-flex justify-content-between">
                <span class="comment-user">${state.currentUser.name}</span>
                <small class="text-muted">${new Date().toLocaleDateString()}</small>
            </div>
            <p>${comment}</p>
            <div class="comment-actions">
                <img src="assets/icons/lapis_editar.svg" alt="Editar" class="icon-edit">
                <img src="assets/icons/lixeira_deletar.svg" alt="Excluir" class="icon-delete">
            </div>
        `;

        commentsSection.prepend(newComment);
        
        // Atualizar contador de comentários
        const pubElement = document.querySelector(`.publication-card .like-btn[data-id="${state.currentPublication}"]`).closest('.publication-card');
        const commentCount = pubElement.querySelector('.comment-count');
        commentCount.textContent = parseInt(commentCount.textContent) + 1;

        // Resetar formulário
        commentText.value = '';
        submitCommentBtn.disabled = true;
    }

    function deleteComment() {
        // Simular exclusão do comentário
        deleteModal.hide();
        
        // Atualizar contador de comentários
        const pubElement = document.querySelector(`.publication-card .like-btn[data-id="${state.currentPublication}"]`).closest('.publication-card');
        const commentCount = pubElement.querySelector('.comment-count');
        commentCount.textContent = Math.max(0, parseInt(commentCount.textContent) - 1);
    }
});