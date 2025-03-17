from api import comp

point_on = comp('point-on', 'Setup a (x,y) coordinate on the function according to the x coordinate')
point_on.fullname('canvas:function:point-on')

point_on.attr('x', 'The x coordinate of the coordinate on the function you want to save', 'number')
point_on.attr('as', 'The name of the variable', 'string')
