from api import comp

smallcaps = comp('smallcaps', 'This api is used to convert the text to smallcaps.')

smallcaps.example('''
```eich
<smallcaps>text with smallcaps</smallcaps>
```
''', 'Convert the text to smallcaps') 