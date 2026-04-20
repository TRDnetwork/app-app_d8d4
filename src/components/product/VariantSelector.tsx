import React from 'react';

interface VariantSelectorProps {
  variants: { name: string; values: string[] }[];
  selected: Record<string, string>;
  onChange: (name: string, value: string) => void;
}

const VariantSelector: React.FC<VariantSelectorProps> = ({ variants, selected, onChange }) => {
  return (
    <div className="space-y-4">
      {variants.map((variant) => (
        <div key={variant.name}>
          <h4 className="font-medium mb-2">{variant.name}</h4>
          <div className="flex flex-wrap gap-2">
            {variant.values.map((value) => (
              <button
                key={value}
                className={`px-4 py-2 border rounded-md text-sm transition-colors ${
                  selected[variant.name] === value
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border hover:border-text'
                }`}
                onClick={() => onChange(variant.name, value)}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VariantSelector;