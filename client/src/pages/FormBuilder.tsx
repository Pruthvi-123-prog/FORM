import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Eye, ArrowLeft, Plus, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { Form, Question } from '../types';
import { formAPI } from '../utils/api';
import { generateId, createNewQuestion } from '../utils/helpers';
import QuestionEditor from '../components/FormBuilder/QuestionEditor';

const FormBuilder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<Form>({
    title: 'Untitled Form',
    description: '',
    headerImage: '',
    questions: [],
    settings: {
      allowMultipleSubmissions: false,
      showProgressBar: true,
      thankYouMessage: 'Thank you for your submission!',
      redirectUrl: '',
    },
    isPublished: false,
    createdBy: 'anonymous',
    slug: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      loadForm();
    }
  }, [id]);

  const loadForm = async () => {
    try {
      setLoading(true);
      const response = await formAPI.getFormById(id!);
      setForm(response.data);
    } catch (err: any) {
      console.error('Error loading form:', err);
      toast.error('Failed to load form');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Clean up form data before sending
      const cleanForm = {
        ...form,
        headerImage: form.headerImage?.trim() || '',
        description: form.description?.trim() || '',
        title: form.title?.trim() || 'Untitled Form'
      };
      
      if (id) {
        await formAPI.updateForm(id, cleanForm);
        toast.success('Form updated successfully');
      } else {
        const response = await formAPI.createForm(cleanForm);
        navigate(`/builder/${response.data._id}`);
        toast.success('Form created successfully');
      }
    } catch (err: any) {
      console.error('Error saving form:', err);
      console.error('Form data:', form);
      if (err.response?.data?.errors) {
        console.error('Validation errors:', err.response.data.errors);
        toast.error(`Validation error: ${err.response.data.errors[0]?.msg || 'Invalid form data'}`);
      } else {
        toast.error('Failed to save form');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleAddQuestion = (type: Question['type']) => {
    const newQuestion = createNewQuestion(type);
    setForm(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const handleUpdateQuestion = (questionId: string, updates: Partial<Question>) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? { ...q, ...updates } as Question : q
      )
    }));
  };

  const handleDeleteQuestion = (questionId: string) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  const handleHeaderImageUpload = (url: string) => {
    setForm(prev => ({ ...prev, headerImage: url }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-lg font-semibold text-gray-900">
                {id ? 'Edit Form' : 'Create New Form'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate(id ? `/preview/${id}` : '#')}
                disabled={!id}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium inline-flex items-center space-x-2 disabled:opacity-50"
              >
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </button>
              
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{saving ? 'Saving...' : 'Save'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Form Settings</h2>
          
          {/* Form Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Form Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter form title..."
            />
          </div>

          {/* Form Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Enter form description..."
            />
          </div>

          {/* Header Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Header Image URL
            </label>
            <div className="flex space-x-3">
              <input
                type="url"
                value={form.headerImage}
                onChange={(e) => setForm(prev => ({ ...prev, headerImage: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
              <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 inline-flex items-center space-x-2">
                <ImageIcon className="h-4 w-4" />
                <span>Upload</span>
              </button>
            </div>
            {form.headerImage && (
              <div className="mt-3">
                <img
                  src={form.headerImage}
                  alt="Header preview"
                  className="h-32 w-full object-cover rounded-md"
                />
              </div>
            )}
          </div>
        </div>

        {/* Questions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Questions ({form.questions.length})</h2>
            
            {/* Add Question Dropdown */}
            <div className="relative group">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Question</span>
              </button>
              
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                <div className="p-2">
                  <button
                    onClick={() => handleAddQuestion('categorize')}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-sm"
                  >
                    <strong>Categorize</strong>
                    <div className="text-xs text-gray-500">Drag items into categories</div>
                  </button>
                  <button
                    onClick={() => handleAddQuestion('cloze')}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-sm"
                  >
                    <strong>Cloze</strong>
                    <div className="text-xs text-gray-500">Fill in the blanks</div>
                  </button>
                  <button
                    onClick={() => handleAddQuestion('comprehension')}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-sm"
                  >
                    <strong>Comprehension</strong>
                    <div className="text-xs text-gray-500">Passage with questions</div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Question List */}
          {form.questions.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <Plus className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
              <p className="text-gray-600">Add your first question to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {form.questions.map((question, index) => (
                <QuestionEditor
                  key={question.id}
                  question={question}
                  index={index}
                  onUpdate={(updates) => handleUpdateQuestion(question.id, updates)}
                  onDelete={() => handleDeleteQuestion(question.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;
