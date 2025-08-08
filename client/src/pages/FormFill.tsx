import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Form, Answer } from '../types';
import { formAPI, responseAPI } from '../utils/api';
import { generateId } from '../utils/helpers';
import FormRenderer from '../components/Form/FormRenderer';

const FormFill: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    score: number;
    maxScore: number;
    thankYouMessage: string;
  } | null>(null);

  useEffect(() => {
    if (slug) {
      loadForm();
    }
  }, [slug]);

  const loadForm = async () => {
    try {
      setLoading(true);
      const response = await formAPI.getFormBySlug(slug!);
      setForm(response.data);
    } catch (err: any) {
      console.error('Error loading form:', err);
      if (err.response?.status === 404) {
        toast.error('Form not found or not published');
      } else {
        toast.error('Failed to load form');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (answers: Answer[]) => {
    if (!form || submitting) return;

    try {
      setSubmitting(true);
      
      const response = await responseAPI.submitResponse({
        formSlug: form.slug,
        answers,
        completionTime: 0, // You could track this with a timer
        sessionId: generateId()
      });

      setSubmissionResult({
        score: response.data.score,
        maxScore: response.data.maxScore,
        thankYouMessage: response.data.thankYouMessage
      });
      
      setSubmitted(true);
      toast.success('Form submitted successfully!');

      // Redirect if URL is provided
      if (form.settings.redirectUrl) {
        setTimeout(() => {
          window.location.href = form.settings.redirectUrl;
        }, 3000);
      }
    } catch (err: any) {
      console.error('Error submitting form:', err);
      toast.error('Failed to submit form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Form Not Found</h2>
          <p className="text-gray-600 mb-6">
            This form doesn't exist or is no longer available. Please check the URL or contact the form creator.
          </p>
        </div>
      </div>
    );
  }

  if (submitted && submissionResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="mb-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
              <p className="text-gray-600">{submissionResult.thankYouMessage}</p>
            </div>

            {/* Score Display */}
            {submissionResult.maxScore > 0 && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Your Score</h3>
                <div className="text-3xl font-bold text-blue-700">
                  {submissionResult.score}/{submissionResult.maxScore}
                </div>
                <div className="text-sm text-blue-600">
                  ({Math.round((submissionResult.score / submissionResult.maxScore) * 100)}%)
                </div>
              </div>
            )}

            {form.settings.redirectUrl && (
              <div className="text-sm text-gray-500">
                <p>You will be redirected in a few seconds...</p>
                <a
                  href={form.settings.redirectUrl}
                  className="text-blue-600 hover:underline"
                >
                  Click here if you're not redirected automatically
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {submitting && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Submitting your response...</p>
              </div>
            </div>
          )}
          
          <FormRenderer
            form={form}
            isPreview={false}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default FormFill;
