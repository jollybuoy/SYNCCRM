import React, { useState } from 'react';
import { Filter, Download, RefreshCw, Eye, Clock, CheckCircle, XCircle } from 'lucide-react';
import Card from '../UI/Card';
import Badge from '../UI/Badge';
import Table from '../UI/Table';
import { syncLogs } from '../../data/sampleData';
import { SyncLog } from '../../types';

interface SyncLogDrawerProps {
  log: SyncLog | null;
  isOpen: boolean;
  onClose: () => void;
}

function SyncLogDrawer({ log, isOpen, onClose }: SyncLogDrawerProps) {
  if (!isOpen || !log) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-1/2 bg-white shadow-xl z-50 overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Sync Log Details</h2>
            <p className="text-sm text-gray-600">{log.recordName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Timestamp</label>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(log.timestamp).toLocaleString()}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Manufacturer</label>
            <p className="mt-1 text-sm text-gray-900">{log.manufacturerName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Object Type</label>
            <p className="mt-1 text-sm text-gray-900 capitalize">{log.objectType}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Operation</label>
            <p className="mt-1 text-sm text-gray-900 capitalize">{log.operation}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <Badge variant={log.status === 'success' ? 'success' : 'error'}>
              {log.status}
            </Badge>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Duration</label>
            <p className="mt-1 text-sm text-gray-900">{log.duration}ms</p>
          </div>
        </div>

        {log.errorMessage && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Error Message</label>
            <div className="mt-1 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{log.errorMessage}</p>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Request Payload</label>
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="text-xs text-gray-600 overflow-x-auto">
              {JSON.stringify(log.payload || {
                recordId: log.recordName,
                operation: log.operation,
                timestamp: log.timestamp
              }, null, 2)}
            </pre>
          </div>
        </div>

        {log.status === 'failed' && (
          <div className="flex space-x-3">
            <button className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry Sync
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              View Error Tips
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SyncActivity() {
  const [selectedLog, setSelectedLog] = useState<SyncLog | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterManufacturer, setFilterManufacturer] = useState('all');

  const filteredLogs = syncLogs.filter(log => {
    if (filterStatus !== 'all' && log.status !== filterStatus) return false;
    if (filterManufacturer !== 'all' && log.manufacturerName !== filterManufacturer) return false;
    return true;
  });

  const handleRowClick = (log: SyncLog) => {
    setSelectedLog(log);
    setIsDrawerOpen(true);
  };

  const columns = [
    {
      key: 'timestamp',
      label: 'Timestamp',
      render: (value: string) => (
        <span className="text-sm text-gray-900">
          {new Date(value).toLocaleString()}
        </span>
      )
    },
    {
      key: 'manufacturerName',
      label: 'Manufacturer',
      render: (value: string) => <span className="text-gray-900">{value}</span>
    },
    {
      key: 'objectType',
      label: 'Object',
      render: (value: string) => (
        <Badge variant="neutral" size="sm">
          {value}
        </Badge>
      )
    },
    {
      key: 'recordName',
      label: 'Record',
      render: (value: string) => (
        <span className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
          {value}
        </span>
      )
    },
    {
      key: 'operation',
      label: 'Operation',
      render: (value: string) => (
        <span className="text-gray-900 capitalize">{value}</span>
      )
    },
    {
      key: 'duration',
      label: 'Duration',
      render: (value: number) => (
        <span className="text-gray-600 text-sm">{value}ms</span>
      )
    },
    {
      key: 'status',
      label: 'Result',
      render: (value: string, row: SyncLog) => (
        <div className="flex items-center">
          <Badge variant={value === 'success' ? 'success' : 'error'}>
            {value}
          </Badge>
          {row.errorMessage && (
            <button className="ml-2 p-1 hover:bg-gray-100 rounded">
              <Eye className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>
      )
    }
  ];

  const successCount = syncLogs.filter(log => log.status === 'success').length;
  const errorCount = syncLogs.filter(log => log.status === 'failed').length;
  const avgDuration = syncLogs.reduce((sum, log) => sum + log.duration, 0) / syncLogs.length;

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sync Activity</h1>
            <p className="text-gray-600 mt-1">Monitor all sync operations and troubleshoot issues</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Download className="mr-2 h-4 w-4" />
              Export Logs
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Successful</p>
                <p className="text-2xl font-bold text-gray-900">{successCount}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-gray-900">{errorCount}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Duration</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(avgDuration)}ms</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <RefreshCw className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Operations</p>
                <p className="text-2xl font-bold text-gray-900">{syncLogs.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Manufacturer
              </label>
              <select
                value={filterManufacturer}
                onChange={(e) => setFilterManufacturer(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Manufacturers</option>
                <option value="Tesla">Tesla</option>
                <option value="Toyota">Toyota</option>
                <option value="Ford">Ford</option>
              </select>
            </div>

            <div className="flex items-end">
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                <Filter className="mr-2 h-4 w-4" />
                Apply Filters
              </button>
            </div>
          </div>
        </Card>

        {/* Sync Logs Table */}
        <Card padding="sm">
          <Table
            columns={columns}
            data={filteredLogs}
            onRowClick={handleRowClick}
          />
        </Card>
      </div>

      {/* Sync Log Drawer */}
      <SyncLogDrawer
        log={selectedLog}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
}

// Add missing import
import { X } from 'lucide-react';