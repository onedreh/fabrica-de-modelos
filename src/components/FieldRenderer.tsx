import React, { useState, useEffect } from 'react';
import { FormField, FormFieldOption } from '../config/formSchema';
import { HelpCircle, Sparkles } from 'lucide-react';
import { VisualCardSelector } from './VisualCardSelector';

interface FieldRendererProps {
  field: FormField;
  value: any;
  onChange: (id: string, val: any) => void;
  formValues: Record<string, any>;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({
  field,
  value,
  onChange,
  formValues
}) => {
  // Check conditional visibility
  if (field.visible_if) {
    if (field.visible_if.includes('== true')) {
      const targetKey = field.visible_if.split('==')[0].trim();
      if (!formValues[targetKey]) return null;
    }
  }

  // Handle "Outro..." custom value state
  const isSelectWithOther = field.type === 'select' && field.allow_other;
  const standardOptions = field.options?.map(opt => (typeof opt === 'string' ? opt : opt.value)) || [];
  const isCustomValue = isSelectWithOther && value && !standardOptions.includes(value) && value !== '__outro__';

  const [selectedSelectValue, setSelectedSelectValue] = useState<string>(() => {
    if (isCustomValue) return '__outro__';
    return value !== undefined ? String(value) : (field.default !== undefined ? String(field.default) : '');
  });

  const [customText, setCustomText] = useState<string>(() => {
    return isCustomValue ? String(value) : '';
  });

  useEffect(() => {
    if (isSelectWithOther) {
      if (value && !standardOptions.includes(value)) {
        setSelectedSelectValue('__outro__');
        setCustomText(String(value));
      } else {
        setSelectedSelectValue(value !== undefined ? String(value) : '');
      }
    }
  }, [value, isSelectWithOther]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedSelectValue(val);
    if (val === '__outro__') {
      onChange(field.id, customText || 'Personalizado');
    } else {
      onChange(field.id, val);
    }
  };

  const handleCustomTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setCustomText(text);
    onChange(field.id, text);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={field.id} className="text-xs font-medium text-slate-200 flex items-center gap-1.5">
          {field.label}
          {field.required && <span className="text-rose-400 font-bold" title="Obrigatório">*</span>}
        </label>

        {field.help && (
          <span className="text-[11px] text-slate-400 flex items-center gap-1 cursor-help" title={field.help}>
            <HelpCircle className="w-3.5 h-3.5 text-slate-500 hover:text-slate-300" />
          </span>
        )}
      </div>

      {field.type === 'select' && (
        <div className="space-y-2.5">
          {['aspect_ratio', 'framing', 'lighting', 'product_type'].includes(field.id) && (
            <VisualCardSelector
              fieldId={field.id}
              value={String(value !== undefined ? value : (field.default !== undefined ? field.default : ''))}
              onChange={(val) => {
                setSelectedSelectValue(val);
                onChange(field.id, val);
              }}
              options={field.options || []}
            />
          )}

          <select
            id={field.id}
            value={selectedSelectValue}
            onChange={handleSelectChange}
            disabled={field.disabled}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {field.options?.map((opt) => {
              const optVal = typeof opt === 'string' ? opt : String(opt.value);
              const optLabel = typeof opt === 'string' ? opt : opt.label;
              const isDisabled = field.disabled_options?.includes(optVal);

              return (
                <option key={optVal} value={optVal} disabled={isDisabled}>
                  {optLabel}
                </option>
              );
            })}

            {field.allow_other && (
              <option value="__outro__">Outro... (especificar)</option>
            )}
          </select>

          {isSelectWithOther && selectedSelectValue === '__outro__' && (
            <input
              type="text"
              placeholder={`Especifique seu próprio valor para ${field.label.toLowerCase()}...`}
              value={customText}
              onChange={handleCustomTextChange}
              className="w-full bg-slate-900/90 border border-indigo-500/50 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
              autoFocus
            />
          )}
        </div>
      )}

      {field.type === 'text' && (
        <input
          type="text"
          id={field.id}
          value={value || ''}
          onChange={(e) => onChange(field.id, e.target.value)}
          placeholder={field.placeholder}
          disabled={field.disabled}
          className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:opacity-50"
        />
      )}

      {field.type === 'textarea' && (
        <textarea
          id={field.id}
          rows={3}
          value={value || ''}
          onChange={(e) => onChange(field.id, e.target.value)}
          placeholder={field.placeholder}
          disabled={field.disabled}
          className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-y disabled:opacity-50"
        />
      )}

      {field.type === 'checkbox' && (
        <label className="flex items-center gap-2.5 cursor-pointer pt-1">
          <input
            type="checkbox"
            id={field.id}
            checked={Boolean(value)}
            onChange={(e) => onChange(field.id, e.target.checked)}
            disabled={field.disabled}
            className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900 transition-colors"
          />
          <span className="text-xs text-slate-300 select-none">
            {field.help || field.label}
          </span>
        </label>
      )}
    </div>
  );
};
