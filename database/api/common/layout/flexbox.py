from api import comp

flexbox = comp('flexbox', 'This component defines a flexbox container with various attributes for layout and alignment. It extends the BlockAttributes and provides additional properties to control the flexbox behavior.')

flexbox.attr('direction', 'The direction of the flex items within the flex container. Options are `row`, `column`.', "'row' | 'column'", "'row'")
flexbox.attr('justify', 'The alignment of the flex items along the main axis. Options are `start`, `end`, `center`, `space-between`, `space-around`, `space-evenly`.', "'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'", "'start'")
flexbox.attr('align', 'The alignment of the flex items along the cross axis. Options are `start`, `end`, `center`, `stretch`, `baseline`.', "'start' | 'end' | 'center' | 'stretch' | 'baseline'", "'start'")
flexbox.attr('grow', 'The flex grow factor of the flex item.', 'number', '0')
flexbox.attr('shrink', 'The flex shrink factor of the flex item.', 'number', '1')
flexbox.attr('basis', 'The initial main size of the flex item.', 'string | number')
flexbox.attr('wrap', 'The wrapping behavior of the flex container. Options are `nowrap`, `wrap`, `wrap-reverse`.', "'nowrap' | 'wrap' | 'wrap-reverse'", "'nowrap'")
flexbox.attr('gap', 'The gap between flex items.', 'string | number', '0')
