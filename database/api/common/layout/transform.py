from api import comp

transform = comp('transform', 'Transform the css of DOM element.')

transform.attr('translate', 'Tranform the element by translating it by the given value.', 'number | array')
transform.attr('angle', 'Tranform the element by rotating it by the given value.', 'number&AngleUnit')
transform.attr('scale', 'Tranform the element by scaling it by the given value.', 'number | array')
