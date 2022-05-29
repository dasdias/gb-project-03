document.addEventListener('DOMContentLoaded', () => {
  const btnCart = document.querySelector('.btn-cart');
  const modalWrap = document.querySelector('.modal-wrap');
  const modalClose = document.querySelector('.modal__close');

  const removeModal = () => {
    modalWrap.classList.remove('modal-wrap_active');
  }
  const showModal = () => {
    modalWrap.classList.add('modal-wrap_active');
  }
  
  btnCart.addEventListener('click', () => {
    showModal();
  });

  modalWrap.addEventListener('click', (e) => {
    const target = e.target;
    if(target.classList.contains('modal-wrap')) {
      removeModal();
    }
  });
  modalClose.addEventListener('click', () => {
    removeModal();
  });
});