import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Eye, Trash2, BarChart3, Copy, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { Form } from '../types';
import { formAPI } from '../utils/api';
import { formatDate, copyToClipboard } from '../utils/helpers';

const Dashboard: React.FC = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    try {
      setLoading(true);
      const response = await formAPI.getAllForms();
      setForms(response.data);
      setError(null);
    } catch (err: any) {
      console.error('Error loading forms:', err);
      setError('Failed to load forms');
      toast.error('Failed to load forms');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteForm = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await formAPI.deleteForm(id);
      setForms(forms.filter(form => form._id !== id));
      toast.success('Form deleted successfully');
    } catch (err: any) {
      console.error('Error deleting form:', err);
      toast.error('Failed to delete form');
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await formAPI.publishForm(id, !currentStatus);
      setForms(forms.map(form => 
        form._id === id ? { ...form, isPublished: !currentStatus } : form
      ));
      toast.success(`Form ${!currentStatus ? 'published' : 'unpublished'} successfully`);
    } catch (err: any) {
      console.error('Error updating form status:', err);
      toast.error('Failed to update form status');
    }
  };

  const handleCopyLink = async (slug: string) => {
    const link = `${window.location.origin}/form/${slug}`;
    const success = await copyToClipboard(link);
    if (success) {
      toast.success('Form link copied to clipboard!');
    } else {
      toast.error('Failed to copy link');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Forms</h1>
          <p className="text-gray-600 mt-2">Create and manage your custom forms</p>
        </div>
        <Link
          to="/builder"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Create New Form</span>
        </Link>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="text-red-700">{error}</div>
          <button
            onClick={loadForms}
            className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Forms Grid */}
      {!forms || forms.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Plus className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No forms yet</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first form</p>
          <Link
            to="/builder"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Create Your First Form</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms?.map((form) => (
            <div
              key={form._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              {/* Form Header Image */}
              {form.headerImage && (
                <div className="h-40 bg-gray-100 rounded-t-lg overflow-hidden">
                  <img
                    src={form.headerImage}
                    alt={form.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-6">
                {/* Form Title and Description */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {form.title}
                </h3>
                {form.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {form.description}
                  </p>
                )}

                {/* Form Stats */}
                <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>{form.questions?.length || 0} questions</span>
                    <span>{form.responseCount || 0} responses</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      form.isPublished 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {form.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>

                {/* Created Date */}
                <p className="text-xs text-gray-500 mb-4">
                  Created {form.createdAt ? formatDate(form.createdAt) : 'Recently'}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/builder/${form._id}`}
                    className="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors inline-flex items-center justify-center space-x-1"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </Link>
                  
                  <Link
                    to={`/preview/${form._id}`}
                    className="flex-1 bg-gray-50 text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors inline-flex items-center justify-center space-x-1"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Preview</span>
                  </Link>

                  {form.isPublished && form.slug && (
                    <>
                      <button
                        onClick={() => handleCopyLink(form.slug)}
                        className="flex-1 bg-green-50 text-green-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-green-100 transition-colors inline-flex items-center justify-center space-x-1"
                      >
                        <Copy className="h-4 w-4" />
                        <span>Copy Link</span>
                      </button>
                      
                      <Link
                        to={`/form/${form.slug}`}
                        target="_blank"
                        className="bg-purple-50 text-purple-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-100 transition-colors inline-flex items-center space-x-1"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </>
                  )}
                  
                  <Link
                    to={`/responses/${form._id}`}
                    className="bg-orange-50 text-orange-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-orange-100 transition-colors inline-flex items-center space-x-1"
                  >
                    <BarChart3 className="h-4 w-4" />
                  </Link>

                  <button
                    onClick={() => handleTogglePublish(form._id!, form.isPublished)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      form.isPublished
                        ? 'bg-red-50 text-red-700 hover:bg-red-100'
                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                    }`}
                  >
                    {form.isPublished ? 'Unpublish' : 'Publish'}
                  </button>

                  <button
                    onClick={() => handleDeleteForm(form._id!, form.title)}
                    className="bg-red-50 text-red-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-100 transition-colors inline-flex items-center space-x-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
