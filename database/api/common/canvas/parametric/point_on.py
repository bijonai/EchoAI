from api import comp

point_on = comp('point-on', 'Save (x,y) coordinates on the parametric graph according to a x coordinate or a y coordinate')
point_on.fullname('canvas:parametric:point-on')

point_on.attr('x', 'The x coordinate of the coordinate on the parametric graph you want to save, cannot valued when `y` is valued', 'number')
point_on.attr('y', 'The y coordinate of the coordinate on the parametric graph you want to save, cannot valued when `x` is valued', 'number')
point_on.attr('as', 'The name of the variable, save a coordinate set ([number, number][])', 'string')
point_on.attr('as-max', 'The name of the variable, save the maximum coordinate ([number, number])', 'string')
point_on.attr('as-min', 'The name of the variable, save the minimum coordinate ([number, number])', 'string')