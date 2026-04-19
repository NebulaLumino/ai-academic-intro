import { NextRequest, NextResponse } from 'next/server';

function getClient() {
  const OpenAI = require('openai');
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: 'https://api.deepseek.com/v1',
  });
}

export async function POST(req: NextRequest) {
  try {
    const { topic, field, documentType, style } = await req.json();
    if (!topic) return NextResponse.json({ error: 'Topic is required' }, { status: 400 });

    const client = getClient();

    const styleInstructions: Record<string, string> = {
      formal: 'Use formal academic register, complex sentence structures, precise terminology, and objective voice. Avoid first-person pronouns.',
      'semi-formal': 'Use semi-formal academic style with clear, accessible language. Minimal use of first person is acceptable.',
      scientific: 'Emphasize empirical methodology, quantitative framing, hypothesis-driven structure. Use passive voice or "this study" constructions.',
      humanities: 'Use interpretive, argumentative prose. Engage with theoretical frameworks, use first-person where appropriate for scholarly voice.',
    };

    const docInstructions: Record<string, string> = {
      abstract: 'Write a compelling academic abstract (~200-300 words) that covers: background/context, research question or gap, methodology, key findings, and contribution/implications. Make it self-contained.',
      introduction: 'Write a full academic introduction (~500-700 words) covering: the broad context and importance of the topic, a literature review establishing the gap, the specific research question or hypothesis, and an overview of the paper\'s structure.',
      both: 'Write both (1) an abstract (~200-300 words) and (2) an introduction (~500-700 words), clearly labeled. The abstract should stand alone; the introduction should provide full context.',
    };

    const systemPrompt = `You are an expert academic writer and researcher. Produce high-quality, publication-ready academic prose that follows disciplinary conventions. The writing should be rigorous, precise, well-argued, and free of filler. Use appropriate hedging and attribution conventions for the field.`;

    const userPrompt = `Write a ${documentType === 'both' ? 'an abstract and introduction' : documentType} for an academic paper.\n\nTopic: "${topic}"\nField/Discipline: ${field || 'General Academic'}\nWriting Style: ${styleInstructions[style] || styleInstructions.formal}\n\n${docInstructions[documentType] || docInstructions.both}\n\nEnsure the writing demonstrates deep engagement with the topic and follows ${field || 'general'} academic writing conventions.`;

    const completion = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.6,
    });

    return NextResponse.json({ result: completion.choices[0].message.content });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
