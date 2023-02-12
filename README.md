### Features
A custom table component built with React and TypeScript that allows for sorting, filtering, searching, and pagination of data.

## Installation
To install the dependencies, run: `npm install`

## Usage
In your React component, import the CustomTable component and pass in the required columns and data props.

```react
import React from 'react';
import CustomTable from 'custom-table';

const columns = [
  { header: 'Name', key: 'name' },
  { header: 'Email', key: 'email' },
  { header: 'Phone', key: 'phone' },
];

const data = [
  { name: 'John Doe', email: 'johndoe@example.com', phone: '555-555-5555' },
  { name: 'Jane Doe', email: 'janedoe@example.com', phone: '555-555-5556' },
  { name: 'Bob Smith', email: 'bobsmith@example.com', phone: '555-555-5557' },
];

const Example = () => (
	<CustomTable 
		data={data} 
		columns={columns} 
		pagination={true} 
		search={true} 
		sortable={true} 
		filterEntries={true}
	/>
);

export default Example;
```
In the example above, the columns array defines the headers and keys for each column in the table, and the data array provides the data to be displayed in the table.

## Props
- `columns` (required): An array of objects with the keys label and key. The label is the text to display in the table header and the key is the key for the corresponding data in the data prop.

- `data` (required): An array of objects representing the data to be displayed in the table.

- `pagination` (optional, default `true`): Enables or disables pagination.

- `search` (optional, default `true`): Enables or disables searching.

- `sortable` (optional, default `true`): Enables or disables sorting.

- `filterEntries` (optional, default `true`): Enables or disables filtering the number of entries displayed.

## License
CustomTable is released under the MIT license. See LICENSE for more information.