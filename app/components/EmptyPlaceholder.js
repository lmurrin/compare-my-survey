'use client'

import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/20/solid';

export default function EmptyPlaceholder({
  title = 'No items',
  description = 'Get started by creating a new item.',
  buttonText = 'Create New',
  href = null,
  onClick = null,
}) {
  const ButtonContent = (
    <>
      <PlusIcon aria-hidden="true" className="-ml-0.5 mr-1.5 size-5" />
      {buttonText}
    </>
  );

  return (
    <div className="text-center">
      <svg
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="mx-auto size-12 text-gray-400"
      >
        <path
          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <h3 className="mt-2 text-sm font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      <div className="mt-6">
        {href ? (
          <Link
            href={href}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {ButtonContent}
          </Link>
        ) : (
          <button
            type="button"
            onClick={onClick}
            className="cursor-pointer inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {ButtonContent}
          </button>
        )}
      </div>
    </div>
  );
}
