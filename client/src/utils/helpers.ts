import { v4 as uuidv4 } from 'uuid';
import { Question, CategorizeQuestion, ClozeQuestion, ComprehensionQuestion } from '../types';

export const generateId = (): string => uuidv4();

export const createNewQuestion = (type: Question['type']): Question => {
  const baseQuestion = {
    id: generateId(),
    title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Question`,
    description: '',
    image: '',
    required: true,
  };

  switch (type) {
    case 'categorize':
      return {
        ...baseQuestion,
        type: 'categorize',
        categories: [
          { id: generateId(), name: 'Category 1', color: '#3b82f6' },
          { id: generateId(), name: 'Category 2', color: '#10b981' },
        ],
        items: [
          { id: generateId(), text: 'Item 1', correctCategory: '' },
          { id: generateId(), text: 'Item 2', correctCategory: '' },
        ],
      } as CategorizeQuestion;

    case 'cloze':
      return {
        ...baseQuestion,
        type: 'cloze',
        sentence: 'The _____ is shining brightly in the _____.',
        blanks: [
          { id: generateId(), position: 0, correctAnswer: 'sun', placeholder: 'celestial body' },
          { id: generateId(), position: 1, correctAnswer: 'sky', placeholder: 'location' },
        ],
      } as ClozeQuestion;

    case 'comprehension':
      return {
        ...baseQuestion,
        type: 'comprehension',
        passage: 'Insert your comprehension passage here. This should be a paragraph or text that students will read before answering the questions.',
        subQuestions: [
          {
            id: generateId(),
            question: 'What is the main idea of the passage?',
            type: 'text',
            options: [],
            correctAnswer: '',
          },
        ],
      } as ComprehensionQuestion;

    default:
      throw new Error(`Unknown question type: ${type}`);
  }
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

export const calculatePercentage = (score: number, maxScore: number): number => {
  if (maxScore === 0) return 0;
  return Math.round((score / maxScore) * 100);
};

export const getScoreColor = (percentage: number): string => {
  if (percentage >= 90) return 'text-green-600';
  if (percentage >= 70) return 'text-blue-600';
  if (percentage >= 50) return 'text-yellow-600';
  return 'text-red-600';
};

export const getScoreLabel = (percentage: number): string => {
  if (percentage >= 90) return 'Excellent';
  if (percentage >= 70) return 'Good';
  if (percentage >= 50) return 'Average';
  return 'Needs Improvement';
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text to clipboard:', err);
    return false;
  }
};

export const downloadAsJSON = (data: any, filename: string): void => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToCSV = (data: any[], filename: string): void => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes in CSV values
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
