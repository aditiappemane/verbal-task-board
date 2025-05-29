
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface EditableFieldProps {
  value: string;
  onSave: (value: string) => void;
  className?: string;
  placeholder?: string;
  type?: string;
  displayValue?: string;
  fieldType?: 'text' | 'date' | 'time' | 'priority';
  children?: React.ReactNode;
  disabled?: boolean;
}

const EditableField: React.FC<EditableFieldProps> = ({
  value,
  onSave,
  className = '',
  placeholder = '',
  type = 'text',
  displayValue,
  fieldType = 'text',
  children,
  disabled = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current && fieldType !== 'priority') {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing, fieldType]);

  const handleSave = () => {
    if (editValue.trim() !== value) {
      onSave(editValue.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  // If disabled, show as non-editable
  if (disabled) {
    if (children) {
      return (
        <span className={cn('opacity-60', className)}>
          {children}
        </span>
      );
    }
    return (
      <span className={cn('opacity-60', className)}>
        {displayValue || value || placeholder || 'Click to edit'}
      </span>
    );
  }

  if (isEditing) {
    if (fieldType === 'priority') {
      return (
        <Select value={editValue} onValueChange={(value) => { setEditValue(value); onSave(value); setIsEditing(false); }}>
          <SelectTrigger className="w-20 h-auto p-1 border-blue-300 focus:border-blue-500">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="P1">P1</SelectItem>
            <SelectItem value="P2">P2</SelectItem>
            <SelectItem value="P3">P3</SelectItem>
            <SelectItem value="P4">P4</SelectItem>
          </SelectContent>
        </Select>
      );
    }

    return (
      <Input
        ref={inputRef}
        type={type}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="min-w-0 h-auto p-1 border-blue-300 focus:border-blue-500"
        placeholder={placeholder}
      />
    );
  }

  // If children are provided (like Badge component), render them; otherwise show the default display
  if (children) {
    return (
      <span
        onClick={() => setIsEditing(true)}
        className={cn(
          'cursor-pointer hover:bg-gray-100 rounded px-1 py-0.5 transition-colors min-h-[1.5rem] inline-block',
          className
        )}
        title="Click to edit"
      >
        {children}
      </span>
    );
  }

  return (
    <span
      onClick={() => setIsEditing(true)}
      className={cn(
        'cursor-pointer hover:bg-gray-100 rounded px-1 py-0.5 transition-colors min-h-[1.5rem] inline-block',
        !value && 'text-gray-400 italic',
        className
      )}
      title="Click to edit"
    >
      {displayValue || value || placeholder || 'Click to edit'}
    </span>
  );
};

export default EditableField;
