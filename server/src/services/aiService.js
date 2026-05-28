import OpenAI from 'openai';

let client;
function getClient() {
  if (!client) {
    const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('No AI API key configured. Set GROQ_API_KEY or OPENAI_API_KEY.');
    }
    const baseURL = process.env.GROQ_API_KEY
      ? 'https://api.groq.com/openai/v1'
      : undefined;
    client = new OpenAI({ apiKey, baseURL });
  }
  return client;
}

function getModel() {
  return process.env.GROQ_API_KEY ? 'llama-3.1-8b-instant' : 'gpt-4o-mini';
}

export const summarizeMeeting = async (rawNotes) => {
  const response = await getClient().chat.completions.create({
    model: getModel(),
    messages: [
      {
        role: 'system',
        content: 'You are a meeting summarizer. Output a concise 3-5 bullet summary capturing key decisions, discussion points, and outcomes. No fluff.',
      },
      { role: 'user', content: rawNotes },
    ],
    max_tokens: 500,
    temperature: 0.3,
  });
  return response.choices[0].message.content;
};

export const extractActionItems = async (rawNotes) => {
  const response = await getClient().chat.completions.create({
    model: getModel(),
    messages: [
      {
        role: 'system',
        content: 'Extract action items from meeting notes. Return a JSON array only: [{text, assignee (or "Unassigned"), priority: "low"|"medium"|"high", suggestedDueDate}]. Be precise. Only include real action items, not discussion points.',
      },
      { role: 'user', content: rawNotes },
    ],
    max_tokens: 1000,
    temperature: 0.1,
  });
  const parsed = JSON.parse(response.choices[0].message.content);
  return Array.isArray(parsed) ? parsed : parsed.items ?? parsed.actionItems ?? [];
};
