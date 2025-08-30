# LLM Agent Proof-of-Concept (POC): Browser-Based Multi-Tool Reasoning

## 📌 Overview
This project is a **browser-based proof-of-concept (POC)** for an **LLM-powered agent** that can perform reasoning by combining **LLM output with external tools**.  
Unlike standard chat UIs, this agent can dynamically decide to call tools such as **web search, code execution, or AI workflows**, and loop through them until a task is complete.  

The entire system runs in the **browser (pure HTML, CSS, JavaScript)** with optional backend support for secure API proxying.

---

## 🚀 Features Implemented

### 🔹 Core Agent Logic
- **Reasoning Loop:**  
  - Takes user input.  
  - Sends conversation context to the LLM with a list of supported tools.  
  - Receives tool calls from the LLM.  
  - Executes the tool calls in-browser.  
  - Returns tool results back to the LLM.  
  - Continues looping until no more tool calls are required.  

- **Provider & Model Selection:**  
  - Supports **OpenAI, Anthropic, Google Gemini, AI Pipe**.  
  - Users select provider and model via UI.  
  - Base URLs handled internally — users only need to provide their **API key**.  

- **Streaming Chat Interface:**  
  - User/assistant messages displayed in a chat-style window.  
  - Conversation history maintained in memory.  

---

### 🔹 Tools Integrated
1. **Web Search**  
   - Allows the LLM agent to search the web.  
   - Currently a stub implementation (placeholder results).  
   - Can be extended with APIs like **Bing Search API** or **SerpAPI**.  

2. **JavaScript Code Execution**  
   - Runs user or LLM-provided JavaScript code **safely in the browser**.  
   - Execution results are returned as tool output.  
   - Errors are caught and displayed.  

3. **Visualization (Stub)**  
   - Accepts data input.  
   - Returns a confirmation message (“Visualization created for data”).  
   - Can be extended with libraries like **Chart.js** or **D3.js** for real plots.  

---

### 🔹 User Interface (UI/UX)
- **Modern Interface (Bootstrap + FontAwesome):**
  - Sidebar for conversation history.  
  - Chat area with assistant/user messages.  
  - Settings modal for API key, provider, model, and preferences.  

- **Quick Actions:**  
  - Predefined prompts (e.g., “Research AI Trends”, “Create Visualization”, “Code Assistant”).  

- **Voice Support (UI elements included):**  
  - Voice input/output options (future extension).  

- **Performance Monitor:**  
  - Displays response time, memory usage, and API call count.  

- **Toast Notifications & Error Handling:**  
  - Friendly error messages with **bootstrap-alert**.  

---

### 🔹 Technical Implementation
- **Frontend Only (POC Mode):**
  - Runs directly in the browser — just open `index.html`.  
  - Uses Fetch API for calling LLMs.  

- **Optional Backend (for Production Use):**
  - Can be served via Flask or Node.js to hide API keys.  
  - Frontend calls a secure proxy API instead of sending keys directly.  

- **Tool Calling Standard:**  
  - Follows **OpenAI-style tool/function calling format**.  
  - Makes it easy to extend with additional tools.  

---
