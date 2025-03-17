from api import comp

grid = comp('grid', 'The grid element allows you to arrange content in a grid. You can define the number of rows and columns, as well as the size of the gutters between them. There are multiple sizing modes for columns and rows that can be used to create complex layouts')

grid.attr('columns', 'Defines the columns of the grid. Can be a single value, a number for multiple auto tracks, or an array of track sizes.', 'string | number | Array<string | number>', '')
grid.attr('rows', 'Defines the rows of the grid. Can be a single value, a number for multiple auto tracks, or an array of track sizes.', 'string | number | Array<string | number>', '')
grid.attr('gutter', 'The spacing between rows and columns.', 'string | number', '')
grid.attr('column-gutter', 'The spacing between columns.', 'string | number', '')
grid.attr('row-gutter', 'The spacing between rows.', 'string | number', '')
grid.attr('align', 'Alignment of content within cells.', 'string', '')
grid.attr('inset', 'Padding inside each cell.', 'string | number', '')

