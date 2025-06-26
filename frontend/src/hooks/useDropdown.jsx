import { useState, useEffect, useMemo, useRef } from 'react';

export function useDropdown({
  value,
  onChange,
  options,
  disabled,
  initialOpen = false,
}) {
  const [open, setOpen] = useState(initialOpen);
  const [searchTerm, setSearchTerm] = useState(value || '');
  const [touched, setTouched] = useState(false);
  const dropdownRef = useRef(null);

  const dataList = useMemo(() => {
    const list = options || [];
    return list.filter((item) => {
      const label =
        typeof item === 'string' ? item : item.label || item.name || '';
      return label.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [searchTerm, options]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const selectItem = (item) => {
    const label = typeof item === 'string' ? item : item.label || item.name;
    setSearchTerm(label);
    onChange(item);
    setOpen(false);
    setTouched(false);
  };

  const onInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (!open) setOpen(true);
  };

  const onInputBlur = () => {
    setTimeout(() => {
      setOpen(false);
      if (!searchTerm.trim()) setTouched(true);
    }, 100);
  };

  return {
    open,
    setOpen,
    searchTerm,
    setSearchTerm,
    touched,
    setTouched,
    dataList,
    selectItem,
    onInputChange,
    onInputBlur,
    dropdownRef,
  };
}
