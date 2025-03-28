"use client";

import { useState } from "react";
import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/16/solid";
import { CheckIcon } from "@heroicons/react/20/solid";

const propertyPrices = [
  { id: 1, display: "£0 - £100,000", value: 50000 },
  { id: 2, display: "£100,001 - £200,000", value: 150000 },
  { id: 3, display: "£200,001 - £300,000", value: 250000 },
  { id: 4, display: "£300,001 - £400,000", value: 350000 },
  { id: 5, display: "£400,001 - £500,000", value: 450000 },
  { id: 6, display: "£500,001 - £600,000", value: 550000 },
  { id: 7, display: "£600,001 - £700,000", value: 650000 },
  { id: 8, display: "£700,001 - £800,000", value: 750000 },
  { id: 9, display: "£800,001 - £900,000", value: 850000 },
  { id: 10, display: "£900,001 - £1,000,000", value: 950000 },
  { id: 11, display: "£1,000,001 - £1,100,000", value: 1050000 },
  { id: 12, display: "£1,100,001 - £1,200,000", value: 1150000 },
  { id: 13, display: "£1,200,001 - £1,300,000", value: 1250000 },
  { id: 14, display: "£1,300,001 - £1,400,000", value: 1350000 },
  { id: 15, display: "£1,400,001 - £1,500,000", value: 1450000 },
  { id: 16, display: "£1,500,001 - £1,600,000", value: 1550000 },
  { id: 17, display: "£1,600,001 - £1,700,000", value: 1650000 },
  { id: 18, display: "£1,700,001 - £1,800,000", value: 1750000 },
  { id: 19, display: "£1,800,001 - £1,900,000", value: 1850000 },
  { id: 20, display: "£1,900,001 - £2,000,000", value: 1950000 },
  { id: 21, display: "More than £2,000,000", value: 2050000 },
];

export default function InputPropertyPriceSelect({ onChange, value }) {
  const [selected, setSelected] = useState(
    value ? propertyPrices.find((p) => p.value === value) : propertyPrices[0]
  );

  const handleChange = (newSelected) => {
    setSelected(newSelected);
    onChange({ target: { name: "propertyPrice", value: newSelected.value } });
  };

  return (
    <Listbox value={selected} onChange={handleChange}>
      <Label className="block text-sm/6 font-medium text-gray-900">
        Property price
      </Label>
      <div className="relative mt-2">
        <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pl-3 pr-2 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-lg">
          <span className="col-start-1 row-start-1 truncate pr-6">
            {selected.display}
          </span>
          <ChevronUpDownIcon
            aria-hidden="true"
            className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
          />
        </ListboxButton>

        <ListboxOptions
          transition
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-lg"
        >
          {propertyPrices.map((price) => (
            <ListboxOption
              key={price.id}
              value={price}
              className="group relative cursor-default select-none py-2 pl-8 pr-4 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white data-[focus]:outline-none"
            >
              <span className="block truncate font-normal group-data-[selected]:font-semibold">
                {price.display}
              </span>

              <span className="absolute inset-y-0 left-0 flex items-center pl-1.5 text-indigo-600 group-[&:not([data-selected])]:hidden group-data-[focus]:text-white">
                <CheckIcon aria-hidden="true" className="size-5" />
              </span>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}
