'use client';

import React from 'react';
import { Domain } from '@/app/types/domain';
import { Button } from './components/button';
import { StatusBadge } from './components/status-badge';

interface DomainTableProps {
  domains: Domain[];
  loading: boolean;
  onEdit: (domain: Domain) => void;
  onDelete: (id: string) => void;
}

export const DomainTable: React.FC<DomainTableProps> = ({
  domains,
  loading,
  onEdit,
  onDelete
}) => {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (domains.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No domains found.</p>
      </div>
    );
  }

  return (
    <div className="">
      <table className="min-w-full bg-white md:border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Domain
            </th>
            <th className="max-md:hidden px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="max-md:hidden px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Active
            </th>
            <th className="max-md:hidden px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th className="max-md:hidden px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {domains.map((domain) => (
            <tr key={domain.id} className="max-md:flex flex-col hover:bg-gray-50">
              <td className="px-3 py-4 whitespace-nowrap text-[0.9rem] font-medium text-gray-900">
                {domain.domain}
              </td>
              <td className="px-3 py-4 max-md:py-2 whitespace-nowrap">
                <StatusBadge status={domain.status === 1 ? "Pending" : domain.status === 2 ? "Verified" : "Rejected" } />
              </td>
              <td className="px-3 py-4 max-md:py-2 whitespace-nowrap">
                <span className={`text-sm ${domain.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                  {domain.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-3 py-4 max-md:py-2 whitespace-nowrap text-sm text-gray-500">
                {formatDate(domain.createdDate)}
              </td>
              <td className="px-3 py-4 max-md:py-2 whitespace-nowrap text-sm font-medium space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onEdit(domain)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(domain.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};