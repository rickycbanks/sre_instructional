'use client';

import { useState } from 'react';
import { practicePrompts } from "@/lib/drills";

export default function PracticeSandbox() {
  const [activeTab, setActiveTab] = useState<(typeof practicePrompts)[number]["category"]>('Systems Design');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const filteredChallenges = practicePrompts.filter(c => c.category === activeTab);

  return (
    <div className="my-12 p-8 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl not-prose shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">SRE Practice Sandbox</h2>
          <p className="text-zinc-500 text-sm mt-1">Practice real-world SRE scenarios and architectural challenges.</p>
        </div>
        <div className="flex bg-zinc-200 dark:bg-zinc-800 p-1 rounded-xl">
          {(['Systems Design', 'Troubleshooting', 'Behavioral'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setExpandedIndex(null);
              }}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === tab 
                  ? 'bg-white dark:bg-zinc-700 text-blue-600 shadow-sm' 
                  : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredChallenges.map((challenge, index) => (
          <div 
            key={index}
            className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black rounded-2xl overflow-hidden transition-all"
          >
            <button 
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              className="w-full p-6 text-left flex justify-between items-center group"
            >
              <div>
                <h4 className="font-bold text-lg group-hover:text-blue-600 transition-colors">{challenge.title}</h4>
                <p className="text-sm text-zinc-500 line-clamp-1">{challenge.prompt}</p>
              </div>
              <span className={`text-2xl transition-transform ${expandedIndex === index ? 'rotate-180' : ''}`}>
                ↓
              </span>
            </button>

            {expandedIndex === index && (
              <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-300">
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900">
                  <p className="text-zinc-700 dark:text-zinc-300 mb-6 leading-relaxed">
                    {challenge.prompt}
                  </p>
                  
                  <div className="mb-6">
                    <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Hints</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm text-zinc-500">
                      {challenge.hints.map((hint, i) => (
                        <li key={i}>{hint}</li>
                      ))}
                    </ul>
                  </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl">
                      <h5 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Strong answer signals</h5>
                      <ul className="space-y-2 text-sm text-zinc-800 dark:text-zinc-200">
                        {challenge.strongAnswer.map((item) => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
