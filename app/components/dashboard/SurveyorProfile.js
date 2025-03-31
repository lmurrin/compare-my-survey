import { UserCircleIcon } from '@heroicons/react/24/solid';
import AlertError from '../AlertError';

export default function SurveyorProfile({ formData, handleInputChange, handleLogoChange }) {

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
      <div>
        <h2 className="text-base/7 font-semibold text-gray-900">Profile</h2>
        <p className="mt-1 text-sm/6 text-gray-600">
          This information will be displayed publicly so be careful what you share.
        </p>
      </div>

      <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
        {/* Company Name */}
        <div className="sm:col-span-4">
          <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
            Company Name
          </label>
          <div className="mt-2">
            <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
              <input
                id="companyName"
                name="companyName"
                type="text"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={handleInputChange}
                className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
              />
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="sm:col-span-4">
          <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
            Email
          </label>
          <div className="mt-2">
            <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
              />
            </div>
          </div>
        </div>

        {/* Phone */}
        <div className="sm:col-span-4">
          <label htmlFor="phone" className="block text-sm/6 font-medium text-gray-900">
            Phone
          </label>
          <div className="mt-2">
            <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
              <input
                id="phone"
                name="phone"
                type="text"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="sm:col-span-4">
          <label htmlFor="address" className="block text-sm/6 font-medium text-gray-900">
            Address
          </label>
          <div className="mt-2">
            <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
              <input
                id="address"
                name="address"
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={handleInputChange}
                className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="col-span-full">
          <label htmlFor="description" className="block text-sm/6 font-medium text-gray-900">
            Description
          </label>
          <div className="mt-2">
            <textarea
              id="description"
              name="description"
              rows={3}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          <p className="mt-3 text-sm/6 text-gray-600">Write a few sentences about your business.</p>
        </div>

        {/* Logo */}
        <div className="col-span-full">
            <label htmlFor="logo" className="block text-sm/6 font-medium text-gray-900">
              Logo
            </label>
            <div className="mt-2 flex items-center gap-x-3">
              {formData.logo ? (
                <img src={formData.logo} alt="Logo preview" className="h-12 w-12 rounded-full object-cover" />
              ) : (
                <UserCircleIcon className="h-12 w-12 text-gray-300" aria-hidden="true" />
              )}
              <input
                id="logo"
                name="logo"
                type="file"
                accept="image/*"
                onChange={(e) => handleLogoChange(e)}
                className="text-sm text-gray-700"
              />
            </div>

            <AlertError
                title="Note:"
                messages={[
                  "Logo upload is not operational during production.",
                ]}
              />
          </div>
            
          </div>
        </div>

  );
}
