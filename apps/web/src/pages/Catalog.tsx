import React, { useState } from 'react';

export default function Catalog() {
  const [search, setSearch] = useState('');
  
  const plants = [
    { id: 1, botanical: 'Acer rubrum', common: 'Red Maple', size: 15, price: 125, stock: 8 },
    { id: 2, botanical: 'Hydrangea macrophylla', common: 'Bigleaf Hydrangea', size: 3, price: 35, stock: 24 },
    { id: 3, botanical: 'Ilex crenata', common: 'Japanese Holly', size: 7, price: 45, stock: 15 },
    { id: 4, botanical: 'Lagerstroemia indica', common: 'Crape Myrtle', size: 10, price: 85, stock: 12 },
    { id: 5, botanical: 'Nandina domestica', common: 'Heavenly Bamboo', size: 3, price: 28, stock: 30 },
    { id: 6, botanical: 'Prunus laurocerasus', common: 'Cherry Laurel', size: 7, price: 52, stock: 18 },
  ];

  const filtered = plants.filter(p =>
    p.botanical.toLowerCase().includes(search.toLowerCase()) ||
    p.common.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Plant Catalog</h1>
        <p className="text-gray-500 mt-1">Browse and manage your plant inventory</p>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search plants by botanical or common name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-greenline-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((plant) => (
          <div key={plant.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gradient-to-br from-greenline-100 to-greenline-200 flex items-center justify-center">
              <span className="text-6xl">🌿</span>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{plant.botanical}</h3>
              <p className="text-sm text-gray-500 mb-4">{plant.common}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Container Size:</span>
                  <span className="font-medium text-gray-900">{plant.size} gal</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium text-greenline-700">${plant.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">In Stock:</span>
                  <span className={`font-medium ${plant.stock > 10 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {plant.stock} units
                  </span>
                </div>
              </div>

              <button className="w-full px-4 py-2 bg-greenline-600 text-white rounded-lg hover:bg-greenline-700 transition-colors">
                Add to Estimate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
