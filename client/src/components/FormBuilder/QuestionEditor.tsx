import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2, Image as ImageIcon, Plus, X } from 'lucide-react';
import { Question, CategorizeQuestion, ClozeQuestion, ComprehensionQuestion } from '../../types';
import { generateId } from '../../utils/helpers';

interface QuestionEditorProps {
  question: Question;
  index: number;
  onUpdate: (updates: Partial<Question>) => void;
  onDelete: () => void;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  index,
  onUpdate,
  onDelete,
}) => {
  const [expanded, setExpanded] = useState(true);

  const handleBasicUpdate = (field: keyof Question, value: any) => {
    onUpdate({ [field]: value });
  };

  const renderCategorizeEditor = (q: CategorizeQuestion) => {
    const addCategory = () => {
      const newCategory = { id: generateId(), name: 'New Category', color: '#3b82f6' };
      onUpdate({ categories: [...q.categories, newCategory] });
    };

    const updateCategory = (categoryId: string, field: string, value: string) => {
      const updatedCategories = q.categories.map(cat =>
        cat.id === categoryId ? { ...cat, [field]: value } : cat
      );
      onUpdate({ categories: updatedCategories });
    };

    const deleteCategory = (categoryId: string) => {
      onUpdate({ categories: q.categories.filter(cat => cat.id !== categoryId) });
    };

    const addItem = () => {
      const newItem = { id: generateId(), text: 'New Item', correctCategory: '' };
      onUpdate({ items: [...q.items, newItem] });
    };

    const updateItem = (itemId: string, field: string, value: string) => {
      const updatedItems = q.items.map(item =>
        item.id === itemId ? { ...item, [field]: value } : item
      );
      onUpdate({ items: updatedItems });
    };

    const deleteItem = (itemId: string) => {
      onUpdate({ items: q.items.filter(item => item.id !== itemId) });
    };

    return (
      <div className="space-y-4">
        {/* Categories */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">Categories</label>
            <button
              onClick={addCategory}
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
            >
              <Plus className="h-4 w-4" />
              <span>Add Category</span>
            </button>
          </div>
          <div className="space-y-2">
            {q.categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-3">
                <input
                  type="color"
                  value={category.color}
                  onChange={(e) => updateCategory(category.id, 'color', e.target.value)}
                  className="w-8 h-8 rounded border"
                />
                <input
                  type="text"
                  value={category.name}
                  onChange={(e) => updateCategory(category.id, 'name', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Category name"
                />
                <button
                  onClick={() => deleteCategory(category.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Items */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">Items to Categorize</label>
            <button
              onClick={addItem}
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
            >
              <Plus className="h-4 w-4" />
              <span>Add Item</span>
            </button>
          </div>
          <div className="space-y-2">
            {q.items.map((item) => (
              <div key={item.id} className="flex items-center space-x-3">
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => updateItem(item.id, 'text', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Item text"
                />
                <select
                  value={item.correctCategory}
                  onChange={(e) => updateItem(item.id, 'correctCategory', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select category</option>
                  {q.categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderClozeEditor = (q: ClozeQuestion) => {
    const updateSentence = (value: string) => {
      onUpdate({ sentence: value });
    };

    const addBlank = () => {
      const newBlank = { id: generateId(), position: q.blanks.length, correctAnswer: '', placeholder: '' };
      onUpdate({ blanks: [...q.blanks, newBlank] });
    };

    const updateBlank = (blankId: string, field: string, value: string | number) => {
      const updatedBlanks = q.blanks.map(blank =>
        blank.id === blankId ? { ...blank, [field]: value } : blank
      );
      onUpdate({ blanks: updatedBlanks });
    };

    const deleteBlank = (blankId: string) => {
      onUpdate({ blanks: q.blanks.filter(blank => blank.id !== blankId) });
    };

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sentence (use _____ for blanks)
          </label>
          <textarea
            value={q.sentence}
            onChange={(e) => updateSentence(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="The _____ is shining brightly in the _____."
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">Blank Answers</label>
            <button
              onClick={addBlank}
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
            >
              <Plus className="h-4 w-4" />
              <span>Add Blank</span>
            </button>
          </div>
          <div className="space-y-2">
            {q.blanks.map((blank, index) => (
              <div key={blank.id} className="flex items-center space-x-3">
                <span className="text-sm text-gray-500 w-12">#{index + 1}</span>
                <input
                  type="text"
                  value={blank.correctAnswer}
                  onChange={(e) => updateBlank(blank.id, 'correctAnswer', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Correct answer"
                />
                <input
                  type="text"
                  value={blank.placeholder}
                  onChange={(e) => updateBlank(blank.id, 'placeholder', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Placeholder text"
                />
                <button
                  onClick={() => deleteBlank(blank.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderComprehensionEditor = (q: ComprehensionQuestion) => {
    const updatePassage = (value: string) => {
      onUpdate({ passage: value });
    };

    const addSubQuestion = () => {
      const newSubQuestion = {
        id: generateId(),
        question: '',
        type: 'text' as const,
        options: [],
        correctAnswer: ''
      };
      onUpdate({ subQuestions: [...q.subQuestions, newSubQuestion] });
    };

    const updateSubQuestion = (subId: string, field: string, value: any) => {
      const updatedSubQuestions = q.subQuestions.map(sub =>
        sub.id === subId ? { ...sub, [field]: value } : sub
      );
      onUpdate({ subQuestions: updatedSubQuestions });
    };

    const deleteSubQuestion = (subId: string) => {
      onUpdate({ subQuestions: q.subQuestions.filter(sub => sub.id !== subId) });
    };

    const addOption = (subId: string) => {
      const subQuestion = q.subQuestions.find(sub => sub.id === subId);
      if (subQuestion) {
        const newOptions = [...subQuestion.options, `Option ${subQuestion.options.length + 1}`];
        updateSubQuestion(subId, 'options', newOptions);
      }
    };

    const updateOption = (subId: string, optionIndex: number, value: string) => {
      const subQuestion = q.subQuestions.find(sub => sub.id === subId);
      if (subQuestion) {
        const newOptions = [...subQuestion.options];
        newOptions[optionIndex] = value;
        updateSubQuestion(subId, 'options', newOptions);
      }
    };

    const deleteOption = (subId: string, optionIndex: number) => {
      const subQuestion = q.subQuestions.find(sub => sub.id === subId);
      if (subQuestion) {
        const newOptions = subQuestion.options.filter((_, index) => index !== optionIndex);
        updateSubQuestion(subId, 'options', newOptions);
      }
    };

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Passage</label>
          <textarea
            value={q.passage}
            onChange={(e) => updatePassage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={6}
            placeholder="Enter the passage for students to read..."
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">Questions</label>
            <button
              onClick={addSubQuestion}
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
            >
              <Plus className="h-4 w-4" />
              <span>Add Question</span>
            </button>
          </div>
          
          <div className="space-y-4">
            {q.subQuestions.map((subQuestion, index) => (
              <div key={subQuestion.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm font-medium text-gray-700">Question {index + 1}</span>
                  <button
                    onClick={() => deleteSubQuestion(subQuestion.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  <input
                    type="text"
                    value={subQuestion.question}
                    onChange={(e) => updateSubQuestion(subQuestion.id, 'question', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter question..."
                  />
                  
                  <div className="flex items-center space-x-3">
                    <label className="text-sm text-gray-700">Type:</label>
                    <select
                      value={subQuestion.type}
                      onChange={(e) => updateSubQuestion(subQuestion.id, 'type', e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="text">Text Input</option>
                      <option value="multiple-choice">Multiple Choice</option>
                      <option value="true-false">True/False</option>
                    </select>
                  </div>

                  {subQuestion.type === 'multiple-choice' && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm text-gray-700">Options:</label>
                        <button
                          onClick={() => addOption(subQuestion.id)}
                          className="text-blue-600 hover:text-blue-800 text-xs flex items-center space-x-1"
                        >
                          <Plus className="h-3 w-3" />
                          <span>Add Option</span>
                        </button>
                      </div>
                      <div className="space-y-2">
                        {subQuestion.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">{String.fromCharCode(65 + optionIndex)}.</span>
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => updateOption(subQuestion.id, optionIndex, e.target.value)}
                              className="flex-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                              placeholder={`Option ${optionIndex + 1}`}
                            />
                            <button
                              onClick={() => deleteOption(subQuestion.id, optionIndex)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {subQuestion.type === 'true-false' && (
                    <div>
                      <label className="text-sm text-gray-700">Correct Answer:</label>
                      <select
                        value={subQuestion.correctAnswer}
                        onChange={(e) => updateSubQuestion(subQuestion.id, 'correctAnswer', e.target.value)}
                        className="ml-2 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select...</option>
                        <option value="true">True</option>
                        <option value="false">False</option>
                      </select>
                    </div>
                  )}

                  {(subQuestion.type === 'text' || subQuestion.type === 'multiple-choice') && (
                    <div>
                      <label className="text-sm text-gray-700">Correct Answer:</label>
                      <input
                        type="text"
                        value={subQuestion.correctAnswer}
                        onChange={(e) => updateSubQuestion(subQuestion.id, 'correctAnswer', e.target.value)}
                        className="ml-2 flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter correct answer..."
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderQuestionTypeEditor = () => {
    switch (question.type) {
      case 'categorize':
        return renderCategorizeEditor(question as CategorizeQuestion);
      case 'cloze':
        return renderClozeEditor(question as ClozeQuestion);
      case 'comprehension':
        return renderComprehensionEditor(question as ComprehensionQuestion);
      default:
        return <div>Unknown question type</div>;
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg bg-gray-50">
      {/* Question Header */}
      <div className="p-4 border-b border-gray-200 bg-white rounded-t-lg">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Question {index + 1}
              </span>
              <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full capitalize">
                {question.type}
              </span>
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-gray-400 hover:text-gray-600"
              >
                {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>
            
            <input
              type="text"
              value={question.title}
              onChange={(e) => handleBasicUpdate('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              placeholder="Question title..."
            />
          </div>
          
          <button
            onClick={onDelete}
            className="ml-4 text-red-600 hover:text-red-800"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Question Body */}
      {expanded && (
        <div className="p-4 space-y-4">
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={question.description}
              onChange={(e) => handleBasicUpdate('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              placeholder="Optional description or instructions..."
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Question Image URL</label>
            <div className="flex space-x-3">
              <input
                type="url"
                value={question.image}
                onChange={(e) => handleBasicUpdate('image', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
              <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 inline-flex items-center space-x-2">
                <ImageIcon className="h-4 w-4" />
                <span>Upload</span>
              </button>
            </div>
            {question.image && (
              <div className="mt-3">
                <img
                  src={question.image}
                  alt="Question preview"
                  className="h-32 w-full object-cover rounded-md"
                />
              </div>
            )}
          </div>

          {/* Required */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`required-${question.id}`}
              checked={question.required}
              onChange={(e) => handleBasicUpdate('required', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor={`required-${question.id}`} className="text-sm text-gray-700">
              Required question
            </label>
          </div>

          {/* Question Type Specific Editor */}
          {renderQuestionTypeEditor()}
        </div>
      )}
    </div>
  );
};

export default QuestionEditor;
