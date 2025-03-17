from api import comp

circle = comp('circle', 'Circle with a center point and a radius.')
circle.fullname('canvas:circle')

circle.attr('x', 'The x coordinate of the center point', 'number')
circle.attr('y', 'The y coordinate of the center point', 'number')
circle.attr('r', 'The radius of the circle', 'number')
circle.attr('from', 'The start angle of the circle, the default radian direction is clockwise.', 'number', '0')
circle.attr('to', 'The end angle of the circle, the default radian direction is clockwise.', 'number', '360')
circle.attr('type', 'The type of the circle', '"solid" | "dashed" | "dotted"', '"solid"')

circle.use('edge-point', 'origin')
