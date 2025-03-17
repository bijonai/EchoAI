from api import comp

link = comp('link', 'This API creates a hyperlink element.')

link.attr('target', 'The URL to set as the hyperlink target', 'string')

link.rule('If `:target` is not provided, the element\'s text content is used as the URL.')

link.example('''
```eich
<link target="https://example.com">Click Here</link>
```
''', 'Create a link with a target of https://example.com') 