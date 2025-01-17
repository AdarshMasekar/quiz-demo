import React from "react";
import { Link } from "react-router-dom";
import { ChevronRightIcon } from "@heroicons/react/20/solid";

const Breadcrumb = ({ items }) => {
  return (
    <nav
      className="flex py-3 px-5 text-gray-700 bg-gray-50 rounded-lg"
      aria-label="Breadcrumb"
    >
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li>
          <Link
            to="/"
            className="text-sm font-medium text-blue-700 hover:text-blue-900"
          >
            Home
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            <ChevronRightIcon
              className="w-5 h-5 text-gray-400"
              aria-hidden="true"
            />
            {item.link ? (
              <Link
                to={item.link}
                className="ml-1 text-sm font-medium text-blue-700 hover:text-blue-900"
              >
                {item.label}
              </Link>
            ) : (
              <span className="ml-1 text-sm font-medium text-gray-500">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
