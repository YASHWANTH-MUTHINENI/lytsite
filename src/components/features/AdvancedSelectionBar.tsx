import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Download, 
  Heart, 
  Share2, 
  ShoppingCart, 
  X, 
  CheckSquare,
  Square,
  Package
} from 'lucide-react';

interface AdvancedSelectionBarProps {
  selectedCount: number;
  totalCount: number;
  onDownloadSelected: () => void;
  onAddToFavorites: () => void;
  onCreatePackage: () => void;
  onClearSelection: () => void;
  onSelectAll: () => void;
  isAllSelected: boolean;
  className?: string;
}

export function AdvancedSelectionBar({
  selectedCount,
  totalCount,
  onDownloadSelected,
  onAddToFavorites,
  onCreatePackage,
  onClearSelection,
  onSelectAll,
  isAllSelected,
  className = ''
}: AdvancedSelectionBarProps) {
  if (selectedCount === 0) {
    return (
      <div className={`flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm ${className}`}>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm">
            {totalCount} Items
          </Badge>
          <span className="text-sm text-gray-600">
            Select items to access batch actions
          </span>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onSelectAll}
          className="flex items-center gap-2"
        >
          <CheckSquare className="w-4 h-4" />
          Select All
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-xl shadow-sm ${className}`}>
      {/* Left: Selection Info */}
      <div className="flex items-center gap-3">
        <Badge className="bg-blue-600 text-white">
          {selectedCount} Selected
        </Badge>
        <span className="text-sm text-gray-700">
          of {totalCount} items
        </span>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={isAllSelected ? onClearSelection : onSelectAll}
          className="text-blue-600 hover:text-blue-800"
        >
          <Square className="w-4 h-4 mr-1" />
          {isAllSelected ? 'Deselect All' : 'Select All'}
        </Button>
      </div>

      {/* Right: Batch Actions */}
      <div className="flex items-center gap-2">
        {/* Add to Favorites */}
        <Button
          variant="outline"
          size="sm"
          onClick={onAddToFavorites}
          className="flex items-center gap-2 hover:bg-red-50 hover:border-red-300"
        >
          <Heart className="w-4 h-4" />
          Add to Favorites
        </Button>

        {/* Create Package */}
        <Button
          variant="outline"
          size="sm"
          onClick={onCreatePackage}
          className="flex items-center gap-2 hover:bg-green-50 hover:border-green-300"
        >
          <Package className="w-4 h-4" />
          Create Package
        </Button>

        {/* Download Selected */}
        <Button
          size="sm"
          onClick={onDownloadSelected}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Download className="w-4 h-4" />
          Download ({selectedCount})
        </Button>

        {/* Clear Selection */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="text-gray-500 hover:text-gray-700 p-2"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}