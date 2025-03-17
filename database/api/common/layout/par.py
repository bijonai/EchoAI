from api import comp

par = comp('par', 'This API creates a paragraph element with customizable leading, spacing, and justification.')

par.attr('leading', 'Sets the line height of the paragraph', 'number')
par.attr('spacing', 'Sets the letter spacing of the paragraph', 'number')
par.attr('justify', 'Determines if the paragraph text is justified', 'boolean', 'false')
par.attr('linebreak', 'Determines if the paragraph text is linebroken', 'boolean', 'false')
par.attr('first-line-indent', 'Determines the first line indent of the paragraph', 'number', '0')
par.attr('indent', 'Determines the indent of the paragraph', 'number', '0')
