import React, { useMemo, useState } from "react";
import "./CustomTable.css";

interface Column<T> {
  key: keyof T;
  label: string;
}

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  pagination?: boolean;
  search?: boolean;
  sortable?: boolean;
}

interface Props<T> {
  data: T[];
  columns: Column<T>[];
  itemsPerPage?: number;
  searchTerm?: string;
  sortColumn?: keyof T;
  sortDirection?: "asc" | "desc";
}

const CustomTable: React.FC<Props> = (props) => {
  const {
    columns,
    data,
    pagination = true,
    search = true,
    sortable = true,
  } = props;

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof Props["data"][0] | null>(
    null
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    null
  );

  const itemsPerPage = 10;

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const searchTermLowerCase = searchTerm.toLowerCase();
      for (const column of columns) {
        if (
          row[column.key] &&
          row[column.key].toString().toLowerCase().includes(searchTermLowerCase)
        ) {
          return true;
        }
      }
      return false;
    });
  }, [data, columns, searchTerm]);

  const sortedData = useMemo(() => {
    if (!sortable || !sortColumn) {
      return filteredData;
    }
    return [...filteredData].sort((a, b) => {
      const sortColumnValueA = a[sortColumn];
      const sortColumnValueB = b[sortColumn];
      if (sortDirection === "asc") {
        return sortColumnValueA < sortColumnValueB ? -1 : 1;
      } else {
        return sortColumnValueA > sortColumnValueB ? -1 : 1;
      }
    });
  }, [filteredData, sortable, sortColumn, sortDirection]);

  const pages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  const handleSort = (columnKey: keyof Props["data"][0]) => {
    if (typeof sortColumn !== "undefined" && sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  return (
    <div className="custom-table">
      {search && (
        <div className="custom-table-search">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      )}
      <table className="custom-table-container">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="custom-table-header-cell"
                onClick={sortable ? () => handleSort(column.key) : undefined}
              >
                {column.header}
                {sortable && sortColumn === column.key && (
                  <span className={`sort-icon-${sortDirection}`}>
                    {sortDirection === "asc" ? " 🔼" : " 🔽"}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentData.map((row, index) => (
            <tr key={index}>
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
