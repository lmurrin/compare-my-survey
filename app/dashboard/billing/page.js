"use client";

import DashboardHeading from '@/app/components/dashboard/DashboardHeading';
import { CheckIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';


const pricing = {
    frequencies: [
      { value: 'monthly', label: 'Monthly', priceSuffix: '/month' },
      { value: 'annually', label: 'Annually', priceSuffix: '/year' },
    ],
    tiers: [
      {
        name: '£110 of credit',
        id: 'tier-basic',
        href: '#',
        price: { monthly: '£100', annually: '$299' },
        saving: "Get £10 free",
        description: 'The essentials to provide your best work for clients.',
        features: ['Get £10 free credit',
          'Receive 15 - 30 leads'],
        mostPopular: false,
      },
      {
        name: '£280 of credit',
        id: 'tier-medium',
        href: '#',
        price: { monthly: '£250', annually: '$299' },
        saving: "Get £30 free",
        description: 'A plan that scales with your rapidly growing business.',
        features: [
          'Get £30 free credit',
          'Receive 30 - 95 leads',

        ],
        mostPopular: false,
      },
      {
        name: '£570 of credit',
        id: 'tier-high',
        href: '#',
        price: { monthly: '£500', annually: '$299' },
        saving: "(£70 free)",
        description: 'A plan that scales with your rapidly growing business.',
        features: [
          'Get £70 free credit',
          'Receive 65 - 190 leads',
          'Most popular',
        ],
        mostPopular: true,
      },
      {
        name: '£1,150 of credit',
        id: 'tier-super',
        href: '#',
        price: { monthly: '£1,000', annually: '$299' },
        saving: "(£150 free)",
        description: 'Dedicated support and infrastructure for your company.',
        features: [
          'Get £150 free credit',
          'Receive 125 - 385 leads',
          'Best value',
        ],
        mostPopular: false,
      },
    ],
  }

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

export default function Billing() {

    const [frequency, setFrequency] = useState(pricing.frequencies[0])

    return (
<>
    <DashboardHeading
        title="Billing"
        description="Top up your account balance, and view past payments."
        showEditButton={false}
        showPublishButton={false}
      />

    <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 md:max-w-2xl md:grid-cols-2 lg:max-w-4xl xl:mx-0 xl:max-w-none xl:grid-cols-4">
            {pricing.tiers.map((tier) => (
              <div
                key={tier.id}
                className={classNames(
                  tier.mostPopular ? 'ring-2 ring-indigo-600' : 'ring-1 ring-gray-200',
                  'rounded-3xl p-8',
                )}
              >
                <h2
                  id={tier.id}
                  className={classNames(
                    tier.mostPopular ? 'text-indigo-600' : 'text-gray-900',
                    'text-lg/8 font-semibold',
                  )}
                >
                  {tier.name}
                </h2>
                <p className="mt-4 text-sm/6 text-gray-600">{tier.description}</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-semibold tracking-tight text-gray-900">
                    {tier.price[frequency.value]}
                  </span>
                  <span className="text-sm/6 font-semibold text-gray-600">{tier.saving}</span>
                </p>
                <a
                  href={tier.href}
                  aria-describedby={tier.id}
                  className={classNames(
                    tier.mostPopular
                      ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500'
                      : 'text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300',
                    'mt-6 block rounded-md px-3 py-2 text-center text-sm/6 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
                  )}
                >
                  Top up
                </a>
                <ul role="list" className="mt-8 space-y-3 text-sm/6 text-gray-600">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckIcon aria-hidden="true" className="h-6 w-5 flex-none text-indigo-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          </>
    )
}