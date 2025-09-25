'use client';

import React from 'react';
import { Input } from './components/input';
import { Select } from './components/select';
import { Button } from './components/button';
import { DomainFilters as FilterType } from '@/app/types/domain';

interface DomainFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
  onAddDomain: () => void;
}

export const DomainFilters: React.FC<DomainFiltersProps> = ({
  filters,
  onFiltersChange,
  onAddDomain
}) => {
  const activeStateOptions = [
    { value: 'all', label: 'All active states' },
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All statuses' },
    { value: 'Verified', label: 'Verified' },
    { value: 'Rejected', label: 'Rejected' },
    { value: 'Pending', label: 'Pending' }
  ];

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          <Input
            placeholder="Search by domain..."
            value={filters.search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFiltersChange({ ...filters, search: e.target.value })}
          />
          
          <Select
            options={activeStateOptions}
            value={filters.activeState}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onFiltersChange({ ...filters, activeState: e.target.value as "Active" | "Inactive" | "all" })}
          />
          
          <Select
            options={statusOptions}
            value={filters.status}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onFiltersChange({ ...filters, status: e.target.value as "Verified" | "Pending" | "Rejected" | "all" })}
          />
        </div>
        
        <Button onClick={onAddDomain} className="whitespace-nowrap">
          + Add Domain
        </Button>
      </div>
    </div>
  );
};
