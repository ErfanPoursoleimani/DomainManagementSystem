'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Domain, DomainFilters as FilterType } from '@/app/types/domain';
import { DomainFilters } from './components/domain-filters';
import { DomainTable } from './components/domain-table';
import DomainManipulator from './components/domain-manipulator';
import useDataStore from '@/app/stores/dataStore';
import useSettingStore from '@/app/stores/settingsStore';
import LanguageDropdown from './components/language-dropdown';

const initialFilters = {
    search: '',
    activeState: 'all',
    status: 'all'
}

export const DomainManagement: React.FC = () => {
    const { dict, domains, loading, error, deleteDomain, fetchDomains } = useDataStore();
    const { isRTL } = useSettingStore() 
    const [isManupulating, setIsManupulating] = useState<{isActive: boolean, purpose: "add" | "edit", domain?: Domain}>({isActive: false, purpose: "add"})

    const [filteredDomains, setFilteredDomains] = useState<Domain[]>(domains);

    const [filters, setFilters] = useState<FilterType>({
        search: '',
        activeState: 'all',
        status: 'all'
    });

    // convert status from 1, 2 and 3 to its corresponding status
    const convertStatus = (status: number): "Pending" | "Verified" | "Rejected" | null => {
        switch (status) {
            case 1:
                return "Pending"
        
            case 2:
                return "Verified"
        
            case 3:
                return "Rejected"
            default:
                return null
        }
    }
    
    // convert true and false to Atcive and Inactive
    const convertState = (state: boolean): "Active" | "Inactive" | null => {
        switch (state) {
            case true:
                return "Active"
        
            case false:
                return "Inactive"
        
            default:
                return null
        }
    }

    useEffect(() => {
        if(filters === initialFilters){
            setFilteredDomains(domains)
        } else {
            setFilteredDomains(
                domains.filter((domain) => {
                    return ( 
                        (filters.search === '' ? true : domain.domain.toLowerCase().includes(filters.search.toLowerCase())) 
                        && (filters.activeState === 'all' ? true : convertState(domain.isActive) === filters.activeState)
                        && (filters.status === 'all' ? true : convertStatus(domain.status) === filters.status)
                    )
                })
            )
        }
        
    }, [domains, filters]);

  const handleEdit = (domain: Domain) => {
    setIsManupulating({isActive: !(isManupulating.isActive), purpose: "edit", domain})
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this domain?')) {
      await deleteDomain(id);
      await fetchDomains()
    }
  };
  
  const handleAddDomain = () => {
    setIsManupulating({isActive: !(isManupulating.isActive), purpose: "add"})
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className={`mb-8 ${isRTL ? "text-end flex-row-reverse" : ""} flex items-center justify-between`}>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{dict.domains}</h1>
          <p className="mt-1 text-sm text-gray-500">CRUD + Search & Filter</p>
        </div>
        <LanguageDropdown />
      </div>

      <DomainFilters
        filters={filters}
        onFiltersChange={setFilters}
        onAddDomain={handleAddDomain}
      />

      <DomainTable
        domains={filteredDomains}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {isManupulating.isActive &&
        <DomainManipulator purpose={isManupulating.purpose} setIsManupulating={setIsManupulating} domain={isManupulating.domain}/>
      }
    </div>
  );
};