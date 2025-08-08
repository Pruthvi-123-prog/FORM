import React, { useState } from 'react';
import { Form, Answer } from '../../types';
import CategorizeQuestion from './Questions/CategorizeQuestion';
import ClozeQuestion from './Questions/ClozeQuestion';
import ComprehensionQuestion from './Questions/ComprehensionQuestion';

interface FormRendererProps {
  form: Form;
  isPreview?: boolean;
  onSubmit?: (answers: Answer[]) => void;
}

const FormRenderer: React.FC<FormRendererProps> = ({ form, isPreview = false, onSubmit }) => {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleAnswerChange = (answer: Answer) => {
    setAnswers(prev => {
      const existingIndex = prev.findIndex(a => a.questionId === answer.questionId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = answer;
        return updated;
      }
      return [...prev, answer];
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(answers);
    }
  };

  const renderQuestion = (question: any, index: number) => {
    switch (question.type) {
      case 'categorize':
        return (
          <CategorizeQuestion
            key={question.id}
            question={question}
            onAnswerChange={handleAnswerChange}
            isPreview={isPreview}
          />
        );
      case 'cloze':
        return (
          <ClozeQuestion
            key={question.id}
            question={question}
            onAnswerChange={handleAnswerChange}
            isPreview={isPreview}
          />
        );
      case 'comprehension':
        return (
          <ComprehensionQuestion
            key={question.id}
            question={question}
            onAnswerChange={handleAnswerChange}
            isPreview={isPreview}
          />
        );
      default:
        return (
          <div key={question.id} className="p-6 bg-red-50 text-red-700">
            Unknown question type: {question.type}
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Form Header */}
      <div className="p-8 text-center">
        {form.headerImage && (
          <div className="mb-6">
            <img
              src={form.headerImage}
              alt={form.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{form.title}</h1>
        
        {form.description && (
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            {form.description}
          </p>
        )}

        {form.settings.showProgressBar && form.questions.length > 1 && !isPreview && (
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / form.questions.length) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Questions */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {isPreview ? (
          // Show all questions in preview mode
          form.questions.map((question, index) => (
            <div key={question.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">
                  Question {index + 1} of {form.questions.length}
                </h3>
              </div>
              {renderQuestion(question, index)}
            </div>
          ))
        ) : (
          // Show current question in fill mode
          form.questions.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-700">
                    Question {currentQuestion + 1} of {form.questions.length}
                  </h3>
                  {form.questions[currentQuestion].required && (
                    <span className="text-red-500 text-sm">Required</span>
                  )}
                </div>
              </div>
              {renderQuestion(form.questions[currentQuestion], currentQuestion)}
              
              {/* Navigation */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {currentQuestion < form.questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentQuestion(Math.min(form.questions.length - 1, currentQuestion + 1))}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                    disabled={isPreview}
                  >
                    {isPreview ? 'Preview Mode' : 'Submit'}
                  </button>
                )}
              </div>
            </div>
          )
        )}

        {/* Show all questions submit button in preview */}
        {isPreview && form.questions.length > 0 && (
          <div className="text-center py-8">
            <button
              type="button"
              disabled
              className="bg-gray-400 text-white px-8 py-3 rounded-lg cursor-not-allowed"
            >
              Preview Mode - Cannot Submit
            </button>
          </div>
        )}
      </form>

      {/* No questions message */}
      {form.questions.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No questions added yet</h3>
          <p className="text-gray-600">Add some questions to see them here</p>
        </div>
      )}
    </div>
  );
};

export default FormRenderer;
