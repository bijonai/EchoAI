from api import comp

plane = comp('plane', 'A coordinate system component, which is used to display the coordinate system of the canvas, only can be used in <canvas> component')
plane.fullname('canvas:plane')

plane.attr('x', 'The x coordinate of the original position relative to the canvas', 'number', '0')
plane.attr('y', 'The y coordinate of the original position relative to the canvas', 'number', '0')
plane.attr('division', 'The division of the plane, which means how much pixels per unit length, the components under the plane will be displayed in this division', 'number', '50')
plane.attr('domain', 'The domain of the plane on x-axis', '[number, number]')
plane.attr('range', 'The range of the plane on y-axis', '[number, number]')
plane.attr('label', 'The label resolve function of the plane, give the label count, return the latex string to display on the number plane', '(count: number) => string', '(count) => count.toString()')
plane.attr('x-label', 'The label of the x-axis (support latex)', 'string', 'x')
plane.attr('y-label', 'The label of the y-axis (support latex)', 'string', 'y')
