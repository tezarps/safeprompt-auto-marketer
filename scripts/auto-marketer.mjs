// FILE: scripts/auto-marketer.mjs
const CUSTOM_API_KEY = "sk-gw-BiwqMbbLTcO4f6sB7eec63HrRkakIk2x5Du3oIL71Fk";
const DEVTO_API_KEY = "buPhbULU8HNAfj9UYrM4sYJM";
const RAPIDAPI_URL = "https://rapidapi.com/tezarps/api/safe-prompt-ai-firewall-and-pii-redactor";

const frameworks = [
  "Next.js App Router", "Python FastAPI", "Node.js Express", "LangChain.js",
  "Laravel PHP", "Go (Golang)", "Django REST Framework", "React & Vercel AI SDK",
  "NestJS", "Ruby on Rails", "Flask Python", "Cloudflare Workers"
];

const industries = [
  "Healthcare HIPAA Chatbots", "Fintech & Banking AI Assistants", "SaaS Customer Support Bots",
  "E-Commerce Order Assistants", "Legal Document Summarizers", "HR Resume Screening AI",
  "Internal Enterprise RAG Systems", "Multi-Tenant SaaS Applications",
  "Automated Email Triage Agents", "Voice-to-Text AI Pipelines", "EdTech Tutoring Bots", "Insurance Claim AI"
];

const angles = [
  "Preventing Prompt Injection & Jailbreaks",
  "Automated GDPR PII Redaction Before Calling OpenAI",
  "Stopping API Key & Credit Card Leaks in LLM Logs",
  "Building a Zero-Trust AI Input Firewall in 5 Minutes"
];

async function generateAndPublish() {
  const daySeed = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  const framework = frameworks[daySeed % frameworks.length];
  const industry = industries[(daySeed * 3) % industries.length];
  const angle = angles[(daySeed * 7) % angles.length];

  const topicPrompt = `
You are a Senior AI Security Engineer writing a highly practical, SEO-optimized technical tutorial for Dev.to.

Topic Angle: "${angle} in ${framework} for ${industry}"

Write a complete tutorial in Markdown format.
Requirements:
1. First line MUST be ONLY the article title (no '#' prefix, engaging, specific, max 75 chars).
2. Leave the second line blank, then write the full Markdown body starting from line 3.
3. Explain the real-world security risk (e.g., why raw user input sent to OpenAI/Claude causes PII data breaches or prompt injection jailbreaks).
4. Show a complete, copy-pasteable code example in ${framework} demonstrating how to sanitize user input BEFORE sending it to an LLM using the SafePrompt & PII Shield API on RapidAPI.
5. In the code example, use the endpoint: "https://ai-prompt-firewall-and-pii-data-redactor.p.rapidapi.com/sanitize" with headers "X-RapidAPI-Key" and JSON body { "text": userInput }.
6. Naturally include a helpful link to get the free API key here: ${RAPIDAPI_URL}
7. Make the article genuinely educational, including architecture best practices, error handling, and latency considerations. Do not sound like an ad; sound like a developer sharing a production solution.
`;

  console.log(`Generating article for: ${angle} | ${framework} | ${industry}...`);

  // Panggil Custom API nutaraline.co.uk
  const apiRes = await fetch(
    "https://nutaraline.co.uk/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${CUSTOM_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: topicPrompt }],
        temperature: 0.7
      })
    }
  );

  const apiData = await apiRes.json();
  const rawOutput = apiData?.choices?.[0]?.message?.content;

  if (!rawOutput) {
    throw new Error(`Failed to generate content from API: ${JSON.stringify(apiData)}`);
  }

  const lines = rawOutput.trim().split("\n");
  const cleanTitle = lines[0].replace(/^#+\s*/, "").replace(/^"|"$/g, "").trim();
  const markdownBody = lines.slice(1).join("\n").trim();

  // Publikasikan Otomatis ke Dev.to API
  console.log(`Publishing to Dev.to: "${cleanTitle}"...`);
  const devtoRes = await fetch("https://dev.to/api/articles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": DEVTO_API_KEY
    },
    body: JSON.stringify({
      article: {
        title: cleanTitle,
        published: true,
        body_markdown: markdownBody,
        tags: ["ai", "security", "webdev", "programming"]
      }
    })
  });

  if (!devtoRes.ok) {
    const errText = await devtoRes.text();
    throw new Error(`Dev.to API Error: ${errText}`);
  }

  const publishedArticle = await devtoRes.json();
  console.log(`SUCCESS! Article live at: ${publishedArticle.url}`);
}

generateAndPublish().catch((err) => {
  console.error(err);
  process.exit(1);
});
