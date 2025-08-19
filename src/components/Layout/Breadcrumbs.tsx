import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (items.length <= 1) return null;

  return (
    <nav className="px-6 py-3 border-b border-gray-200 bg-gray-50">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
            )}
            {item.href && index < items.length - 1 ? (
              <a
                href={item.href}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <span
                className={`text-sm ${
                  index === items.length - 1
                    ? 'text-gray-900 font-medium'
                    : 'text-gray-600'
                }`}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}