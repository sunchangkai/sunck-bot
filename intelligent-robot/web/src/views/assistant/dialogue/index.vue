<template>
  <fs-page>
    <div class="dialogue-container">
      <div class="chat-header">
        <div class="left-group">
          <button @click="createNewSession" class="new-session-button">
            新建会话
          </button>
          <h1 
            @click="startEditing" 
            title="点击编辑会话名称"
            class="editable-title"
          >
            {{ title }}
            <span class="edit-icon">✎</span>
          </h1>
        </div>
        <select v-model="selectedAssistant" class="assistant-select">
          <option v-for="assistant in assistants" :key="assistant.id" :value="assistant.id">
            {{ assistant.name }}
          </option>
        </select>
      </div>
      <div class="chat-content" ref="chatContentRef">
        <div v-if="chatHistory.length === 0" class="empty-history">
          <p>欢迎！今天我能为您提供什么帮助？</p>
        </div>
        <div v-else class="chat-history">
          <div v-for="(message, index) in chatHistory" :key="index" :class="['message', message.role]">
            <div v-if="message.role === 'assistant'" class="avatar assistant">
              <span>AI</span>
            </div>
            <div class="content">
              <p v-if="message.role === 'user'">{{ message.content }}</p>
              <p v-else v-html="message.displayContent"></p>
            </div>
            <div v-if="message.role === 'user'" class="avatar user">
              <span>{{ getUserInitials }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="input-area">
        <textarea 
          v-model="userInput" 
          placeholder="在此输入您的消息..."
          @keydown.enter.prevent="sendMessage"
          rows="1"
        ></textarea>
        <button @click="sendMessage" :disabled="!userInput.trim()">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </div>
    </div>
  </fs-page>

  <div v-if="isEditing" class="modal-overlay" @click="cancelEditing">
    <div class="modal-content" @click.stop>
      <h2>编辑会话名称</h2>
      <input 
        v-model="editedTitle" 
        @keyup.enter="saveTitle" 
        @keyup.esc="cancelEditing" 
        ref="titleInput"
        placeholder="输入新的会话名称"
      />
      <div class="button-group">
        <button class="modal-button cancel-button" @click="cancelEditing">取消</button>
        <button class="modal-button save-button" @click="saveTitle">保存</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="Dialogue">
import * as api from './api';
import { storeToRefs } from 'pinia';
import { useUserInfo } from '/@/stores/userInfo';
import { ref, onMounted, nextTick, watch, computed } from 'vue';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  displayContent?: string;
}

interface Assistant {
  id: number;
  name: string;
}

const stores = useUserInfo();
const { userInfos } = storeToRefs(stores);
const chatHistory = ref<ChatMessage[]>([]);
const userInput = ref('');
const chatContentRef = ref<HTMLElement | null>(null);

const assistants = ref<Assistant[]>([
  { id: 1, name: '通用助理' },
  { id: 2, name: '代码助手' },
  { id: 3, name: '写作助理' },
  // 可以根据需要添加更多助理
]);

const selectedAssistant = ref(assistants.value[0].id);

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContentRef.value) {
      chatContentRef.value.scrollTop = chatContentRef.value.scrollHeight;
    }
  });
};

const typewriterEffect = async (message: ChatMessage, delay: number = 30) => {
  const content = message.content;
  let currentIndex = 0;
  
  const typeNextChar = () => {
    if (currentIndex < content.length) {
      message.displayContent = content.slice(0, currentIndex + 1) + '<span class="cursor">|</span>';
      currentIndex++;
      setTimeout(typeNextChar, delay);
    } else {
      message.displayContent = content;
    }
  };

  typeNextChar();
};

const sendMessage = async () => {
  if (!userInput.value.trim()) return;

  // Add user message to chat history
  chatHistory.value.push({ role: 'user', content: userInput.value });

  // Save user input, then clear the input field
  const message = userInput.value;
  userInput.value = '';

  // Scroll to bottom after user message is added
  scrollToBottom();

  try {
    // Send message to backend API
    const response = await api.AddObj({ content: message, assistantId: selectedAssistant.value });
    
    // Add AI reply to chat history with initial empty display content
    const aiMessage: ChatMessage = { role: 'assistant', content: response.data.reply, displayContent: '' };
    chatHistory.value.push(aiMessage);

    // Scroll to bottom after AI message is added
    scrollToBottom();

    // Start typewriter effect
    await typewriterEffect(aiMessage);

    // Scroll to bottom again after typewriter effect is complete
    scrollToBottom();
  } catch (error) {
    console.error('发送消息失败:', error);
    chatHistory.value.push({ role: 'assistant', content: '抱歉，发生了错误。请稍后再试。', displayContent: '抱歉，发生了错误。请稍后再试。' });
    
    // Scroll to bottom if error message is added
    scrollToBottom();
  }
};

// Watch for changes in chatHistory and scroll to bottom
watch(() => chatHistory.value.length, () => {
  scrollToBottom();
});

const getUserInitials = computed(() => {
  const username = userInfos.value.username;
  if (!username || username.trim() === '') {
    return 'Co'; // 'Co' for 'Common' or guest user
  }
  return username.trim().slice(0, 2).toUpperCase();
});

const DEFAULT_TITLE = '默认会话';
const title = ref(DEFAULT_TITLE);
const isEditing = ref(false);
const editedTitle = ref('');
const titleInput = ref<HTMLInputElement | null>(null);

const startEditing = () => {
  isEditing.value = true;
  editedTitle.value = title.value;
  nextTick(() => {
    titleInput.value?.focus();
  });
};

const saveTitle = () => {
  if (editedTitle.value.trim()) {
    title.value = editedTitle.value.trim();
  }
  isEditing.value = false;
};

const cancelEditing = () => {
  isEditing.value = false;
};

const createNewSession = () => {
  // 重置会话状态
  chatHistory.value = [];
  title.value = DEFAULT_TITLE;
  selectedAssistant.value = assistants.value[0].id;
  // 可以在这里添加其他需要重置的状态
  console.log('新会话已创建');
};

onMounted(() => {
  console.log('Dialogue component mounted');
  // You can load initial chat history here if needed
});
</script>

<style scoped>
.dialogue-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f7f7f8;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
}

.chat-header {
  background-color: #ffffff;
  padding: 16px 24px;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-group {
  display: flex;
  align-items: center;
  gap: 16px;
}

.chat-header h1.editable-title {
  margin: 0;
  font-size: 20px;
  color: #333;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.chat-header h1.editable-title .edit-icon {
  font-size: 16px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.chat-header h1.editable-title:hover .edit-icon {
  opacity: 1;
}

.chat-header h1.editable-title:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.new-session-button {
  padding: 8px 16px;
  font-size: 14px;
  color: #ffffff;
  background-color: #1677ff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: min-content;
}

.new-session-button:hover {
  background-color: #4096ff;
}

.new-session-button:active {
  background-color: #0958d9;
}

.assistant-select {
  width: auto;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background-color: #ffffff;
  color: #333;
  cursor: pointer;
  transition: all 0.3s;
  flex: 0 0 auto;
  margin-left: auto;
}

.assistant-select:focus {
  outline: none;
  border-color: #1677ff;
  box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.2);
}

.chat-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  padding-bottom: 120px; /* 增加底部内边距，为输入框留出空间 */
}

.empty-history {
  text-align: center;
  color: #666;
  font-size: 16px;
  margin-top: 40px;
}

.chat-history {
  max-width: 800px;
  margin: 0 auto;
}

.message {
  display: flex;
  margin-bottom: 24px;
  align-items: flex-start;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
  color: #ffffff;
  text-transform: uppercase;
  overflow: hidden;
}

.avatar span {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  text-align: center;
}

.user .avatar {
  margin-left: 16px;
  background-color: #1677ff;
}

.assistant .avatar {
  margin-right: 16px;
  background-color: #10a37f;
}

.content {
  background-color: #ffffff;
  padding: 12px 16px;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  max-width: 80%;
  word-wrap: break-word; /* 添加这行 */
  overflow-wrap: break-word; /* 添加这行 */
}

.content p {
  margin: 0;
  line-height: 1.6;
  white-space: pre-wrap; /* 添加这行 */
}

.user {
  justify-content: flex-end;
}

.user .content {
  background-color: #e6f4ff;
  color: #333;
}

.input-area {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  padding: 16px 24px;
  background-color: #ffffff;
  box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

textarea {
  flex: 1;
  height: auto;
  min-height: 44px;
  max-height: 100px;
  resize: none;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 16px;
  line-height: 1.5;
  transition: all 0.3s;
  overflow: hidden;
}

textarea:focus {
  outline: none;
  border-color: #1677ff;
  box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.2);
}

button {
  width: 44px;
  height: 44px;
  margin-left: 12px;
  background-color: #1677ff;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #4096ff;
}

button:disabled {
  background-color: #d9d9d9;
  cursor: not-allowed;
}

button svg {
  width: 20px;
  height: 20px;
}

@media (max-width: 768px) {
  .input-area {
    padding: 12px;
  }
}

.cursor {
  animation: blink 0.7s infinite;
}

@keyframes blink {
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background-color: #ffffff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 300px;
  max-width: 90%;
}

.modal-content h2 {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 20px;
  color: #333;
  text-align: center;
}

.modal-content input {
  width: 100%;
  padding: 10px 12px;
  margin-bottom: 20px;
  font-size: 16px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  transition: all 0.3s;
}

.modal-content input:focus {
  outline: none;
  border-color: #1677ff;
  box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.2);
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.modal-button {
  padding: 10px 0;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: 48%;
  text-align: center;
}

.save-button {
  background-color: #1677ff;
  color: #ffffff;
  border: none;
  box-shadow: 0 2px 4px rgba(22, 119, 255, 0.2);
}

.save-button:hover {
  background-color: #4096ff;
  box-shadow: 0 4px 6px rgba(22, 119, 255, 0.3);
}

.save-button:active {
  background-color: #0958d9;
  box-shadow: 0 1px 2px rgba(22, 119, 255, 0.2);
}

.cancel-button {
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #d9d9d9;
}

.cancel-button:hover {
  background-color: #e0e0e0;
  border-color: #bfbfbf;
}

.cancel-button:active {
  background-color: #d0d0d0;
  border-color: #a6a6a6;
}
</style>
