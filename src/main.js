import Swal from 'sweetalert2';

const dontClickBtn = document.getElementById('dontClickBtn');
const chatbotBtn = document.getElementById('chatbotBtn');

dontClickBtn.addEventListener('click', () => {
  Swal.fire({
    title: '경고!',
    text: '클릭하지 말라고 했잖아요!',
    icon: 'warning',
    confirmButtonText: '죄송합니다...',
    confirmButtonColor: '#52b788',
    background: '#d8f3dc',
    color: '#1b4332',
  });
});

chatbotBtn.addEventListener('click', () => {
  window.location.href = 'chatbot.html';
});
