from api import comp

projection = comp('projection', 'a line from a point to axis')
projection.fullname('canvas:projection')

projection.attr('x', 'The x coordinate of the point', 'number')
projection.attr('y', 'The y coordinate of the point', 'number')
projection.attr('type', 'The type of the projection line', "'horizontal' | 'vertical' | 'both'", "'both'")

projection.rule('Must used in <plane> component')
