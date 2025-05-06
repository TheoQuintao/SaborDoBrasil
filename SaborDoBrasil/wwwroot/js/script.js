document.addEventListener('DOMContentLoaded', function() {
    // Database simulation
    const database = {
        company: {
            name: "Sabor do Brasil",
            logo: "assets/images/logo_sabor_do_brasil.png",
            totalLikes: 125,
            totalDislikes: 32
        },
        users: [
            {
                id: 1,
                email: "usuario1@example.com",
                password: "senha123",
                name: "Usuário 01",
                avatar: "https://randomuser.me/api/portraits/men/1.jpg",
                userLikes: 10,
                userDislikes: 2,
                userComments: 5
            },
            {
                id: 2,
                email: "usuario2@example.com",
                password: "senha123",
                name: "Usuário 02",
                avatar: "https://randomuser.me/api/portraits/women/2.jpg",
                userLikes: 15,
                userDislikes: 1,
                userComments: 3
            }
        ],
        publications: [
            {
                id: 1,
                title: "Título do prato 01",
                image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
                location: "Local 01 - Macedo-AL",
                likes: 45,
                dislikes: 8,
                comments: 12,
                userLiked: false,
                userDisliked: false,
                commentsList: [
                    {
                        id: 1,
                        userId: 1,
                        userName: "Usuário 01",
                        text: "Este prato está delicioso!",
                        date: "2023-05-15"
                    },
                    {
                        id: 2,
                        userId: 2,
                        userName: "Usuário 02",
                        text: "Concordo, muito saboroso!",
                        date: "2023-05-16"
                    }
                ]
            },
            {
                id: 2,
                title: "Título do prato 02",
                image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
                location: "Local 02 - Macedo-AL",
                likes: 38,
                dislikes: 12,
                comments: 8,
                userLiked: false,
                userDisliked: false,
                commentsList: [
                    {
                        id: 3,
                        userId: 1,
                        userName: "Usuário 01",
                        text: "A apresentação está incrível!",
                        date: "2023-05-17"
                    }
                ]
            },
            {
                id: 3,
                title: "Título do prato 03",
                image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
                location: "Local 03 - Macedo-AL",
                likes: 42,
                dislikes: 12,
                comments: 15,
                userLiked: false,
                userDisliked: false,
                commentsList: []
            }
        ]
    };

    // State management
    let currentUser = null;
    let currentPublicationForComment = null;
    let currentCommentForEdit = null;
    let currentCommentForDelete = null;

    // DOM Elements
    const loginBtn = document.getElementById('login-btn');
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    const modalLoginBtn = document.getElementById('modalLoginBtn');
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const userProfile = document.getElementById('user-profile');
    const userName = document.getElementById('user-name');
    const userAvatar = document.getElementById('user-avatar');
    const userLikes = document.getElementById('user-likes');
    const userDislikes = document.getElementById('user-dislikes');
    const totalLikes = document.getElementById('total-likes');
    const totalDislikes = document.getElementById('total-dislikes');
    const publicationsContainer = document.getElementById('publications-container');
    const commentModal = new bootstrap.Modal(document.getElementById('commentModal'));
    const commentPublicationImage = document.getElementById('commentPublicationImage');
    const commentPublicationTitle = document.getElementById('commentPublicationTitle');
    const commentPublicationLocation = document.getElementById('commentPublicationLocation');
    const commentText = document.getElementById('commentText');
    const submitCommentBtn = document.getElementById('submitCommentBtn');
    const commentsSection = document.getElementById('commentsSection');
    const deleteCommentModal = new bootstrap.Modal(document.getElementById('deleteCommentModal'));
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

    // Initialize the page
    function init() {
        loadCompanyData();
        loadPublications();
        
        // Event listeners
        loginBtn.addEventListener('click', handleLoginClick);
        modalLoginBtn.addEventListener('click', handleModalLogin);
        commentText.addEventListener('input', handleCommentInput);
        submitCommentBtn.addEventListener('click', handleCommentSubmit);
        confirmDeleteBtn.addEventListener('click', handleCommentDelete);
    }

    // Load company data
    function loadCompanyData() {
        totalLikes.textContent = database.company.totalLikes;
        totalDislikes.textContent = database.company.totalDislikes;
    }

    // Load publications
    function loadPublications() {
        publicationsContainer.innerHTML = '';
        
        database.publications.forEach(pub => {
            const pubElement = document.createElement('div');
            pubElement.className = 'publication-card';
            pubElement.innerHTML = `
                <img src="${pub.image}" alt="${pub.title}" class="publication-image">
                <h4>${pub.title}</h4>
                <p class="publication-location">${pub.location}</p>
                <div class="interaction-buttons">
                    <button class="interaction-btn like-btn ${pub.userLiked ? 'like-active' : ''}" data-id="${pub.id}">
                        <i class="fas ${pub.userLiked ? 'fa-thumbs-up' : 'fa-thumbs-up'}"></i>
                        <span class="like-count">${pub.likes}</span>
                    </button>
                    <button class="interaction-btn dislike-btn ${pub.userDisliked ? 'dislike-active' : ''}" data-id="${pub.id}">
                        <i class="fas ${pub.userDisliked ? 'fa-thumbs-down' : 'fa-thumbs-down'}"></i>
                        <span class="dislike-count">${pub.dislikes}</span>
                    </button>
                    <button class="interaction-btn comment-btn" data-id="${pub.id}">
                        <i class="fas fa-comment"></i>
                        <span class="comment-count">${pub.comments}</span>
                    </button>
                </div>
            `;
            publicationsContainer.appendChild(pubElement);
        });
        
        // Add event listeners to interaction buttons
        document.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', handleLike);
        });
        
        document.querySelectorAll('.dislike-btn').forEach(btn => {
            btn.addEventListener('click', handleDislike);
        });
        
        document.querySelectorAll('.comment-btn').forEach(btn => {
            btn.addEventListener('click', handleComment);
        });
        
        // Add click event to publication images
        document.querySelectorAll('.publication-image').forEach(img => {
            img.addEventListener('click', function() {
                const pubId = parseInt(this.closest('.publication-card').querySelector('.like-btn').dataset.id);
                openCommentModal(pubId);
            });
        });
    }

    // Handle login button click
    function handleLoginClick() {
        if (currentUser) {
            // Logout
            currentUser = null;
            loginBtn.textContent = 'Entrar';
            userProfile.classList.add('d-none');
            loadCompanyData();
            loadPublications();
        } else {
            // Show login modal
            loginModal.show();
        }
    }

    // Handle modal login
    function handleModalLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Validate inputs
        if (!email || !password) {
            loginError.classList.remove('d-none');
            return;
        }
        
        // Find user in database
        const user = database.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Successful login
            currentUser = user;
            loginModal.hide();
            loginBtn.textContent = 'Sair';
            userProfile.classList.remove('d-none');
            userName.textContent = user.name;
            userAvatar.src = user.avatar;
            userLikes.textContent = user.userLikes;
            userDislikes.textContent = user.userDislikes;
            
            // Reset form
            loginForm.reset();
            loginError.classList.add('d-none');
        } else {
            // Invalid credentials
            loginError.classList.remove('d-none');
        }
    }

    // Handle like
    function handleLike(e) {
        if (!currentUser) {
            loginModal.show();
            return;
        }
        
        const pubId = parseInt(e.currentTarget.dataset.id);
        const publication = database.publications.find(p => p.id === pubId);
        
        if (publication.userLiked) {
            // Unlike
            publication.likes--;
            publication.userLiked = false;
            currentUser.userLikes--;
            database.company.totalLikes--;
        } else {
            // Like
            if (publication.userDisliked) {
                // Remove dislike if exists
                publication.dislikes--;
                publication.userDisliked = false;
                currentUser.userDislikes--;
                database.company.totalDislikes--;
            }
            publication.likes++;
            publication.userLiked = true;
            currentUser.userLikes++;
            database.company.totalLikes++;
        }
        
        // Update UI
        updatePublicationUI(pubId);
        updateUserStats();
        updateCompanyStats();
    }

    // Handle dislike
    function handleDislike(e) {
        if (!currentUser) {
            loginModal.show();
            return;
        }
        
        const pubId = parseInt(e.currentTarget.dataset.id);
        const publication = database.publications.find(p => p.id === pubId);
        
        if (publication.userDisliked) {
            // Undislike
            publication.dislikes--;
            publication.userDisliked = false;
            currentUser.userDislikes--;
            database.company.totalDislikes--;
        } else {
            // Dislike
            if (publication.userLiked) {
                // Remove like if exists
                publication.likes--;
                publication.userLiked = false;
                currentUser.userLikes--;
                database.company.totalLikes--;
            }
            publication.dislikes++;
            publication.userDisliked = true;
            currentUser.userDislikes++;
            database.company.totalDislikes++;
        }
        
        // Update UI
        updatePublicationUI(pubId);
        updateUserStats();
        updateCompanyStats();
    }

    // Handle comment button click
    function handleComment(e) {
        if (!currentUser) {
            loginModal.show();
            return;
        }
        
        const pubId = parseInt(e.currentTarget.dataset.id);
        openCommentModal(pubId);
    }

    // Open comment modal
    function openCommentModal(pubId) {
        currentPublicationForComment = database.publications.find(p => p.id === pubId);
        
        // Set publication info in modal
        commentPublicationImage.src = currentPublicationForComment.image;
        commentPublicationTitle.textContent = currentPublicationForComment.title;
        commentPublicationLocation.textContent = currentPublicationForComment.location;
        
        // Load comments
        loadComments();
        
        // Reset comment form
        commentText.value = '';
        submitCommentBtn.disabled = true;
        
        // Show modal
        commentModal.show();
    }

    // Load comments
    function loadComments() {
        commentsSection.innerHTML = '';
        
        if (currentPublicationForComment.commentsList.length === 0) {
            commentsSection.innerHTML = '<p>Nenhum comentário ainda. Seja o primeiro a comentar!</p>';
            return;
        }
        
        currentPublicationForComment.commentsList.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.className = 'comment-item';
            
            const isCurrentUserComment = currentUser && comment.userId === currentUser.id;
            
            commentElement.innerHTML = `
                <div class="d-flex justify-content-between">
                    <span class="comment-user">${comment.userName}</span>
                    <small class="text-muted">${comment.date}</small>
                </div>
                <p>${comment.text}</p>
                ${isCurrentUserComment ? `
                <div class="comment-actions">
                    <i class="fas fa-edit edit-comment" data-id="${comment.id}"></i>
                    <i class="fas fa-trash delete-comment" data-id="${comment.id}"></i>
                </div>
                ` : ''}
            `;
            
            commentsSection.appendChild(commentElement);
        });
        
        // Add event listeners to edit and delete buttons
        document.querySelectorAll('.edit-comment').forEach(btn => {
            btn.addEventListener('click', handleEditComment);
        });
        
        document.querySelectorAll('.delete-comment').forEach(btn => {
            btn.addEventListener('click', handleDeleteComment);
        });
    }

    // Handle comment input
    function handleCommentInput() {
        submitCommentBtn.disabled = commentText.value.trim() === '';
    }

    // Handle comment submit
    function handleCommentSubmit() {
        const commentTextValue = commentText.value.trim();
        
        if (commentTextValue === '') return;
        
        if (currentCommentForEdit) {
            // Edit existing comment
            const comment = currentPublicationForComment.commentsList.find(c => c.id === currentCommentForEdit);
            comment.text = commentTextValue;
            currentCommentForEdit = null;
        } else {
            // Add new comment
            const newComment = {
                id: Date.now(), // Simple ID generation
                userId: currentUser.id,
                userName: currentUser.name,
                text: commentTextValue,
                date: new Date().toISOString().split('T')[0]
            };
            
            currentPublicationForComment.commentsList.push(newComment);
            currentPublicationForComment.comments++;
        }
        
        // Update UI
        loadComments();
        updatePublicationUI(currentPublicationForComment.id);
        
        // Reset form
        commentText.value = '';
        submitCommentBtn.disabled = true;
    }

    // Handle edit comment
    function handleEditComment(e) {
        const commentId = parseInt(e.currentTarget.dataset.id);
        const comment = currentPublicationForComment.commentsList.find(c => c.id === commentId);
        
        currentCommentForEdit = commentId;
        commentText.value = comment.text;
        submitCommentBtn.disabled = false;
        submitCommentBtn.textContent = 'Atualizar';
    }

    // Handle delete comment
    function handleDeleteComment(e) {
        const commentId = parseInt(e.currentTarget.dataset.id);
        currentCommentForDelete = commentId;
        deleteCommentModal.show();
    }

    // Handle comment delete confirmation
    function handleCommentDelete() {
        const commentIndex = currentPublicationForComment.commentsList.findIndex(c => c.id === currentCommentForDelete);
        
        if (commentIndex !== -1) {
            currentPublicationForComment.commentsList.splice(commentIndex, 1);
            currentPublicationForComment.comments--;
            
            // Update UI
            loadComments();
            updatePublicationUI(currentPublicationForComment.id);
            deleteCommentModal.hide();
            currentCommentForDelete = null;
        }
    }

    // Update publication UI
    function updatePublicationUI(pubId) {
        const publication = database.publications.find(p => p.id === pubId);
        const pubElement = document.querySelector(`.like-btn[data-id="${pubId}"]`).closest('.publication-card');
        
        // Update like button
        const likeBtn = pubElement.querySelector('.like-btn');
        const likeCount = pubElement.querySelector('.like-count');
        likeBtn.classList.toggle('like-active', publication.userLiked);
        likeBtn.innerHTML = `<i class="fas ${publication.userLiked ? 'fa-thumbs-up' : 'fa-thumbs-up'}"></i> <span class="like-count">${publication.likes}</span>`;
        likeCount.textContent = publication.likes;
        
        // Update dislike button
        const dislikeBtn = pubElement.querySelector('.dislike-btn');
        const dislikeCount = pubElement.querySelector('.dislike-count');
        dislikeBtn.classList.toggle('dislike-active', publication.userDisliked);
        dislikeBtn.innerHTML = `<i class="fas ${publication.userDisliked ? 'fa-thumbs-down' : 'fa-thumbs-down'}"></i> <span class="dislike-count">${publication.dislikes}</span>`;
        dislikeCount.textContent = publication.dislikes;
        
        // Update comment count
        const commentCount = pubElement.querySelector('.comment-count');
        commentCount.textContent = publication.comments;
        
        // Re-add event listeners
        likeBtn.addEventListener('click', handleLike);
        dislikeBtn.addEventListener('click', handleDislike);
        pubElement.querySelector('.comment-btn').addEventListener('click', handleComment);
    }

    // Update user stats
    function updateUserStats() {
        if (currentUser) {
            userLikes.textContent = currentUser.userLikes;
            userDislikes.textContent = currentUser.userDislikes;
        }
    }

    // Update company stats
    function updateCompanyStats() {
        totalLikes.textContent = database.company.totalLikes;
        totalDislikes.textContent = database.company.totalDislikes;
    }

    // Initialize the application
    init();
});