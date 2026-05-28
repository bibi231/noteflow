import OpenAI from 'openai';

let openai;
function getClient() {
    if (!openai) {
          if (!process.env.OPENAI_API_KEY) {
                  throw new Error('OPENAI_API_KEY is not configured. Add it in your environment variables.');
          }
          openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
    return openai;
}

export const summarizeMeeting = async (rawNotes) => {
    const response = await getClient().chat.completions.create({
          model: 'gpt-4o-mini',
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
          model: 'gpt-4o-mini',
          messages: [
            {
                      role: 'system',
                      content: 'Extract action items from meeting notes. Return a JSON array only: [{text, assignee (or "Unassigned"), priority: "low"|"medium"|"high", suggestedDueDate}]. Be precise. Only include real action items, not discussion points.',
            },
            { role: 'user', content: rawNotes },
                ],
          max_tokens: 1000,
          temperature: 0.1,
          response_format: { type: 'json_object' },
    });
    const parsed = JSON.parse(response.choices[0].message.content);
    return Array.isArray(parsed) ? parsed : parsed.items ?? parsed.actionItems ?? [];
};

    return Array.isArray(parsed) ? parsed : parsed.items ?? parsed.actionItems ?? [];
};
