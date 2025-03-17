from api import comp

line = comp('line', 'Line segment between two points.')
line.fullname('canvas:line')

line.attr('from', 'The start point of the line', '[number, number]')
line.attr('to', 'The end point of the line', '[number, number]')
line.attr('value', 'The display latex of the length of the line', 'string')
line.attr('type', 'The type of the line', '"solid" | "dashed" | "dotted"', '"solid"')

line.use('end-point', 'start-point')
