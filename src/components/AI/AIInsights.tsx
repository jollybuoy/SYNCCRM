import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, AlertTriangle, Target, Lightbulb, Zap, ChevronRight } from 'lucide-react';
import Card from '../UI/Card';
import Badge from '../UI/Badge';

interface AIInsight {
  id: string;
  type: 'opportunity' | 'risk' | 'recommendation' | 'prediction';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  relatedTo?: string;
  data?: any;
}

const mockInsights: AIInsight[] = [
  {
    id: '1',
    type: 'opportunity',
    title: 'High-Value Prospect Identified',
    description: 'MIT has shown increased engagement patterns similar to your top 3 closed deals. Recommend immediate follow-up.',
    confidence: 92,
    impact: 'high',
    actionable: true,
    relatedTo: 'MIT Campus Grid Modernization',
    data: { potentialValue: 2800000, probability: 85 }
  },
  {
    id: '2',
    type: 'risk',
    title: 'Deal Stagnation Alert',
    description: 'Johns Hopkins opportunity has been in negotiation stage for 45 days. Historical data shows 73% chance of loss after 60 days.',
    confidence: 87,
    impact: 'high',
    actionable: true,
    relatedTo: 'Johns Hopkins Medical Equipment',
    data: { daysInStage: 45, riskScore: 73 }
  },
  {
    id: '3',
    type: 'recommendation',
    title: 'Optimal Contact Time',
    description: 'Based on engagement patterns, contacts at university accounts respond 3x better on Tuesday-Thursday, 10-11 AM.',
    confidence: 78,
    impact: 'medium',
    actionable: true,
    data: { bestDays: ['Tuesday', 'Wednesday', 'Thursday'], bestTime: '10-11 AM' }
  },
  {
    id: '4',
    type: 'prediction',
    title: 'Q2 Forecast Adjustment',
    description: 'AI model predicts 15% higher close rate for healthcare vertical based on recent market trends and your performance.',
    confidence: 84,
    impact: 'medium',
    actionable: false,
    data: { forecastIncrease: 15, vertical: 'healthcare' }
  }
];

export default function AIInsights() {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate AI processing
    const timer = setTimeout(() => {
      setInsights(mockInsights);
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity':
        return <Target className="h-5 w-5 text-green-600" />;
      case 'risk':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'recommendation':
        return <Lightbulb className="h-5 w-5 text-yellow-600" />;
      case 'prediction':
        return <TrendingUp className="h-5 w-5 text-blue-600" />;
      default:
        return <Brain className="h-5 w-5 text-purple-600" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity':
        return 'from-green-500 to-emerald-600';
      case 'risk':
        return 'from-red-500 to-rose-600';
      case 'recommendation':
        return 'from-yellow-500 to-amber-600';
      case 'prediction':
        return 'from-blue-500 to-indigo-600';
      default:
        return 'from-purple-500 to-violet-600';
    }
  };

  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-blue-600 animate-pulse" />
              <span className="text-lg font-medium text-gray-700">AI is analyzing your data...</span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">AI Insights</h2>
            <p className="text-sm text-gray-600">Powered by machine learning and predictive analytics</p>
          </div>
        </div>
        <Badge variant="info" size="md">
          <Zap className="h-3 w-3 mr-1" />
          Live Analysis
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group">
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${getInsightColor(insight.type)}`}></div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                      {getInsightIcon(insight.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {insight.title}
                      </h3>
                      <Badge variant={
                        insight.type === 'opportunity' ? 'success' :
                        insight.type === 'risk' ? 'error' :
                        insight.type === 'recommendation' ? 'warning' : 'info'
                      } size="sm">
                        {insight.type}
                      </Badge>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>

                <p className="text-gray-700 mb-4 leading-relaxed">
                  {insight.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="text-xs text-gray-500">Confidence</p>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full bg-gradient-to-r ${getInsightColor(insight.type)}`}
                            style={{ width: `${insight.confidence}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700">{insight.confidence}%</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500">Impact</p>
                      <Badge variant={
                        insight.impact === 'high' ? 'error' :
                        insight.impact === 'medium' ? 'warning' : 'neutral'
                      } size="sm">
                        {insight.impact}
                      </Badge>
                    </div>
                  </div>

                  {insight.actionable && (
                    <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                      Take Action
                    </button>
                  )}
                </div>

                {insight.relatedTo && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500">Related to:</p>
                    <p className="text-sm font-medium text-blue-600">{insight.relatedTo}</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}