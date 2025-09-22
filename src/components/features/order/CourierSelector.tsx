'use client';

import React, { useState } from 'react';
import { GoChevronDown, GoPackage, GoCheck } from 'react-icons/go';
import { CourierCompany } from '@/types/shipment';
import rupiahFormater from '@/utils/rupiahFormater';

interface CourierSelectorProps {
  courierCompanies: CourierCompany[];
  selectedCompany: string | null;
  selectedService: string | null;
  onCompanySelect: (companyId: string) => void;
  onServiceSelect: (serviceId: string) => void;
  isLoading?: boolean;
}

const CourierSelector: React.FC<CourierSelectorProps> = ({
  courierCompanies,
  selectedCompany,
  selectedService,
  onCompanySelect,
  onServiceSelect,
  isLoading = false
}) => {
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);

  const selectedCompanyData = courierCompanies.find(company => company.id === selectedCompany);
  const selectedServiceData = selectedCompanyData?.services.find(service => service.id === selectedService);

  const handleCompanySelect = (companyId: string) => {
    onCompanySelect(companyId);
    onServiceSelect(''); // Reset service selection when company changes
    setIsCompanyDropdownOpen(false);
    setIsServiceDropdownOpen(false);
  };

  const handleServiceSelect = (serviceId: string) => {
    onServiceSelect(serviceId);
    setIsServiceDropdownOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Company Dropdown */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pilih Ekspedisi
        </label>
        <button
          type="button"
          onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
          disabled={isLoading}
          className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center space-x-3">
            <GoPackage className="w-5 h-5 text-gray-400" />
            <span className="text-gray-900">
              {selectedCompanyData ? selectedCompanyData.name : 'Pilih ekspedisi'}
            </span>
          </div>
          <GoChevronDown 
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isCompanyDropdownOpen ? 'rotate-180' : ''
            }`} 
          />
        </button>

        {/* Company Dropdown Options */}
        {isCompanyDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {courierCompanies.map((company) => (
              <button
                key={company.id}
                type="button"
                onClick={() => handleCompanySelect(company.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
              >
                <div className="flex items-center space-x-3">
                  <GoPackage className="w-5 h-5 text-gray-400" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{company.name}</p>
                    <p className="text-sm text-gray-500">
                      {company.services.length} layanan tersedia
                    </p>
                  </div>
                </div>
                {selectedCompany === company.id && (
                  <GoCheck className="w-5 h-5 text-primary" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Service Dropdown - Only show when company is selected */}
      {selectedCompany && selectedCompanyData && (
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pilih Layanan
          </label>
          <button
            type="button"
            onClick={() => setIsServiceDropdownOpen(!isServiceDropdownOpen)}
            disabled={isLoading}
            className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center space-x-3">
              <GoPackage className="w-5 h-5 text-gray-400" />
              <div className="text-left">
                <span className="text-gray-900">
                  {selectedServiceData ? selectedServiceData.serviceType : 'Pilih layanan'}
                </span>
                {selectedServiceData && (
                  <p className="text-sm text-gray-500">
                    {rupiahFormater(selectedServiceData.cost)} • {selectedServiceData.estimatedDelivery}
                  </p>
                )}
              </div>
            </div>
            <GoChevronDown 
              className={`w-5 h-5 text-gray-400 transition-transform ${
                isServiceDropdownOpen ? 'rotate-180' : ''
              }`} 
            />
          </button>

          {/* Service Dropdown Options */}
          {isServiceDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {selectedCompanyData.services.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => handleServiceSelect(service.id)}
                  className="w-full p-4 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-gray-900">{service.serviceType}</p>
                        <p className="text-lg font-semibold text-primary">
                          {rupiahFormater(service.cost)}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {service.estimatedDelivery}
                      </p>
                      <p className="text-xs text-gray-500">
                        {service.description}
                      </p>
                    </div>
                    {selectedService === service.id && (
                      <GoCheck className="w-5 h-5 text-primary ml-3 flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Selected Service Summary */}
      {selectedServiceData && (
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">
                {selectedCompanyData?.name} {selectedServiceData.serviceType}
              </p>
              <p className="text-sm text-gray-600">
                {selectedServiceData.estimatedDelivery}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-primary">
                {rupiahFormater(selectedServiceData.cost)}
              </p>
              <p className="text-xs text-gray-500">
                Berat: {selectedServiceData.weight}g
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourierSelector;
