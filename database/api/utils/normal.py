from api import util

normal = util('normal', 'Return a position according to the start point, end point of original line and the start point of the normal line.')
normal.add_param('start', 'The start point of the original line', '[number, number]')
normal.add_param('end', 'The end point of the original line', '[number, number]')
normal.add_param('point', 'The start point of the normal line', '[number, number]')
