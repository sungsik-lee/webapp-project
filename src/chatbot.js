// ✅ 환경변수에서 OpenAI API 키 가져오기
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// ✅ DOM 요소들 가져오기
const sendBtn = document.getElementById('sendBtn');
const userInput = document.getElementById('userInput');
const chatbox = document.getElementById('chatbox');
const inputBtn = document.getElementById('inputBtn'); // 추가된 페이지 이동 버튼

// ✅ 대화 히스토리 저장용
let messages = [
  {
    role: 'system',
    content: '너는 사용자의 말을 친절하고 간결하게 이해하고 대답해주는 초록색 챗봇이야.',
  },
];

// ✅ 메시지 전송 함수
async function sendMessage() {
  const message = userInput.value.trim();
  console.log(message)
  if (!message) return;

  // 👉 사용자 메시지 추가
  messages.push({ role: 'user', content: message });

  appendMessage('user', message);
  userInput.value = '';
  appendMessage('bot', '⏳ 생각 중...');

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || '⚠️ 응답이 없어요.';

    // 👉 GPT 응답도 히스토리에 추가
    messages.push({ role: 'assistant', content: reply });
    console.log(messages)
    removeThinking();
    appendMessage('bot', reply);
  } catch (error) {
    removeThinking();
    appendMessage('bot', '❌ 오류가 발생했어요. 잠시 후 다시 시도해 주세요.');
    console.error(error);
  }
}

// ✅ 메시지 출력 함수
function appendMessage(sender, text) {
  const div = document.createElement('div');
  div.className = `message ${sender}`;
  div.textContent = text;
  chatbox.appendChild(div);
  chatbox.scrollTop = chatbox.scrollHeight;
}

// ✅ "⏳" 메시지 제거 함수
function removeThinking() {
  const lastBot = [...chatbox.querySelectorAll('.bot')].pop();
  if (lastBot?.textContent.includes('⏳')) {
    chatbox.removeChild(lastBot);
  }
}

// ✅ 전송 버튼 클릭
sendBtn.addEventListener('click', sendMessage);

// ✅ Enter 키로도 전송 가능
userInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    e.preventDefault(); // 기본 제출 방지
    sendMessage();
  }
});

