from api import comp

figure = comp('figure', 'A base figure component')
figure.fullname('canvas:figure')

figure.attr('x', 'The x coordinate of the figure', 'number')
figure.attr('y', 'The y coordinate of the figure', 'number')
figure.attr('path', 'The path of the figure', 'string')

figure.example('''
You can use the `<figure>` component to draw a figure on the canvas.

```sciux
<canvas :width="300" :height="300" :origin="[150, 150]">
  <figure :x="0" :y="0" path="m 0 0 l 100 100" />
</canvas>
```

Otherwise, you can use the control point as tag in the `<figure>` component.

```sciux
<canvas :width="300" :height="300" :origin="[150, 150]">
  <figure :x="0" :y="0">
    <m :x="0" :y="0" />
    <l :x="100" :y="100" />
    <l :x="200" :y="200" />
    <l :x="300" :y="300" />
    <l :x="0" :y="300" />
    <l :x="300" :y="300" />
  </figure>
</canvas>
''')
