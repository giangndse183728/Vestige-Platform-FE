'use client';

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

interface PageSizeSelectorProps {
  currentPageSize: number;
  onPageSizeChange: (size: number) => void;
  options?: number[];
  className?: string;
}

const PageSizeSelector: React.FC<PageSizeSelectorProps> = ({
  currentPageSize,
  onPageSizeChange,
  options = [12, 24, 48, 96],
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-gray-600 font-gothic">Show:</span>
      <Select
        value={currentPageSize.toString()}
        onValueChange={(value) => onPageSizeChange(parseInt(value))}
      >
        <SelectTrigger className="w-16 h-8 text-sm border-2 border-gray-300">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((size) => (
            <SelectItem key={size} value={size.toString()}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-sm text-gray-600 font-gothic">per page</span>
    </div>
  );
};

export default PageSizeSelector; 