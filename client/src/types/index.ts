export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface CategorizeItem {
  id: string;
  text: string;
  correctCategory: string;
}

export interface Blank {
  id: string;
  position: number;
  correctAnswer: string;
  placeholder: string;
}

export interface SubQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'text' | 'true-false';
  options: string[];
  correctAnswer: string;
}

export interface BaseQuestion {
  id: string;
  type: 'categorize' | 'cloze' | 'comprehension';
  title: string;
  description?: string;
  image?: string;
  required: boolean;
}

export interface CategorizeQuestion extends BaseQuestion {
  type: 'categorize';
  categories: Category[];
  items: CategorizeItem[];
}

export interface ClozeQuestion extends BaseQuestion {
  type: 'cloze';
  sentence: string;
  blanks: Blank[];
}

export interface ComprehensionQuestion extends BaseQuestion {
  type: 'comprehension';
  passage: string;
  subQuestions: SubQuestion[];
}

export type Question = CategorizeQuestion | ClozeQuestion | ComprehensionQuestion;

export interface FormSettings {
  allowMultipleSubmissions: boolean;
  showProgressBar: boolean;
  thankYouMessage: string;
  redirectUrl: string;
}

export interface Form {
  _id?: string;
  title: string;
  description: string;
  headerImage?: string;
  questions: Question[];
  settings: FormSettings;
  isPublished: boolean;
  createdBy: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
  responseCount?: number;
}

// Response types
export interface CategorizedItem {
  itemId: string;
  categoryId: string;
}

export interface BlankAnswer {
  blankId: string;
  answer: string;
}

export interface SubAnswer {
  subQuestionId: string;
  answer: string;
}

export interface Answer {
  questionId: string;
  questionType: 'categorize' | 'cloze' | 'comprehension';
  categorizedItems?: CategorizedItem[];
  blankAnswers?: BlankAnswer[];
  subAnswers?: SubAnswer[];
}

export interface SubmitterInfo {
  userAgent: string;
  ipAddress: string;
  sessionId: string;
}

export interface Response {
  _id?: string;
  formId: string;
  formSlug: string;
  answers: Answer[];
  submittedAt?: string;
  submitterInfo?: SubmitterInfo;
  score: number;
  maxScore: number;
  completionTime: number;
  isComplete: boolean;
}

export interface FormAnalytics {
  totalResponses: number;
  averageScore: number;
  averageCompletionTime: number;
  responsesByDay: { [key: string]: number };
  scoreDistribution: {
    excellent: number;
    good: number;
    average: number;
    poor: number;
  };
}
