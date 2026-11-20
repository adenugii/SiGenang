'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

export interface CustomSelectOption {
  value: string | number
  label: string
  description?: string
}

interface CustomSelectProps {
  name?: string
  options: CustomSelectOption[]
  value?: string | number | null
  defaultValue?: string | number | null
  onChange?: (value: string | number) => void
  placeholder?: string
  required?: boolean
  className?: string
  disabled?: boolean
  accentColor?: 'blue' | 'teal'
}

export default function CustomSelect({
  name,
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  placeholder = '-- Pilih Opsi --',
  required = false,
  className = '',
  disabled = false,
  accentColor = 'blue',
}: CustomSelectProps) {
  const isControlled = controlledValue !== undefined
  const [internalValue, setInternalValue] = useState<string | number | ''>(
    defaultValue !== undefined && defaultValue !== null ? defaultValue : ''
  )
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const currentValue = isControlled ? controlledValue ?? '' : internalValue

  const selectedOption = options.find((opt) => String(opt.value) === String(currentValue))

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleSelect = (val: string | number) => {
    if (!isControlled) {
      setInternalValue(val)
    }
    onChange?.(val)
    setIsOpen(false)
  }

  const focusRingClass =
    accentColor === 'teal'
      ? 'focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600'
      : 'focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600'

  const selectedItemClass =
    accentColor === 'teal'
      ? 'bg-teal-50/80 text-teal-800 font-semibold'
      : 'bg-blue-50/80 text-blue-800 font-semibold'

  const checkColorClass = accentColor === 'teal' ? 'text-teal-600' : 'text-blue-600'

  return (
    <div ref={containerRef} className={`relative select-none ${className}`}>
      {/* Hidden input for form submissions */}
      {name && (
        <input
          type="hidden"
          name={name}
          value={currentValue}
          required={required && !currentValue}
        />
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full text-left bg-white border rounded-xl px-3.5 py-2.5 text-sm transition-all duration-150 flex items-center justify-between gap-2 shadow-xs cursor-pointer ${
          isOpen
            ? accentColor === 'teal'
              ? 'border-teal-600 ring-2 ring-teal-500/20'
              : 'border-blue-600 ring-2 ring-blue-500/20'
            : 'border-slate-300 hover:border-slate-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-50' : 'bg-slate-50/40 hover:bg-white'} ${focusRingClass}`}
      >
        <span className={`block truncate ${!selectedOption ? 'text-slate-400 font-normal' : 'text-slate-800 font-medium'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-slate-700' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu Modal/Popover */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden py-1.5 animate-in fade-in zoom-in-95 duration-150 max-h-64 overflow-y-auto">
          {placeholder && (
            <button
              type="button"
              onClick={() => handleSelect('')}
              className={`w-full text-left px-3.5 py-2.5 text-xs text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors flex items-center justify-between cursor-pointer border-b border-slate-100/80 mb-1`}
            >
              <span>{placeholder}</span>
              {currentValue === '' && <Check className="w-3.5 h-3.5 text-slate-400" />}
            </button>
          )}

          {options.map((opt) => {
            const isSelected = String(opt.value) === String(currentValue)
            return (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={`w-full text-left px-3.5 py-2 text-sm transition-colors flex items-center justify-between cursor-pointer rounded-lg mx-1 group ${
                  isSelected
                    ? selectedItemClass
                    : 'text-slate-700 hover:bg-slate-100/70 hover:text-slate-900'
                }`}
                style={{ width: 'calc(100% - 8px)' }}
              >
                <div className="truncate pr-2">
                  <div className="truncate font-medium">{opt.label}</div>
                  {opt.description && (
                    <div className="text-xs text-slate-500 font-normal truncate">
                      {opt.description}
                    </div>
                  )}
                </div>
                {isSelected && (
                  <Check className={`w-4 h-4 shrink-0 ${checkColorClass}`} />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
