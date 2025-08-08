import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Share2, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import { Form } from '../types';
import { formAPI } from '../utils/api';
import { copyToClipboard } from '../utils/helpers';
import FormRenderer from '../components/Form/FormRenderer';

const FormPreview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);

  const loadForm = useCallback(async () => {
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
  }, [id, navigate]);

  useEffect(() => {
    if (id) {
      loadForm();
    }
  }, [id, loadForm]);

  const handleCopyLink = async () => {
    if (!form) return;
    
    const link = `${window.location.origin}/form/${form.slug}`;
    const success = await copyToClipboard(link);
    if (success) {
      toast.success('Form link copied to clipboard!');
    } else {
      toast.error('Failed to copy link');
    }
  };

  const handlePublishToggle = async () => {
    if (!form) return;

    try {
      await formAPI.publishForm(form._id!, !form.isPublished);
      setForm({ ...form, isPublished: !form.isPublished });
      toast.success(`Form ${!form.isPublished ? 'published' : 'unpublished'} successfully`);
    } catch (err: any) {
      console.error('Error updating form status:', err);
      toast.error('Failed to update form status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Form not found</h2>
          <p className="text-gray-600 mb-6">The form you're looking for doesn't exist.</p>
          <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Go to Dashboard
          </Link>
        </div>
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
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Form Preview</h1>
                <p className="text-sm text-gray-600">{form.title}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {form.isPublished && (
                <>
                  <button
                    onClick={handleCopyLink}
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium inline-flex items-center space-x-2"
                  >
                    <Copy className="h-4 w-4" />
                    <span>Copy Link</span>
                  </button>
                  
                  <Link
                    to={`/form/${form.slug}`}
                    target="_blank"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium inline-flex items-center space-x-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Open</span>
                  </Link>
                </>
              )}
              
              <button
                onClick={handlePublishToggle}
                className={`px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center space-x-2 ${
                  form.isPublished
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                <Share2 className="h-4 w-4" />
                <span>{form.isPublished ? 'Unpublish' : 'Publish'}</span>
              </button>
              
              <Link
                to={`/builder/${form._id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Form
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Form Preview */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!form.isPublished && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Form is in draft mode</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>This form is currently unpublished and can only be viewed by you. Publish it to make it available to others.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <FormRenderer form={form} isPreview={true} />
        </div>
      </div>
    </div>
  );
};

export default FormPreview;
