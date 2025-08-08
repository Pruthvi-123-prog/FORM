import React, { useState, useEffect } from 'react';
import { ClozeQuestion as ClozeQuestionType, Answer } from '../../../types';

interface ClozeQuestionProps {
  question: ClozeQuestionType;
  onAnswerChange: (answer: Answer) => void;
  isPreview?: boolean;
}

const ClozeQuestion: React.FC<ClozeQuestionProps> = ({
  question,
  onAnswerChange,
  isPreview = false
}) => {
  const [blankAnswers, setBlankAnswers] = useState<{ [blankId: string]: string }>({});

  useEffect(() => {
    // Initialize blank answers
    const initialAnswers: { [blankId: string]: string } = {};
    question.blanks.forEach(blank => {
      initialAnswers[blank.id] = '';
    });
    setBlankAnswers(initialAnswers);
  }, [question]);

  const handleBlankChange = (blankId: string, value: string) => {
    if (isPreview) return;
    
    const newAnswers = {
      ...blankAnswers,
      [blankId]: value
    };
    setBlankAnswers(newAnswers);

    // Create answer object
    const answer: Answer = {
      questionId: question.id,
      questionType: 'cloze',
      blankAnswers: Object.entries(newAnswers).map(([blankId, answer]) => ({
        blankId,
        answer
      }))
    };

    onAnswerChange(answer);
  };

  const renderSentenceWithBlanks = () => {
    const parts = question.sentence.split('_____');
    const result: (string | JSX.Element)[] = [];

    parts.forEach((part, index) => {
      result.push(part);
      
      if (index < parts.length - 1 && index < question.blanks.length) {
        const blank = question.blanks[index];
        result.push(
          <input
            key={blank.id}
            type="text"
            value={blankAnswers[blank.id] || ''}
            onChange={(e) => handleBlankChange(blank.id, e.target.value)}
            placeholder={blank.placeholder}
            disabled={isPreview}
            className={`inline-block mx-1 px-3 py-1 border-b-2 border-blue-500 focus:outline-none focus:border-blue-700 bg-transparent text-center min-w-24 ${
              isPreview ? 'cursor-not-allowed bg-gray-100' : ''
            }`}
            style={{ width: `${Math.max(blank.placeholder.length, 8)}ch` }}
          />
        );
      }
    });

    return result;
  };

  return (
    <div className="p-6">
      {/* Question Title */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{question.title}</h3>
        {question.description && (
          <p className="text-gray-600 mb-4">{question.description}</p>
        )}
        {question.image && (
          <div className="mb-4">
            <img
              src={question.image}
              alt="Question"
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-blue-800 text-sm">
          <strong>Instructions:</strong> Fill in the blanks with the appropriate words or phrases.
        </p>
      </div>

      {/* Sentence with Blanks */}
      <div className="mb-6">
        <div className="text-lg leading-relaxed bg-white p-6 border border-gray-200 rounded-lg">
          {renderSentenceWithBlanks()}
        </div>
      </div>

      {/* Blank List (for reference) */}
      {question.blanks.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3">Fill in these blanks:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {question.blanks.map((blank, index) => (
              <div key={blank.id} className="flex items-center space-x-3">
                <span className="text-sm text-gray-500 font-mono">
                  Blank #{index + 1}:
                </span>
                <input
                  type="text"
                  value={blankAnswers[blank.id] || ''}
                  onChange={(e) => handleBlankChange(blank.id, e.target.value)}
                  placeholder={blank.placeholder}
                  disabled={isPreview}
                  className={`flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isPreview ? 'cursor-not-allowed bg-gray-100' : ''
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {isPreview && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            <strong>Preview Mode:</strong> In the actual form, users will be able to type in the text inputs.
          </p>
        </div>
      )}
    </div>
  );
};

export default ClozeQuestion;
