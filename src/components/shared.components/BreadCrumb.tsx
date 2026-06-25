'use client';

import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { Fragment } from 'react';

export interface BreadcrumbItem {
  id: string;
  title: string;
  icon?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1 text-sm">
      {/* Home */}
      <Link
        href="/vault"
        className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
      >
        <Home size={16} />
        <span>Home</span>
      </Link>

      {/* Breadcrumb items */}
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const href = `/vault/${item.id}`;

        return (
          <Fragment key={item.id}>
            <ChevronRight size={16} className="text-muted-foreground" />
            {isLast ? (
              <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-accent text-foreground font-medium">
                {item.icon && <span>{item.icon}</span>}
                {item.title}
              </span>
            ) : (
              <Link
                href={href}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                {item.icon && <span>{item.icon}</span>}
                {item.title}
              </Link>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}