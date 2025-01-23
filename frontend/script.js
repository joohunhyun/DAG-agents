async function processInput() {
  const userInput = document.getElementById("user-input").value.trim();

  if (!userInput) {
    alert("프롬프트를 입력하세요.");
    return;
  }

  addMessage(userInput, "user");

  addMessage("Subquery 생성중...", "assistant", true); // The third argument is for the new style

  document.getElementById("user-input").value = "";

  try {
    const splitResponse = await fetch("http://localhost:5000/api/split-query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: userInput }),
    });

    if (!splitResponse.ok)
      throw new Error("Error communicating with backend during split-query.");

    const splitData = await splitResponse.json();

    const { tasks = [], subquery_outputs = [] } = splitData;

    for (const task of tasks) {
      await new Promise((resolve) => {
        addMessage(task, "assistant");
        setTimeout(resolve, 500); // Add delay for sequential effect
      });
    }

    addMessage("Context 생성중...", "assistant", true); // Context generation in progress

    const subqueryOutputsString = JSON.stringify(subquery_outputs);

    const finalAnswerResponse = await fetch(
      "http://localhost:5000/api/generate-final-answer",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subquery_outputs: subquery_outputs,
          prompt: userInput,
        }),
      }
    );

    if (!finalAnswerResponse.ok)
      throw new Error(
        "Error communicating with backend during final answer generation."
      );

    const finalAnswerData = await finalAnswerResponse.json();

    const { merged_context = "", final_answer = "" } = finalAnswerData;

    if (merged_context) {
      const { text } = merged_context; // Extract text from merged_context
      addMessage(`Context\n\n${JSON.stringify(text, null, 2)}`, "assistant");
    }

    addMessage("Final output 생성중...", "assistant", true); // Final output generation in progress

    if (final_answer) {
      const { text } = final_answer; // Extract text from final_answer
      addMessage(
        `Final output\n\n${JSON.stringify(text, null, 2)}`,
        "assistant"
      );
    }
  } catch (error) {
    addMessage(`Error: ${error.message}`, "assistant");
  }
}

// Streaming text effect : referenced the following JS file https://jsfiddle.net/47ebo2xk/

/**
 * Render each visible letter one at a time.
 * @param ele HTMLElement - The element to render
 * @param delay int - The delay between characters, in milliseconds
 * @param onEach Function - Callback to be called after each letter
 */
async function typeContent(ele, delay = 25, onEach = null) {
  if (!onEach) onEach = () => {};
  let container = document.createElement("div");
  let nodes = [...ele.childNodes];
  while (nodes.length) {
    container.appendChild(nodes.shift());
  }
  await (async function typeNodes(nodes, parent) {
    for (let i = 0; i < nodes.length; i++) {
      let node = nodes[i];
      if (node.nodeType === 3) {
        // Text
        for (let char of node.nodeValue) {
          parent.innerHTML += char;
          onEach();
          await new Promise((d) => setTimeout(d, delay));
        }
      } else if (node.nodeType === 1) {
        // Element
        let ele = document.createElement(node.tagName);
        if (node.hasAttributes()) {
          for (let attr of node.attributes) {
            ele.setAttribute(attr.name, attr.value);
          }
        }
        parent.appendChild(ele);
        onEach();
        if (node?.childNodes?.length) {
          await typeNodes(node.childNodes, ele);
        }
      }
    }
  })(container.childNodes, ele);
}

function addMessage(text, sender, isGenerating = false) {
  const chatWindow = document.getElementById("chat-window");
  const message = document.createElement("div");
  message.classList.add("message", sender);

  // If it's a "generating subqueries..." type message, use a different CSS class
  if (isGenerating) {
    message.classList.add("generating");
  }

  const bubble = document.createElement("div");
  bubble.classList.add("bubble");
  message.appendChild(bubble);
  chatWindow.appendChild(message);

  chatWindow.scrollTop = chatWindow.scrollHeight;

  // Streaming effect: Render text one character at a time
  const renderStreamingText = async () => {
    for (const char of text) {
      bubble.innerHTML += char === "\n" ? "<br>" : char;
      chatWindow.scrollTop = chatWindow.scrollHeight; // allow scrolling effect when the text is too long
      await new Promise((resolve) => setTimeout(resolve, 25));
    }
  };

  renderStreamingText().catch((err) =>
    console.error("Error in streaming effect:", err)
  );
}
