from api import comp

canvas = comp('canvas', 'A component that can be used to draw on the canvas, which is a component that can be used to draw on the canvas')

canvas.attr('width', 'The width of the canvas', 'number', '300')
canvas.attr('height', 'The height of the canvas', 'number', '300')
canvas.attr('origin', 'The origin of the canvas, the x coordinate are from left to right, the y coordinate are from top to bottom', 'string', '[0, 0]')

canvas.use(
  'angle', 'axis', 'circle', 'dot', 'figure', 'function', 'line', 'parametric', 'plane', 'polygon', 'vector',
)