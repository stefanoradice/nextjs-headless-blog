'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function Sidebar({ categories, tags }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategories, setSelectedCategories] = useState(
    searchParams.get('categories')?.split(',') || []
  );

  const [selectedTags, setSelectedTags] = useState(searchParams.get('tags')?.split(',') || []);

  const toggleValue = (value, setFunc, current) => {
    const newValues = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setFunc([...newValues]);
    return newValues;
  };

  const applyFilters = (cats, tags) => {
    const query = new URLSearchParams();
    if (cats.length) query.set('categories', cats.join(','));
    if (tags.length) query.set('tags', tags.join(','));
    router.push(`?${query.toString()}`);
  };

  return (
    <aside className="bg-gray-100 p-4 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Categorie</h3>
      <div className="flex flex-col gap-2">
        {categories.map((cat) => (
          <label key={cat.id} className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="accent-blue-600"
              checked={selectedCategories.includes(String(cat.id))}
              onChange={() => {
                const newCats = toggleValue(
                  String(cat.id),
                  setSelectedCategories,
                  selectedCategories
                );
                applyFilters(newCats, selectedTags);
              }}
            />
            <span>
              {cat.name} ({cat.count})
            </span>
          </label>
        ))}
      </div>

      <h3 className="text-lg font-semibold mt-6 mb-3">Tag</h3>
      <div className="flex flex-col gap-2">
        {tags.map((tag) => (
          <label key={tag.id} className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="accent-blue-600"
              checked={selectedTags.includes(String(tag.id))}
              onChange={() => {
                const newTags = toggleValue(String(tag.id), setSelectedTags, selectedTags);
                applyFilters(selectedCategories, newTags);
              }}
            />
            <span>
              {tag.name} ({tag.count})
            </span>
          </label>
        ))}
      </div>
    </aside>
  );
}
