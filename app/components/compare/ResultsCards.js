import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/20/solid";

export default function ResultsCards({ surveyors }) {
  return (
    <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-1">
      {surveyors.map((surveyor) => (
        <li
          key={surveyor.email}
          className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow"
        >
          <div className="flex w-full items-center justify-between space-x-6 p-6">
            <div className="flex-1 truncate">
              <div className="flex items-center justify-between space-x-3">
                <div className="flex gap-2">
                  {surveyor.imageUrl && (
                    <img
                      alt=""
                      src={surveyor.imageUrl}
                      className="size-10 shrink-0 rounded-full bg-gray-300"
                    />
                  )}
                  <h3 className="truncate text-lg font-bold text-gray-900">
                    {surveyor.name}
                  </h3>
                  <span className="inline-flex shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    {surveyor.role}
                  </span>
                </div>
                <p className="text-2xl font-bold align-middle">
                  £{surveyor.quote.price}
                  <span className="text-xs font-light align-middle ml-1">
                    (inc. VAT)
                  </span>
                </p>
              </div>
              <p className="mt-1 truncate text-sm text-gray-500">
                {surveyor.title}
              </p>
            </div>
          </div>
          <div>
            <div className="-mt-px flex divide-x divide-gray-200">
              <div className="flex w-0 flex-1">
                <a
                  href={`mailto:${surveyor.email}`}
                  className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                >
                  <EnvelopeIcon
                    aria-hidden="true"
                    className="size-5 text-gray-400"
                  />
                  Email
                </a>
              </div>
              <div className="-ml-px flex w-0 flex-1">
                <a
                  href={`tel:${surveyor.telephone}`}
                  className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                >
                  <PhoneIcon
                    aria-hidden="true"
                    className="size-5 text-gray-400"
                  />
                  Call
                </a>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
