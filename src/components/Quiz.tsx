'use client';

import { useState } from 'react';
import type { Competency } from "@/lib/course-schema";
import { useLearningProgress } from "@/lib/learning-progress";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizProps {
  questions: Question[];
  quizId?: string;
  title?: string;
  competencies?: Competency[];
}

export default function Quiz({
  questions = [],
  quizId,
  title = "Knowledge Check",
  competencies = [],
}: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const { recordDrillResult } = useLearningProgress();

  if (!questions || questions.length === 0) {
    return null;
  }

  const handleOptionSelect = (index: number) => {
    if (isSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    
    setIsSubmitted(true);
    if (selectedOption === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      if (quizId) {
        recordDrillResult(quizId, {
          title,
          score,
          maxScore: questions.length,
          competencies,
        });
      }
      setShowResults(true);
    }
  };

  if (showResults) {
    return (
      <div className="my-8 p-8 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-center not-prose">
        <h3 className="text-2xl font-bold mb-4">{title} completed</h3>
        <p className="text-4xl font-mono font-bold text-blue-600 mb-4">
          {score} / {questions.length}
        </p>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">
          {score === questions.length 
            ? "Perfect! You've mastered this module's core concepts." 
            : "Good effort! Review the module content to strengthen your understanding."}
        </p>
        <button 
          onClick={() => {
            setCurrentQuestion(0);
            setSelectedOption(null);
            setIsSubmitted(false);
            setScore(0);
            setShowResults(false);
          }}
          className="px-6 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Restart Quiz
        </button>
      </div>
    );
  }

  const q = questions[currentQuestion];

  return (
    <div className="my-8 p-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl not-prose">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold uppercase tracking-wider text-zinc-500">{title}</h3>
        <span className="text-xs font-mono bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded">
          Question {currentQuestion + 1} of {questions.length}
        </span>
      </div>

      <p className="text-xl font-medium mb-6 text-zinc-900 dark:text-zinc-50">
        {q.question}
      </p>

      <div className="space-y-3 mb-8">
        {q.options.map((option, index) => {
          let variant = "border-zinc-300 dark:border-zinc-700 hover:border-blue-500";
          if (isSubmitted) {
            if (index === q.correctAnswer) variant = "border-green-500 bg-green-50 dark:bg-green-950/20";
            else if (index === selectedOption) variant = "border-red-500 bg-red-50 dark:bg-red-950/20";
            else variant = "opacity-50 border-zinc-200 dark:border-zinc-800";
          } else if (selectedOption === index) {
            variant = "border-blue-500 bg-blue-50 dark:bg-blue-950/20 ring-2 ring-blue-500/20";
          }

          return (
            <button
              key={index}
              onClick={() => handleOptionSelect(index)}
              disabled={isSubmitted}
              className={`w-full text-left p-4 border rounded-xl transition-all ${variant}`}
            >
              <div className="flex items-center gap-3">
                <span className="flex-none w-6 h-6 rounded-full border border-zinc-300 dark:border-zinc-600 flex items-center justify-center text-xs font-bold">
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
              </div>
            </button>
          );
        })}
      </div>

      {isSubmitted && (
        <div className={`mb-8 p-4 rounded-xl text-sm ${selectedOption === q.correctAnswer ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'}`}>
          <div className="font-bold mb-1">
            {selectedOption === q.correctAnswer ? '✓ Correct!' : '✗ Incorrect'}
          </div>
          {q.explanation}
        </div>
      )}

      <div className="flex justify-end">
        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        )}
      </div>
    </div>
  );
}
