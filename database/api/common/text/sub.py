from api import comp

sub = comp('sub', 'This api is used to subscript the text.')

sub.attr('typographic', 'The typographic of the text', 'boolean')
sub.attr('baseline', 'Set the line-light of the text', 'number', '0.6')
sub.attr('size', 'Set the size of the text', 'number', '0.6')
