from api import comp

angle = comp('angle', 'Angle with at least two sides.')
angle.fullname('canvas:angle')

angle.attr('x', 'The x coordinate of the center of the angle', 'number')
angle.attr('y', 'The y coordinate of the center of the angle', 'number')
angle.attr('from', 'The starting angle of the angle, the default radian direction is clockwise.', 'number', '0')
angle.attr('to', 'The ending angle of the angle, the default radian direction is clockwise.', 'number')
angle.attr('start-side', 'The length of the start side of the angle', 'number')
angle.attr('end-side', 'The length of the end side of the angle', 'number')
angle.attr('start-side-color', 'The color of the start side of the angle', 'string', 'black')
angle.attr('end-side-color', 'The color of the end side of the angle', 'string', 'black')
angle.attr('start-side-type', 'The type of the start side of the angle', 'string', "'solid' | 'dashed' | 'dotted'")
angle.attr('end-side-type', 'The type of the end side of the angle', 'string', "'solid' | 'dashed' | 'dotted'")
angle.attr('start-side-value', 'The display latex value of the start side of the angle', 'string')
angle.attr('end-side-value', 'The display latex value of the end side of the angle', 'string')

angle.use('arc', 'bounding', 'end-point', 'start-point', 'origin')
