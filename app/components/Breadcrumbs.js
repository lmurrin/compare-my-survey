'use client'

import { ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid'

export default function Breadcrumb({ pages = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex">
      <ol role="list" className="flex items-center space-x-4">
        <li>
          <div>
            <a href="/" className="text-gray-400 hover:text-gray-500 flex items-center">
              <HomeIcon aria-hidden="true" className="size-5 shrink-0" />
              <span className="sr-only">Home</span>
            </a>
          </div>
        </li>

        {pages.map((page, index) => (
          <li key={index}>
            <div className="flex items-center">
              <ChevronRightIcon aria-hidden="true" className="size-5 shrink-0 text-gray-400" />
              <a
                href={page.href}
                aria-current={page.current ? 'page' : undefined}
                className={`ml-4 text-sm font-semibold ${
                  page.current ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {page.name}
              </a>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}
