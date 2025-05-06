const icons = document.querySelectorAll('.interaction-icon');
  icons.forEach(icon => {
    icon.addEventListener('click', () => {
      const isLoggedIn = false; // simulação: mudar para true se logado
      if (!isLoggedIn) {
        const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        loginModal.show();
      }
    });
  });