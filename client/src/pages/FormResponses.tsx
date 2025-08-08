import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Eye, Trash2, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Form, Response, FormAnalytics } from '../types';
import { formAPI, responseAPI } from '../utils/api';
import { formatDate, calculatePercentage, getScoreColor, getScoreLabel, exportToCSV, formatTime } from '../utils/helpers';

const FormResponses: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [analytics, setAnalytics] = useState<FormAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'responses' | 'analytics'>('responses');

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load form details
      const formResponse = await formAPI.getFormById(id!);
      setForm(formResponse.data);
      
      // Load responses
      const responsesResponse = await formAPI.getFormResponses(id!);
      setResponses(responsesResponse.data);
      
      // Load analytics
      const analyticsResponse = await responseAPI.getFormAnalytics(id!);
      setAnalytics(analyticsResponse.data);
      
    } catch (err: any) {
      console.error('Error loading data:', err);
      toast.error('Failed to load data');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResponse = async (responseId: string) => {
    if (!window.confirm('Are you sure you want to delete this response?')) {
      return;
    }

    try {
      await responseAPI.deleteResponse(responseId);
      setResponses(responses.filter(r => r._id !== responseId));
      toast.success('Response deleted successfully');
      
      // Reload analytics
      const analyticsResponse = await responseAPI.getFormAnalytics(id!);
      setAnalytics(analyticsResponse.data);
    } catch (err: any) {
      console.error('Error deleting response:', err);
      toast.error('Failed to delete response');
    }
  };

  const handleExportCSV = () => {
    if (responses.length === 0) {
      toast.error('No responses to export');
      return;
    }

    const csvData = responses.map(response => ({
      'Submission Date': formatDate(response.submittedAt!),
      'Score': `${response.score}/${response.maxScore}`,
      'Percentage': `${calculatePercentage(response.score, response.maxScore)}%`,
      'Completion Time': formatTime(response.completionTime),
      'User Agent': response.submitterInfo?.userAgent || 'N/A',
      'Answers Count': response.answers.length,
    }));

    exportToCSV(csvData, `${form?.title || 'form'}-responses-${Date.now()}.csv`);
    toast.success('Responses exported successfully');
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
          <Link to="/" className="text-blue-600 hover:underline">Go back to dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Form Responses</h1>
                <p className="text-sm text-gray-600">{form.title}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleExportCSV}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium inline-flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </button>
              
              <Link
                to={`/preview/${form._id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
              >
                <Eye className="h-4 w-4" />
                <span>View Form</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setSelectedTab('responses')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'responses'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Responses ({responses.length})
            </button>
            <button
              onClick={() => setSelectedTab('analytics')}
              className={`py-2 px-1 border-b-2 font-medium text-sm inline-flex items-center space-x-2 ${
                selectedTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {selectedTab === 'responses' ? (
          <div>
            {/* Responses List */}
            {responses.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No responses yet</h3>
                <p className="text-gray-600 mb-6">Share your form to start collecting responses</p>
                <Link
                  to={`/preview/${form._id}`}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Form
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Submitted
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time Taken
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {responses.map((response) => {
                        const percentage = calculatePercentage(response.score, response.maxScore);
                        return (
                          <tr key={response._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatDate(response.submittedAt!)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {response.score}/{response.maxScore}
                              </div>
                              <div className={`text-xs font-medium ${getScoreColor(percentage)}`}>
                                {percentage}% - {getScoreLabel(percentage)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatTime(response.completionTime)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                response.isComplete
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {response.isComplete ? 'Complete' : 'Incomplete'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => handleDeleteResponse(response._id!)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Analytics Tab
          <div>
            {analytics && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Responses */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <BarChart3 className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Responses
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {analytics.totalResponses}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>

                {/* Average Score */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-600 font-bold">%</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Average Score
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {analytics.averageScore.toFixed(1)}%
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>

                {/* Average Time */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                        <span className="text-yellow-600 font-bold">⏱</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Avg. Time
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {formatTime(Math.round(analytics.averageCompletionTime))}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>

                {/* Completion Rate */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-purple-600 font-bold">✓</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Questions
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {form.questions.length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Score Distribution */}
            {analytics && analytics.totalResponses > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Distribution</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-700">Excellent (90-100%)</span>
                    <span className="text-sm text-gray-900">{analytics.scoreDistribution.excellent}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-700">Good (70-89%)</span>
                    <span className="text-sm text-gray-900">{analytics.scoreDistribution.good}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-yellow-700">Average (50-69%)</span>
                    <span className="text-sm text-gray-900">{analytics.scoreDistribution.average}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-red-700">Poor (0-49%)</span>
                    <span className="text-sm text-gray-900">{analytics.scoreDistribution.poor}</span>
                  </div>
                </div>
              </div>
            )}

            {!analytics || analytics.totalResponses === 0 && (
              <div className="text-center py-12">
                <BarChart3 className="mx-auto h-24 w-24 text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No analytics data</h3>
                <p className="text-gray-600">Analytics will appear here once you have responses</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormResponses;
