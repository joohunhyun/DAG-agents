async function processInput() {
  const userInput = document.getElementById("user-input").value.trim();

  if (!userInput) {
    alert("프롬프트를 입력하세요.");
    return;
  }

  // Display user's input
  addMessage(userInput, "user");

  // Show "Generating subqueries..." message
  addMessage("Subquery 생성중...", "assistant", true); // The third argument is for the new style

  // Clear the input field after user input is processed
  document.getElementById("user-input").value = "";

  // Send the user input to the backend for splitting and processing subqueries
  try {
    const splitResponse = await fetch("http://localhost:5000/api/split-query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: userInput }),
    });

    if (!splitResponse.ok)
      throw new Error("Error communicating with backend during split-query.");

    const splitData = await splitResponse.json();

    // Extract tasks (subqueries) and subquery outputs
    const { tasks = [], subquery_outputs = [] } = splitData;

    // Display each task (subquery)
    for (const task of tasks) {
      addMessage(task, "assistant");
    }

    addMessage("Context 생성중...", "assistant", true); // The third argument is for the new style

    // Save subquery outputs for fianl answer generation
    const subqueryOutputsString = JSON.stringify(subquery_outputs);

    // Send subquery outputs back to the backend for final answer generation
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

    // Extract merged context and final answer
    const { merged_context = "", final_answer = "" } = finalAnswerData;

    // Display the merged context for debugging
    if (merged_context) {
      const { text } = merged_context; // merged_context에서 text만 추출
      // Stringify the context
      addMessage(`Context\n\n${JSON.stringify(text, null, 2)}`, "assistant");
    }

    addMessage("Final output 생성중...", "assistant", true); // The third argument is for the new style

    // Display the final answer (optional, for debugging or user understanding)

    if (final_answer) {
      const { text } = final_answer; // final_answer에서 text만 추출
      // Stringify the merged context
      addMessage(
        `Final output\n\n${JSON.stringify(text, null, 2)}`,
        "assistant"
      );
    }
  } catch (error) {
    addMessage(`Error: ${error.message}`, "assistant");
  }
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

  // GPT returns output in Markdown format, so a markdown-to-HTML parser is required.
  // 25-1-22 : For future build, use markdown-it to parse markdown to HTML.
  const formattedText = text.replace(/\n/g, "<br>");

  bubble.classList.add("bubble");
  bubble.innerHTML = formattedText;

  message.appendChild(bubble);
  chatWindow.appendChild(message);

  // Scroll to the latest message
  chatWindow.scrollTop = chatWindow.scrollHeight;
}
