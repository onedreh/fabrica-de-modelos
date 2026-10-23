import React, { useState } from 'react';
import { FormSection as FormSectionType } from '../config/formSchema';
import { FieldRenderer } from './FieldRenderer';
import { ChevronDown, CheckCircle2 } from 'lucide-react';

interface FormSectionProps {
  section: FormSectionType;
  formValues: Record<string, any>;
  onFieldChange: (id: string, val: any) => void;
  defaultOpen?: boolean;
}

export const FormSection: React.FC<FormSectionProps> = ({
  section,
  formValues,
  onFieldChange,
  defaultOpen = false
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Calculate completion count
  const nonCheckboxFields = section.fields.filter(f => f.type !== 'checkbox');
  const filledCount = nonCheckboxFields.filter(f => {
    const val = formValues[f.id];
    return val !== undefined && val !== null && String(val).trim() !== '';
  }).length;

  const totalRequired = section.fields.filter(f => f.required).length;
  const isComplete = totalRequired > 0
    ? section.fields.filter(f => f.required).every(f => Boolean(formValues[f.id]))
    : filledCount > 0;

  return (
    <div className="border border-slate-800 bg-slate-900/60 rounded-xl overflow-hidden transition-all duration-200">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500"
        aria-expanded={isOpen}
      >
        <div className="space-y-0.5">
          <div className="flex items-center gap-2.5">
            <h3 className="font-semibold text-sm text-slate-100 flex items-center gap-2">
              {section.title}
            </h3>

            {isComplete && (
              <span className="flex items-center text-emerald-400 text-xs" title="Seção preenchida">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          {section.description && (
            <p className="text-xs text-slate-400 line-clamp-1">
              {section.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[11px] font-mono text-slate-500 tabular-nums">
            {filledCount}/{nonCheckboxFields.length}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="px-5 pb-5 pt-1 border-t border-slate-800/60 grid grid-cols-1 md:grid-cols-2 gap-4">
          {section.fields.map((field) => {
            const isFullWidth =
              field.type === 'textarea' ||
              field.id === 'product_name' ||
              ['aspect_ratio', 'framing', 'lighting', 'product_type'].includes(field.id);
            return (
              <div
                key={field.id}
                className={isFullWidth ? 'md:col-span-2' : 'col-span-1'}
              >
                <FieldRenderer
                  field={field}
                  value={formValues[field.id]}
                  onChange={onFieldChange}
                  formValues={formValues}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
