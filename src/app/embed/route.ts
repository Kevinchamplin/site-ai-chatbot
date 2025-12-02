export const dynamic = "force-dynamic";

export async function GET() {
  const js = `
(function () {
  const script = document.currentScript;
  if (!script) return;

  const token = script.getAttribute("data-bot-token");
  const origin = script.getAttribute("data-origin") || window.location.origin;

  const container = document.createElement("div");
  container.id = "site-ai-chatbot-widget";
  container.style.position = "fixed";
  container.style.bottom = "16px";
  container.style.right = "16px";
  container.style.zIndex = "99999";
  container.style.fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

  const button = document.createElement("button");
  button.textContent = "Chat";
  button.style.borderRadius = "999px";
  button.style.border = "none";
  button.style.padding = "10px 16px";
  button.style.background = "#0f172a";
  button.style.color = "#e5e7eb";
  button.style.cursor = "pointer";

  const panel = document.createElement("div");
  panel.style.position = "fixed";
  panel.style.bottom = "64px";
  panel.style.right = "16px";
  panel.style.width = "320px";
  panel.style.maxHeight = "420px";
  panel.style.borderRadius = "16px";
  panel.style.border = "1px solid rgba(15,23,42,0.85)";
  panel.style.background = "#020617";
  panel.style.display = "none";
  panel.style.flexDirection = "column";
  panel.style.overflow = "hidden";

  const header = document.createElement("div");
  header.style.padding = "10px 12px";
  header.style.fontSize = "12px";
  header.style.color = "#e5e7eb";
  header.textContent = "site-ai-chatbot";

  const transcript = document.createElement("div");
  transcript.style.flex = "1";
  transcript.style.padding = "8px 12px";
  transcript.style.overflowY = "auto";
  transcript.style.fontSize = "13px";
  transcript.style.color = "#e5e7eb";

  const form = document.createElement("form");
  form.style.display = "flex";
  form.style.gap = "4px";
  form.style.padding = "8px";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Ask a question...";
  input.style.flex = "1";
  input.style.borderRadius = "999px";
  input.style.border = "1px solid #1f2937";
  input.style.padding = "6px 10px";
  input.style.background = "#020617";
  input.style.color = "#e5e7eb";

  const send = document.createElement("button");
  send.type = "submit";
  send.textContent = "Send";
  send.style.borderRadius = "999px";
  send.style.border = "none";
  send.style.padding = "6px 12px";
  send.style.background = "#e5e7eb";
  send.style.color = "#020617";
  send.style.fontSize = "12px";
  send.style.cursor = "pointer";

  form.appendChild(input);
  form.appendChild(send);

  panel.appendChild(header);
  panel.appendChild(transcript);
  panel.appendChild(form);

  container.appendChild(button);
  document.body.appendChild(container);
  document.body.appendChild(panel);

  let history = [];

  function appendMessage(role, text) {
    const line = document.createElement("div");
    line.style.marginBottom = "4px";
    const label = document.createElement("span");
    label.style.fontSize = "10px";
    label.style.textTransform = "uppercase";
    label.style.letterSpacing = "0.12em";
    label.style.color = role === "user" ? "#9ca3af" : "#6366f1";
    label.textContent = role === "user" ? "You" : "Bot";
    const content = document.createElement("span");
    content.style.marginLeft = "6px";
    content.textContent = text;
    line.appendChild(label);
    line.appendChild(content);
    transcript.appendChild(line);
    transcript.scrollTop = transcript.scrollHeight;
  }

  button.addEventListener("click", function () {
    panel.style.display = panel.style.display === "none" ? "flex" : "none";
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const value = input.value.trim();
    if (!value) return;
    appendMessage("user", value);
    input.value = "";

    const payload = {
      message: value,
      history: history,
      token: token,
    };

    fetch(origin + "/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var reply = data && data.reply ? data.reply : "(no response)";
        appendMessage("assistant", reply);
        history = history.concat([
          { role: "user", content: value },
          { role: "assistant", content: reply },
        ]);
      })
      .catch(function () {
        appendMessage("assistant", "There was a problem talking to the chat API.");
      });
  });
})();
`;

  return new Response(js, {
    status: 200,
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=60",
    },
  });
}
