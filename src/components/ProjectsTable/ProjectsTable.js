/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTable, usePagination, useSortBy } from 'react-table';
import Button from '../Button/Button';
import './ProjectsTable.scss';

// Helpful examples
// https://github.com/tannerlinsley/react-table/blob/master/docs/examples/simple.md
// This is probably what we want
// github.com/tannerlinsley/react-table/blob/master/examples/sub-components/src/App.js

export default function ProjectsTable({ projects }) {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Project name',
        accessor: (project) => (
          <NavLink to={`/projects/${project.slug}`}>{project.name}</NavLink>
        ),
        // TODO: TEXT FILTER
        // TODO: width doesn't seem to be working, and the table adjusts width in weird ways between pages
        width: 100,
        sortType: 'basic',
      },
      {
        Header: 'Description',
        accessor: 'description',
        // TODO: TEXT FILTER
      },
      {
        Header: 'Brigade',
        accessor: 'brigade.name',
        sortType: 'basic',

        // TODO: DROPDOWN FILTER
      },
    ],
    []
  );

  const tableAttributes = useTable(
    {
      columns,
      data: projects || [],
      initialState: { pageIndex: 0, pageSize: 50 },
    },
    // TODO: use pagination to not load all of the rows every time
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    setPageSize,
    state: { pageSize },
  } = tableAttributes;

  return (
    <div className="projects-table">
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  <Button type="button" linkButton>
                    {column.render('Header')}
                    {column.isSorted
                      ? column.isSortedDesc
                        ? 'Descending'
                        : 'Ascending'
                      : undefined}
                    <span className="sr-only">Toggle sort</span>
                    {column.isSorted && (
                      // TODO: REAL ICON HERE
                      // TODO: MAKE THIS A BUTTON
                      <span className="sr-only">
                        {column.isSortedDesc ? 'Descending' : 'Ascending'}
                      </span>
                    )}
                  </Button>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {!projects && <span>Loading...</span>}
          {projects && projects.length === 0 && <span>No projects</span>}
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {projects && pageSize < projects.length && (
        <div className="load-projects-button">
          <Button
            text="Load next 50 projects"
            onClick={() => setPageSize(pageSize + 50)}
          />
        </div>
      )}
    </div>
  );
}
