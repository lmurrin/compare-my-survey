"use client";

export const dynamic = 'force-dynamic';

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  CalendarIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
  MapIcon,
  UserCircleIcon,
  CurrencyPoundIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { SessionProvider, useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import cmsLogo from "../../public/cms.svg";
import Link from "next/link";
import userIcon from "../../public/user-icon.svg"




const teams = [
  { id: 1, name: "Heroicons", href: "#", initial: "H" },
  { id: 2, name: "Tailwind Labs", href: "#", initial: "T" },
  { id: 3, name: "Workcation", href: "#", initial: "W" },
];

const userNavigation = [
  { name: "Your profile", href: "/dashboard/profile" },
  {
    name: "Sign out",
    href: "#",
    onClick: () => signOutAndRedirect(), // Modify onClick to call the function
  },
];

// Function to handle sign out and redirection
const signOutAndRedirect = () => {
  signOut({ redirect: true, callbackUrl: "/login" }); // Let NextAuth handle the redirect
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session, status } = useSession();

  const pathname = usePathname();
  console.log(pathname)

  const baseNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    {
      name: "My Services",
      href: "/dashboard/services",
      icon: DocumentDuplicateIcon,
    },
    { name: "My Areas", href: "/dashboard/areas", icon: MapIcon },
    { name: "Profile", href: "/dashboard/profile", icon: UserCircleIcon },
    { name: "Billing", href: "/dashboard/billing", icon: CurrencyPoundIcon },
  ];

  const adminNavigation = [
    { name: "Survey Types", href: "/dashboard/survey-types", icon: FolderIcon },
    { name: "Locations", href: "/dashboard/locations", icon: MapIcon },
    { name: "Reports", href: "/dashboard/reports", icon: ChartPieIcon },
  ];

  const [navigation, setNavigation] = useState(baseNavigation);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState('');

  // Update navigation based on user role
  useEffect(() => {
    if (session?.isAdmin) {
      let updatedNavigation = [...baseNavigation];

      // Insert admin-only links
      updatedNavigation.splice(1, 0, ...adminNavigation);

      // Add Surveyors link if not already present
      if (!updatedNavigation.some((item) => item.name === "Surveyors")) {
        updatedNavigation.splice(1, 0, {
          name: "Surveyors",
          href: "/dashboard/surveyors",
          icon: UsersIcon,
        });
      }

      setNavigation(updatedNavigation);
    }
  }, [session]);

  

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await fetch("/api/balance");
        const data = await res.json();
  
        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch balance");
        }
  
        setBalance(data.balance);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    if (status === "authenticated") {
      fetchBalance();
    }
  }, [status]);

  return (
    <>
      <SessionProvider>
        {/*
      This example requires updating your template:

      ```
      <html class="h-full bg-white">
      <body class="h-full">
      ```
    */}
        <div>
          <Dialog
            open={sidebarOpen}
            onClose={setSidebarOpen}
            className="relative z-50 lg:hidden"
          >
            <DialogBackdrop
              transition
              className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
            />

            <div className="fixed inset-0 flex">
              <DialogPanel
                transition
                className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
              >
                <TransitionChild>
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                    <button
                      type="button"
                      onClick={() => setSidebarOpen(false)}
                      className="-m-2.5 p-2.5"
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        aria-hidden="true"
                        className="size-6 text-white"
                      />
                    </button>
                  </div>
                </TransitionChild>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4 ring-1 ring-white/10">
                  <div className="flex h-16 shrink-0 items-center">
                    <Link href="/" onClick={() => setSidebarOpen(false)}>
                      <img
                        alt="Your Company"
                        src={cmsLogo.src}
                        className="h-8 w-auto"
                      />
                    </Link>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            <Link
                              href={item.href}
                              onClick={() => setSidebarOpen(false)}
                              className={classNames(
                                pathname.toLowerCase() === `dashboard/${item.href.toLowerCase()}`
                                  ? "bg-gray-800 text-white"
                                  : "text-gray-400 hover:bg-gray-800 hover:text-white",
                                "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                              )}
                            >
                              <item.icon aria-hidden="true" className="size-6 shrink-0" />
                              {item.name}
                            </Link>

                          </li>
                        ))}

                        </ul>
                      </li>

                      <li className="mt-auto">
                        <Link
                          href="#"
                          className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-400 hover:bg-gray-800 hover:text-white"
                        >
                          <Cog6ToothIcon
                            aria-hidden="true"
                            className="size-6 shrink-0"
                          />
                          Settings
                        </Link>
                      </li>
                    </ul>
                  </nav>
                </div>
              </DialogPanel>
            </div>
          </Dialog>

          {/* Static sidebar for desktop */}
          <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
              <div className="flex h-16 shrink-0 items-center">
              <Link href="/">
                  <img
                    alt="Your Company"
                    src={cmsLogo.src}
                    className="h-8 w-auto"
                  />
                </Link>
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className={classNames(
                              item.current
                                ? "bg-gray-800 text-white"
                                : "text-gray-400 hover:bg-gray-800 hover:text-white",
                              "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                            )}
                          >
                            <item.icon
                              aria-hidden="true"
                              className="size-6 shrink-0"
                            />
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>

                  <li className="mt-auto">
                    <Link
                      href="#"
                      className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-400 hover:bg-gray-800 hover:text-white"
                    >
                      <Cog6ToothIcon
                        aria-hidden="true"
                        className="size-6 shrink-0"
                      />
                      Settings
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          <div className="lg:pl-72">
            <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon aria-hidden="true" className="size-6" />
              </button>

              {/* Separator */}
              <div
                aria-hidden="true"
                className="h-6 w-px bg-gray-900/10 lg:hidden"
              />

              <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="flex flex-1 items-center">
              <p className="text-sm text-gray-600">
                {balance > 15 ? (
                  <>
                    <span className="hidden sm:inline">Account balance:</span>
                    <span className="inline sm:hidden">Balance:</span>
                    <span className="font-semibold ms-1">£{balance}</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Account balance:</span>
                    <span className="inline sm:hidden">Balance:</span>
                    <span className="font-semibold text-red-600 ms-1">£{balance}</span>
                  </>
                )}
                <Link
                  href="/billing"
                  className="border p-2 rounded-lg border-indigo-400 hover:bg-indigo-50 text-indigo-600 hover:text-indigo-700 ms-2 font-semibold"
                >
                  Top up
                </Link>
              </p>


                {/* <form
                  action="#"
                  method="GET"
                  className="grid flex-1 grid-cols-1"
                >
                  <input
                    name="search"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    className="col-start-1 row-start-1 block size-full bg-white pl-8 text-base text-gray-900 outline-none placeholder:text-gray-400 sm:text-sm/6"
                  />
                  <MagnifyingGlassIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 size-5 self-center text-gray-400"
                  />
                </form> */}
                </div>
                <div className="flex items-center gap-x-4 lg:gap-x-6">
                  <button
                    type="button"
                    className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon aria-hidden="true" className="size-6" />
                  </button>

                  {/* Separator */}
                  <div
                    aria-hidden="true"
                    className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
                  />

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative">
                    <MenuButton className="cursor-pointer -m-1.5 flex items-center p-1.5">
                      <span className="sr-only">Open user menu</span>
                      <img
                        alt=""
                        src={userIcon.src}
                        className="size-8 rounded-full bg-gray-50"
                      />
                      <span className="hidden lg:flex lg:items-center">
                        <span
                          aria-hidden="true"
                          className="cursor-pointer ml-4 text-sm/6 font-semibold text-gray-900"
                        >
                          <SessionUserDisplay />
                        </span>
                        <ChevronDownIcon
                          aria-hidden="true"
                          className="ml-2 size-5 text-gray-400"
                        />
                      </span>
                    </MenuButton>
                    <MenuItems
                      transition
                      className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                    >
                      {userNavigation.map((item) => (
                        <MenuItem key={item.name}>
                          <Link
                            href={item.href}
                            onClick={item.onClick} // Ensure onClick is properly attached
                            className="cursor-pointer block px-3 py-1 text-sm/6 text-gray-900 data-[focus]:bg-gray-50 data-[focus]:outline-none"
                          >
                            {item.name}
                          </Link>
                        </MenuItem>
                      ))}
                    </MenuItems>
                  </Menu>
                </div>
              </div>
            </div>

            {/* Insert this where your content area goes */}
            <main className="py-10">
              <div className="px-4 sm:px-6 lg:px-8">{children}</div>
            </main>
          </div>
        </div>
      </SessionProvider>
    </>
  );
}

// Custom component to display the company name after session is loaded
function SessionUserDisplay() {
  const { data: session } = useSession();

  if (!session) return null;
  return <span>{session.companyName}</span>;
}
