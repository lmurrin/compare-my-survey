import Link from 'next/link';

export default function DashboardHeading({
  title = "Dashboard",
  description = "",
  showEditButton = true,
  showPublishButton = true,
  editButtonText = "Edit",
  publishButtonText = "Add New",
  editButtonLink = null,
  publishButtonLink = null,
}) {
  return (
    <div className="md:flex md:items-center md:justify-between">
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          {title}
        </h2>
        {description && description.trim() !== "" && <p className="py-2">{description}</p>}
      </div>
      <div className="mt-4 flex md:ml-4 md:mt-0">
        {showEditButton && (
          editButtonLink ? (
            <Link
              href={editButtonLink}
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              {editButtonText}
            </Link>
          ) : (
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              {editButtonText}
            </button>
          )
        )}
        {showPublishButton && (
          publishButtonLink ? (
            <Link
              href={publishButtonLink}
              className="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {publishButtonText}
            </Link>
          ) : (
            <button
              type="button"
              className="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {publishButtonText}
            </button>
          )
        )}
      </div>
    </div>
  );
}
