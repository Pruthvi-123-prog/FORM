import React, { useState, useEffect } from 'react';
import { ComprehensionQuestion as ComprehensionQuestionType, Answer } from '../../../types';

interface ComprehensionQuestionProps {
  question: ComprehensionQuestionType;
  onAnswerChange: (answer: Answer) => void;
  isPreview?: boolean;
}

const ComprehensionQuestion: React.FC<ComprehensionQuestionProps> = ({
  question,
  onAnswerChange,
  isPreview = false
}) => {
  const [subAnswers, setSubAnswers] = useState<{ [subQuestionId: string]: string }>({});

  useEffect(() => {
    // Initialize sub-question answers
    const initialAnswers: { [subQuestionId: string]: string } = {};
    question.subQuestions.forEach(sub => {
      initialAnswers[sub.id] = '';
    });
    setSubAnswers(initialAnswers);
  }, [question]);

  const handleSubAnswerChange = (subQuestionId: string, value: string) => {
    if (isPreview) return;
    
    const newAnswers = {
      ...subAnswers,
      [subQuestionId]: value
    };
    setSubAnswers(newAnswers);

    // Create answer object
    const answer: Answer = {
      questionId: question.id,
      questionType: 'comprehension',
      subAnswers: Object.entries(newAnswers).map(([subQuestionId, answer]) => ({
        subQuestionId,
        answer
      }))
    };

    onAnswerChange(answer);
  };

  const renderSubQuestion = (subQuestion: any, index: number) => {
    switch (subQuestion.type) {
      case 'multiple-choice':
        return (
          <div key={subQuestion.id} className="space-y-3">
            <h4 className="font-medium text-gray-900">
              {index + 1}. {subQuestion.question}
            </h4>
            <div className="space-y-2 ml-4">
              {subQuestion.options.map((option: string, optionIndex: number) => (
                <label key={optionIndex} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`sub-${subQuestion.id}`}
                    value={option}
                    checked={subAnswers[subQuestion.id] === option}
                    onChange={(e) => handleSubAnswerChange(subQuestion.id, e.target.value)}
                    disabled={isPreview}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="text-gray-700">{String.fromCharCode(65 + optionIndex)}. {option}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'true-false':
        return (
          <div key={subQuestion.id} className="space-y-3">
            <h4 className="font-medium text-gray-900">
              {index + 1}. {subQuestion.question}
            </h4>
            <div className="flex space-x-6 ml-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name={`sub-${subQuestion.id}`}
                  value="true"
                  checked={subAnswers[subQuestion.id] === 'true'}
                  onChange={(e) => handleSubAnswerChange(subQuestion.id, e.target.value)}
                  disabled={isPreview}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-gray-700">True</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name={`sub-${subQuestion.id}`}
                  value="false"
                  checked={subAnswers[subQuestion.id] === 'false'}
                  onChange={(e) => handleSubAnswerChange(subQuestion.id, e.target.value)}
                  disabled={isPreview}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-gray-700">False</span>
              </label>
            </div>
          </div>
        );

      case 'text':
      default:
        return (
          <div key={subQuestion.id} className="space-y-3">
            <h4 className="font-medium text-gray-900">
              {index + 1}. {subQuestion.question}
            </h4>
            <textarea
              value={subAnswers[subQuestion.id] || ''}
              onChange={(e) => handleSubAnswerChange(subQuestion.id, e.target.value)}
              placeholder="Enter your answer here..."
              disabled={isPreview}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ml-4 ${
                isPreview ? 'cursor-not-allowed bg-gray-100' : ''
              }`}
              rows={3}
            />
          </div>
        );
    }
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
          <strong>Instructions:</strong> Read the passage below carefully and answer the questions that follow.
        </p>
      </div>

      {/* Passage */}
      <div className="mb-8">
        <h4 className="font-semibold text-gray-900 mb-4">Reading Passage:</h4>
        <div className="bg-white p-6 border border-gray-200 rounded-lg">
          <div className="prose prose-gray max-w-none">
            {question.passage.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-800 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Sub-questions */}
      {question.subQuestions.length > 0 && (
        <div className="space-y-6">
          <h4 className="font-semibold text-gray-900 mb-4">Questions:</h4>
          {question.subQuestions.map((subQuestion, index) => (
            <div key={subQuestion.id} className="bg-gray-50 p-4 rounded-lg">
              {renderSubQuestion(subQuestion, index)}
            </div>
          ))}
        </div>
      )}

      {question.subQuestions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No questions have been added yet.</p>
        </div>
      )}

      {isPreview && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            <strong>Preview Mode:</strong> In the actual form, users will be able to select options and type answers.
          </p>
        </div>
      )}
    </div>
  );
};

export default ComprehensionQuestion;
