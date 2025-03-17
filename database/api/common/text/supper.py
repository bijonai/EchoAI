from api import comp

supper = comp('supper', 'This api is used to superscript the text.')

supper.attr('typographic', 'The typographic of the text', 'boolean')
supper.attr('baseline', 'Set the line-light of the text', 'number', '0.6')
supper.attr('size', 'Set the size of the text', 'number', '0.6')
