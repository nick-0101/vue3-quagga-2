![](https://cdn-images-1.medium.com/max/1600/1*u5EN9YE4S2R7QbJ-rHOZpg.gif)

# quagga2-vue3

> Vue3 wrapper for [ericblade/quagga2](https://github.com/ericblade/quagga2)

## ⚙️ Usage

Add the dependency to your project:

```shell
npm i quagga2-vue3
# OR
yarn add quagga2-vue3
```

```
<template>
  <div>
    <QuaggaScanner :onDetected="logIt" :readerSize="readerSize" :readerTypes="['ean_reader']"></QuaggaScanner>
  </div>
</template>

<script>
import Vue from 'vue'
import VueQuagga from 'vue-quaggajs';

// register component 'v-quagga'
Vue.use(VueQuagga);

export default {
  name: 'VueBarcodeTest',
  data () {
    return {
      readerSize: {
        width: 640,
        height: 480
      },
      detecteds: []
    }
  },
  methods: {
    logIt (data) {
      console.log('detected', data)
    }

  }
}
</script>
```

You can find an example usage in the /example folder.

# Usage

### `onDetected` : function(result)

Reference: [Quagga.onDetected(callback)](https://github.com/serratus/quaggaJS#quaggaondetectedcallback)

default function:

```js
function (result) {
  console.log('detected: ', result);
}
```

### `onProcessed` : function(result)

Reference: [Quagga.onProcessed(callback)](https://github.com/serratus/quaggaJS#quaggaonprocessedcallback)

default function:

```js
function (result) {
  let drawingCtx = Quagga.canvas.ctx.overlay,
    drawingCanvas = Quagga.canvas.dom.overlay;

  if (result) {
    if (result.boxes) {
      drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
      result.boxes.filter(function (box) {
        return box !== result.box;
      }).forEach(function (box) {
        Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
      });
    }
    if (result.box) {
      Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
    }

    if (result.codeResult && result.codeResult.code) {
      Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
    }
  }
},
```

### readerTypes: String[]

Set reading barcode type.

Reference: [https://github.com/serratus/quaggaJS#decoder](https://github.com/serratus/quaggaJS#decoder)

default: `['code_128_reader']`

## License

The project is licensed under the ["MIT license"](./LICENSE).
