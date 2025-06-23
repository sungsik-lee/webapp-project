const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const sendBtn = document.getElementById('sendBtn');
const userInput = document.getElementById('userInput');
const chatbox = document.getElementById('chatbox');

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage('user', message);
  userInput.value = '';
  appendMessage('bot', '⏳ 생각 중...');

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || '⚠️ 응답이 없어요.';

    removeThinking();
    appendMessage('bot', reply);
  } catch (error) {
    removeThinking();
    appendMessage('bot', '❌ 오류가 발생했어요. 잠시 후 다시 시도해 주세요.');
    console.error(error);
  }
}

function appendMessage(sender, text) {
  const div = document.createElement('div');
  div.className = `message ${sender}`;
  div.textContent = text;
  chatbox.appendChild(div);
  chatbox.scrollTop = chatbox.scrollHeight;
}

function removeThinking() {
  const lastBot = [...chatbox.querySelectorAll('.bot')].pop();
  if (lastBot?.textContent.includes('⏳')) {
    chatbox.removeChild(lastBot);
  }
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') sendMessage();
});
