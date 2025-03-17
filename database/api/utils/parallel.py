from api import util

parallel = util('parallel', 'Return a start point and end point according to the start point, end point and offset of original line.')
parallel.add_param('start', 'The start point of the original line', '[number, number]')
parallel.add_param('end', 'The end point of the original line', '[number, number]')
parallel.add_param('offset', 'The offset of the parallel line', 'number')
