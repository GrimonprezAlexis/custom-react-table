import React, { useState } from "react";
import "./CustomTable.css";

interface Props {
  columns: { label: string; key: string }[];
  data: { [key: string]: any }[];
  pagination?: boolean;
  search?: boolean;
  sortable?: boolean;
  filterEntries?: boolean;
}

const CustomTable: React.FC<Props> = (props) => {
  const {
    columns,
    data,
    pagination = true,
    search = true,
    sortable = true,
    filterEntries = true,
  } = props;

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof Props["data"][0] | null>(
    null
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    null
  );

  // Define a constant named `filteredData` that contains the filtered data from `data`
  const filteredData = data.filter((row) =>
    // Check if any of the values in the `columns` array meet the search criteria
    columns.some((column) =>
      // Check if the value of the current `row` at the `column.key` property, converted to a string and lowercased, includes the lowercased `searchTerm`
      row[column.key]
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  );

  // Define a constant named `sortedData` that is the result of sorting `filteredData` based on `sortColumn` and `sortDirection`
  const sortedData = sortable
    ? filteredData.sort((a, b) => {
        // Check if `sortDirection` is equal to "asc"
        if (sortDirection === "asc") {
          // If true, sort the data in ascending order
          return a[sortColumn!] < b[sortColumn!]
            ? -1
            : a[sortColumn!] > b[sortColumn!]
            ? 1
            : 0;
        } else {
          // If false, sort the data in descending order
          return a[sortColumn!] > b[sortColumn!]
            ? -1
            : a[sortColumn!] < b[sortColumn!]
            ? 1
            : 0;
        }
      })
    : filteredData;

  const pages = Math.ceil(filteredData.length / itemsPerPage);

  const currentData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Define a constant named `handleSearch` that takes in a parameter `searchTerm` of type `string`
  const handleSearch = (searchTerm: string) => {
    // Set the value of `searchTerm` to the passed in `searchTerm`
    setSearchTerm(searchTerm);
    // Set the value of `currentPage` to 1
    setCurrentPage(1);
  };

  // Define a constant named `handleSort` that takes in a parameter `columnKey` of type `keyof Props["data"][0]`
  const handleSort = (columnKey: keyof Props["data"][0]) => {
    // Check if `sortColumn` is equal to `columnKey`
    if (sortColumn === columnKey) {
      // If true, toggle the value of `sortDirection` from "asc" to "desc" or vice versa
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // If false, set `sortColumn` to `columnKey`
      setSortColumn(columnKey);
      // Set `sortDirection` to "asc"
      setSortDirection("asc");
    }
  };

  return (
    <div className="custom-table">
      <div className="custom-table-search">
        {filterEntries && (
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <option value={10}> 10 entries</option>
            <option value={25}> Show 25 entries</option>
            <option value={50}> Show 50 entries</option>
            <option value={100}> Show 100 entries</option>
          </select>
        )}

        {search && (
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        )}
      </div>

      <table className="custom-table-container">
        <thead className="custom-table-header">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="custom-table-header-cell"
                onClick={sortable ? () => handleSort(column.key) : undefined}
              >
                {column.label}
                {sortable && sortColumn === column.key && (
                  <span className={`sort-icon-${sortDirection}`}>
                    {sortDirection === "asc" ? " 🔼" : " 🔽"}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="custom-table-body">
          {currentData.map((row, index) => (
            <tr key={index} className="custom-table-row">
              {columns.map(({ key }, index) => (
                <td key={index} className="custom-table-cell">
                  {row[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {pagination && (
        <div className="custom-table-pagination">
          <span className="custom-table-pagination-info">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
            {filteredData.length} entries
          </span>

          <button
            className="custom-table-pagination-button"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Prev
          </button>
          <span className="custom-table-pagination-info">
            Page {currentPage} of {pages}
          </span>
          <button
            className="custom-table-pagination-button"
            disabled={currentPage === pages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomTable;
