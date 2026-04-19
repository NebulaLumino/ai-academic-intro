'use client';

import { useState } from 'react';

export default function AcademicIntroPage() {
  const [topic, setTopic] = useState('');
  const [field, setField] = useState('');
  const [documentType, setDocumentType] = useState('abstract');
  const [style, setStyle] = useState('academic');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setResult('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, field, documentType, style }),
      });
      const data = await res.json();
      setResult(data.result || data.error || 'An error occurred.');
    } catch {
      setResult('Failed to generate. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-gray-100 flex flex-col">
      <header className="border-b border-indigo-500/20 px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <span className="text-3xl">🎓</span>
          <div>
            <h1 className="text-xl font-bold text-indigo-400">Academic Paper Abstract & Introduction Writer</h1>
            <p className="text-xs text-gray-400">AI-powered academic writing assistant</p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 flex flex-col gap-8">
        <form onSubmit={handleSubmit} className="bg-gray-900/60 border border-indigo-500/20 rounded-2xl p-6 flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-indigo-300">Research Topic / Paper Title</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. The impact of AI on labor markets in developing nations"
                className="bg-gray-800 border border-indigo-500/30 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-indigo-300">Academic Field / Discipline</label>
              <input
                type="text"
                value={field}
                onChange={(e) => setField(e.target.value)}
                placeholder="e.g. Economics, Computer Science, Public Health"
                className="bg-gray-800 border border-indigo-500/30 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-indigo-300">Document Type</label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="bg-gray-800 border border-indigo-500/30 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="abstract">Abstract</option>
                <option value="introduction">Introduction</option>
                <option value="both">Abstract + Introduction</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-indigo-300">Writing Style</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="bg-gray-800 border border-indigo-500/30 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="formal">Formal Academic</option>
                <option value="semi-formal">Semi-Formal</option>
                <option value="scientific">Scientific / Empirical</option>
                <option value="humanities">Humanities / Interpretive</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? 'Drafting Academic Text…' : '📄 Generate Abstract & Introduction'}
          </button>
        </form>

        {result && (
          <div className="bg-gray-900/60 border border-indigo-500/20 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-indigo-300 mb-4 uppercase tracking-wider">Generated Document</h2>
            <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">{result}</div>
          </div>
        )}
      </main>
    </div>
  );
}
