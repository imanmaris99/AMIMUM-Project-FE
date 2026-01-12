'use client';

import React, { useState } from 'react';
import { GoLocation, GoCheck, GoPlus, GoX } from 'react-icons/go';

interface AddressInfo {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  isDefault?: boolean;
}

interface AddressSelectorProps {
  addresses: AddressInfo[];
  selectedAddress: AddressInfo | null;
  onAddressSelect: (address: AddressInfo) => void;
  onAddNew: () => void;
  onClose: () => void;
  isOpen: boolean;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({
  addresses,
  selectedAddress,
  onAddressSelect,
  onAddNew,
  onClose,
  isOpen
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredAddresses = addresses.filter(address =>
    address.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    address.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    address.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-sm max-h-[80vh] flex flex-col" style={{ maxWidth: '440px' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Pilih Alamat</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <GoX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            placeholder="Cari alamat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        {/* Address List */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredAddresses.length === 0 ? (
            <div className="text-center py-8">
              <GoLocation className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'Tidak ada alamat yang cocok' : 'Belum ada alamat tersimpan'}
              </p>
              <button
                onClick={onAddNew}
                className="text-primary font-medium hover:underline"
              >
                Tambah alamat baru
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAddresses.map((address) => (
                <div
                  key={address.id}
                  onClick={() => onAddressSelect(address)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedAddress?.id === address.id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <GoLocation className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-gray-900">{address.name}</p>
                        {address.isDefault && (
                          <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{address.phone}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {address.address}, {address.city} {address.postal_code}
                      </p>
                    </div>
                    {selectedAddress?.id === address.id && (
                      <GoCheck className="w-5 h-5 text-primary flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onAddNew}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 border-2 border-dashed border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors"
          >
            <GoPlus className="w-5 h-5" />
            <span className="font-medium">Tambah Alamat Baru</span>
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            Klik untuk menambah alamat pengiriman baru
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddressSelector;
