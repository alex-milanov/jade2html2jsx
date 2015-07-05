# jade2html2jsx
an attempt to make it possible to write react components in jade/html or at least easy to convert them to jsx

## dependencies
```sh
npm install -g gulp
```

## setup
```sh
npm install
```

## usage
```sh
# convert jade to html
gulp jade
# convert html to jsx
node html2jsx/index.js
```

## example
```jade
div.react-component(data-rc-name="App")
```
converts to
```html
<div data-rc-name="App" class="react-component">
```
will produce
```jsx
import React from 'React'
...

class App {
  render(){
    return (
      <div>
      ...
    </div>
    )
  }
}

export default App
```

## known bugs
resulting jsx code component names and attribute names is all smallcaps
