import { useState } from 'react'
import { Search, X, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export interface FilterState {
  search: string
  category: string
  description: string
  dateFrom: string
  dateTo: string
  amountOperator: 'gt' | 'lt' | 'eq' | ''
  amountValue: string
}

interface TransactionFiltersProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  categories: string[]
}

export default function TransactionFilters({
  filters,
  onFilterChange,
  categories,
}: TransactionFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const updateFilter = (key: keyof FilterState, value: string) => {
    onFilterChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onFilterChange({
      search: '',
      category: '',
      description: '',
      dateFrom: '',
      dateTo: '',
      amountOperator: '',
      amountValue: '',
    })
  }

  const hasActiveFilters = 
    filters.search ||
    filters.category ||
    filters.description ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.amountOperator ||
    filters.amountValue

  return (
    <div className="w-full">
      <AccordionItem value="filters" className="border-none">
        <AccordionTrigger
          isOpen={isOpen}
          onClick={(e) => {
            e.preventDefault()
            setIsOpen(!isOpen)
          }}
          className="w-full rounded-lg border bg-gray-50 px-4 py-3 hover:no-underline"
        >
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-600" />
              <span className="font-semibold text-gray-900">Search & Filters</span>
              {hasActiveFilters && (
                <span className="ml-2 rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                  {[
                    filters.search,
                    filters.category,
                    filters.description,
                    filters.dateFrom,
                    filters.dateTo,
                    filters.amountOperator && filters.amountValue,
                  ].filter(Boolean).length}
                </span>
              )}
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent isOpen={isOpen} className="px-0">
          <div className="mt-4 space-y-4 rounded-lg border bg-gray-50 p-4">
            {hasActiveFilters && (
              <div className="flex justify-end">
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="mr-1 h-4 w-4" />
                  Clear All
                </Button>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Search Bar */}
        <div className="md:col-span-2 lg:col-span-3">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              id="search"
              type="text"
              placeholder="Search by category, description..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            id="category"
            value={filters.category}
            onChange={(e) => updateFilter('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>
        </div>

        {/* Description Filter */}
        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            type="text"
            placeholder="Filter by description"
            value={filters.description}
            onChange={(e) => updateFilter('description', e.target.value)}
          />
        </div>

        {/* Date From */}
        <div>
          <Label htmlFor="dateFrom">Date From</Label>
          <Input
            id="dateFrom"
            type="date"
            value={filters.dateFrom}
            onChange={(e) => updateFilter('dateFrom', e.target.value)}
          />
        </div>

        {/* Date To */}
        <div>
          <Label htmlFor="dateTo">Date To</Label>
          <Input
            id="dateTo"
            type="date"
            value={filters.dateTo}
            onChange={(e) => updateFilter('dateTo', e.target.value)}
          />
        </div>

        {/* Amount Filter */}
        <div className="md:col-span-2">
          <Label>Amount</Label>
          <div className="flex gap-2">
            <Select
              value={filters.amountOperator}
              onChange={(e) => updateFilter('amountOperator', e.target.value)}
              className="flex-1"
            >
              <option value="">Select operator</option>
              <option value="gt">Greater Than (&gt;)</option>
              <option value="lt">Less Than (&lt;)</option>
              <option value="eq">Equal To (=)</option>
            </Select>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="Amount"
              value={filters.amountValue}
              onChange={(e) => updateFilter('amountValue', e.target.value)}
              className="flex-1"
              disabled={!filters.amountOperator}
            />
          </div>
        </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </div>
  )
}

