from api import comp

function = comp('function', 'A function component')
function.fullname('canvas:function')

function.attr('expr', 'The expression of the function', '(x: number) => number')
function.attr('domain', 'The domain of the function', '[number, number]')
