import * as webllm from "@mlc-ai/web-llm";

function setLabel(id: string, text: string) {
  const label = document.getElementById(id);
  if (label == null) {
    throw Error("Cannot find label " + id);
  }
  label.innerText = text;
}

async function main() {
  const initProgressCallback = (report: webllm.InitProgressReport) => {
    setLabel("init-label", report.text);
  };
  // Option 1: If we do not specify appConfig, we use `prebuiltAppConfig` defined in `config.ts`
  const selectedModel = "Llama-3.2-1B-Instruct-q4f32_1-MLC";
  const engine: webllm.MLCEngineInterface = await webllm.CreateMLCEngine(
    selectedModel,
    {
      initProgressCallback: initProgressCallback,
      logLevel: "INFO", // specify the log level
    },
    // customize kv cache, use either context_window_size or sliding_window_size (with attention sink)
    {
      context_window_size: 2048,
      // sliding_window_size: 1024,
      // attention_sink_size: 4,
    },
  );
  
// Define the chat prompt
const prompt = "List three US states.";
setLabel("prompt-label", prompt);

// Query the model
const reply0 = await engine.chat.completions.create({
  messages: [{ role: "user", content: prompt }],
  n: 1, // Number of responses to generate
  temperature: 1.0,
  max_tokens: 256,
});

// Display the response on the website
if (reply0.choices && reply0.choices.length > 0) {
  const responseText = reply0.choices[0].message?.content || "No response generated.";
  setLabel("generate-label", responseText);
} else {
  setLabel("generate-label", "No response generated.");
}

// Optionally log usage stats
console.log(reply0.usage);
}

main();
