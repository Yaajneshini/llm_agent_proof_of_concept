// agent.js – LLM Agent with basic tool use
class LLMAgent {
  constructor() {
    this.providers = {
      openai: "https://api.openai.com/v1/chat/completions",
      anthropic: "https://api.anthropic.com/v1/messages",
      google: "https://generativelanguage.googleapis.com/v1beta/models",
      aipipe: "https://aipipe.org/openrouter/v1/chat/completions"
    };
    this.state = {
      provider: "openai",
      apiKey: "",
      model: "gpt-4o-mini",
      conversation: []
    };
    this.init();
  }

  init() {
    this.input = document.getElementById("user-input");
    this.sendBtn = document.getElementById("send-message");
    this.messagesContainer = document.getElementById("messages");
    this.apiKeyInput = document.getElementById("api-key");
    this.providerSelect = document.getElementById("llm-provider");
    this.modelSelect = document.getElementById("model-name");

    this.sendBtn.addEventListener("click", () => this.handleUserMessage());
    this.apiKeyInput.addEventListener("change", e => this.state.apiKey = e.target.value.trim());
    this.providerSelect.addEventListener("change", e => this.state.provider = e.target.value);
    this.modelSelect.addEventListener("change", e => this.state.model = e.target.value);
  }

  addMessage(role, text) {
    const div = document.createElement("div");
    div.className = `msg ${role}`;
    div.innerHTML = `<strong>${role}:</strong> ${text}`;
    this.messagesContainer.appendChild(div);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  async handleUserMessage() {
    const text = this.input.value.trim();
    if (!text) return;
    this.addMessage("user", text);
    this.state.conversation.push({ role: "user", content: text });
    this.input.value = "";
    await this.loop();
  }

  async loop() {
    try {
      const { provider, apiKey, model, conversation } = this.state;
      if (!apiKey) {
        this.addMessage("error", "⚠️ Please enter your API key.");
        return;
      }

      const url = this.providers[provider];
      const headers = { "Content-Type": "application/json" };
      if (provider !== "google") headers["Authorization"] = `Bearer ${apiKey}`;

      let payload;
      if (provider === "openai" || provider === "aipipe") {
        payload = { model, messages: conversation, tools: this.getTools() };
      } else if (provider === "anthropic") {
        payload = { model, messages: conversation };
      } else if (provider === "google") {
        payload = { contents: [{ parts: [{ text: conversation.map(m => m.content).join("\n") }] }] };
      }

      const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      const { output, toolCalls } = this.parseResponse(provider, data);
      if (output) {
        this.addMessage("assistant", output);
        this.state.conversation.push({ role: "assistant", content: output });
      }
      if (toolCalls && toolCalls.length) {
        for (const tc of toolCalls) {
          const toolResult = await this.handleToolCall(tc);
          this.addMessage("tool", `[${tc.name}] → ${toolResult}`);
          this.state.conversation.push({ role: "tool", content: toolResult });
        }
        await this.loop();
      }
    } catch (err) {
      this.addMessage("error", "❌ " + err.message);
    }
  }

  getTools() {
    return [
      { name: "search", description: "Search the web for info", parameters: { query: "string" } },
      { name: "execute_js", description: "Execute JS code", parameters: { code: "string" } },
      { name: "visualize", description: "Make a chart", parameters: { data: "string" } }
    ];
  }

  parseResponse(provider, data) {
    if (provider === "openai" || provider === "aipipe") {
      const msg = data.choices[0].message;
      return { output: msg.content, toolCalls: msg.tool_calls || [] };
    }
    if (provider === "anthropic") {
      return { output: data.content[0].text, toolCalls: [] };
    }
    if (provider === "google") {
      return { output: data.candidates[0].content.parts[0].text, toolCalls: [] };
    }
    return { output: "Unsupported provider", toolCalls: [] };
  }

  async handleToolCall(tc) {
    if (tc.name === "search") return await this.webSearch(tc.arguments.query);
    if (tc.name === "execute_js") return this.executeCode(tc.arguments.code);
    if (tc.name === "visualize") return this.visualize(tc.arguments.data);
    return "Unknown tool";
  }

  async webSearch(query) {
    // Stubbed search - replace with real API
    return `Search results for "${query}" (stub).`;
  }

  executeCode(code) {
    try {
      return String(eval(code));
    } catch (err) {
      return "Error: " + err.message;
    }
  }

  visualize(data) {
    return `Visualization created for: ${data} (stub).`;
  }
}

// Boot
document.addEventListener("DOMContentLoaded", () => {
  window.agent = new LLMAgent();
});
