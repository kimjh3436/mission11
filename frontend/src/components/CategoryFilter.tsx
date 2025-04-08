import { useState, useEffect } from 'react';

interface CategoryFilterProps {
    selectedCategories: string[];
    setSelectedCategories: (categories: string[]) => void;
}

// A reusable checkbox list for filtering books by category
function CategoryFilter({ selectedCategories, setSelectedCategories }: CategoryFilterProps) {
    const [categories, setCategories] = useState<string[]>([]); // Store all available categories

    // Fetch the category list from backend API on initial mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('https://localhost:7172/api/Books/GetBookCategories', {
                    credentials: 'include',
                });
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Unable to load categories:', error);
            }
        };

        fetchCategories();
    }, []);

    // Handle checkbox state changes
    const handleCategoryChange = ({ target }: { target: HTMLInputElement }) => {
        const updated = selectedCategories.includes(target.value)
            ? selectedCategories.filter((c) => c !== target.value)
            : [...selectedCategories, target.value];

        setSelectedCategories(updated);
    };

    return (
        <div className="card p-3 shadow-sm w-100">
            <h5 className="card-title mb-3 text-center text-nowrap">Book Categories</h5>
            <div className="list-group">
                {categories.map((category) => (
                    <div key={category} className="list-group-item d-flex align-items-center">
                        <input
                            type="checkbox"
                            className="form-check-input me-2"
                            id={category}
                            value={category}
                            onChange={handleCategoryChange}
                        />
                        <label className="form-check-label" htmlFor={category}>{category}</label>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CategoryFilter;
