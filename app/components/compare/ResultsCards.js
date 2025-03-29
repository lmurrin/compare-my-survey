import { EnvelopeIcon, PhoneIcon, StarIcon, PhoneIcon as CallIcon } from "@heroicons/react/20/solid";

function StarRating({ rating, reviews }) {
  return (
    <div className="flex items-center space-x-2 mb-2 mt-1 text-sm text-gray-600">
      <div className="flex items-center space-x-0.5">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating) ? "text-yellow-400" : "text-gray-200"
            }`}
            aria-hidden="true"
          />
        ))}
      </div>
      <span>({reviews} review{reviews !== 1 ? "s" : ""})</span>
    </div>
  );
}

export default function ResultsCards({ surveyors }) {
  return (
    <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-1">
      {surveyors.map((surveyor) => {
        // Generate fake rating & reviews for display
        const rating = (Math.random() * (5 - 4) + 4).toFixed(1); // 4.0 - 5.0
        const reviews = Math.floor(Math.random() * 80 + 5); // 5 - 84 reviews

        return (
          <li
            key={surveyor.email}
            className="col-span-1 divide-y divide-gray-200 rounded-lg bg-gray-50 shadow"
          >
            <div className="flex w-full items-center justify-between space-x-6 p-6">
              <div className="flex-1 truncate">
                <div className="flex items-center justify-between space-x-3">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
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
                   
                  </div>
                  <p className="text-2xl font-bold align-middle">
                    £{surveyor.quote.price}
                    <span className="text-xs font-light align-middle ml-1">
                      (inc. VAT)
                    </span>
                  </p>
                </div>
                <StarRating rating={rating} reviews={reviews} />
                <p className="mt-1 truncate text-sm text-gray-500">
                  {surveyor.title}
                </p>
              </div>
            </div>
            <div>
              <div className="-mt-px flex divide-x divide-gray-200 bg-indigo-500 rounded-br-lg rounded-bl-lg">
                <div className="flex w-0 flex-1  hover:bg-indigo-600 hover:border-l-1 hover:border-white rounded-bl-lg">
                  <a
                    href={`mailto:${surveyor.email}`}
                    className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-white"
                  >
                    <EnvelopeIcon
                      aria-hidden="true"
                      className="size-5 text-white"
                    />
                    Email
                  </a>
                </div>
                <div className="-ml-px flex w-0 flex-1 hover:bg-indigo-600 hover:border-l-1 hover:border-white rounded-br-lg">
                  <a
                    href={`tel:${surveyor.telephone}`}
                    className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-white"
                  >
                    <CallIcon
                      aria-hidden="true"
                      className="size-5 text-white"
                    />
                    Call
                  </a>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
