'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ChevronDown, Layers, Folder, FolderTree, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Category {
  categoryId: number;
  name: string;
  description?: string;
  level: number;
  childrenCount?: number;
  children?: Category[];
}

interface CategoryTreeProps {
  categories: Category[];
  className?: string;
}

export function CategoryTree({ 
  categories, 
  className = '' 
}: CategoryTreeProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const router = useRouter();

  const toggleExpanded = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleViewCategory = (categoryId: number, categoryName: string) => {
    const params = new URLSearchParams();
    params.set('category', categoryId.toString());
    params.set('categoryName', encodeURIComponent(categoryName));
    router.push(`/marketplace?${params.toString()}`);
  };

  const renderCategoryTree = (category: Category, level: number = 0) => {
    const isExpanded = expandedCategories.has(category.categoryId);
    const hasChildren = category.children && category.children.length > 0;
    
    return (
      <div key={category.categoryId} className="w-full group">
        {/* Parent Category */}
        <div className={`relative ${level > 0 ? 'ml-8' : ''}`}>
          {level > 0 && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-black"></div>
          )}
          
          <div className={`
            relative flex items-center gap-4 p-6 
            bg-white border-2 border-black
            hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
            hover:translate-x-[-2px] hover:translate-y-[-2px]
            transition-all duration-200 ease-out
            ${level === 0 ? 'mb-6' : 'mb-3'}
            ${level === 0 ? 'shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'}
          `}>
            {/* Expand/Collapse Button */}
            {hasChildren && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleExpanded(category.categoryId)}
                className="p-2 h-8 w-8 flex-shrink-0 border border-black bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-black" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-black" />
                )}
              </Button>
            )}
            
            {/* Category Icon */}
            <div className={`
              p-3 border-2 border-black flex-shrink-0
              ${level === 0 
                ? 'bg-red-900 text-white' 
                : level === 1 
                ? 'bg-black text-white'
                : 'bg-gray-800 text-white'
              }
            `}>
              {level === 0 ? (
                <FolderTree className="w-5 h-5" />
              ) : level === 1 ? (
                <Folder className="w-5 h-5" />
              ) : (
                <Layers className="w-5 h-5" />
              )}
            </div>
            
            {/* Category Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className={`
                  font-bold transition-colors duration-200 font-gothic
                  ${level === 0 
                    ? 'text-xl text-black group-hover:text-red-900' 
                    : level === 1 
                    ? 'text-lg text-gray-900 group-hover:text-black'
                    : 'text-base text-gray-800 group-hover:text-gray-900'
                  }
                `}>
                  {category.name.toUpperCase()}
                </h3>
                {hasChildren && (
                  <Badge className={`
                    px-2 py-1 text-xs font-metal border-2 border-black
                    ${level === 0 
                      ? 'bg-red-100 text-red-900' 
                      : level === 1 
                      ? 'bg-gray-100 text-black'
                      : 'bg-gray-50 text-gray-800'
                    }
                  `}>
                    {category.childrenCount} {category.childrenCount === 1 ? 'ITEM' : 'ITEMS'}
                  </Badge>
                )}
              </div>
              
              <p className="text-gray-700 text-sm leading-relaxed font-gothic">
                {category.description || `EXPLORE ${category.childrenCount || 0} SUBCATEGORIES IN THIS COLLECTION`}
              </p>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleViewCategory(category.categoryId, category.name)}
                className="
                  px-4 py-2 text-xs font-metal
                  border-2 border-black bg-white
                  hover:bg-black hover:text-white
                  transition-all duration-200 ease-out
                  group/btn
                "
              >
                <span className="flex items-center gap-1">
                  VIEW
                  <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform duration-200" />
                </span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Children Categories */}
        {hasChildren && isExpanded && category.children && (
          <div className="ml-8 border-l-2 border-black pl-6 space-y-3">
            {category.children.map((child: Category) => renderCategoryTree(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {categories.map((category) => renderCategoryTree(category))}
    </div>
  );
} 