from api import comp


edge_point = comp('edge-point', 'A point on the edge of the circle.')
edge_point.fullname('canvas:circle:edge-point')

edge_point.attr('radian', 'The decision radian of the position of the point, for example, if radian === 90, the point will be on the bottom of the circle, the default radian direction is clockwise.', 'number')
edge_point.attr('as', 'The variable name of the edge point, you can use the variable in following context, [x, y] will be the value of the variable', 'string')
