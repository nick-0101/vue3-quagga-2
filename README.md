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
<script>
import { QuaggaScanner } from "vue3-quagga2";
</script>

<template>
  <QuaggaScanner
    :on-detected="(data) => console.log(data)"
    :reader-types="['ean_reader']"
  />
</template>
```

You can find an example usage in the /example folder. Check the component for available props

## 💡 Inspired by

quagga2/quaggaJS related projects:

- [ericblade/quagga2](https://github.com/ericblade/quagga2) (active fork of quaggaJS)
- [serratus/quaggaJS](https://github.com/serratus/quaggaJS) (seems to be no longer maintained)
- [vue3-quagga2](https://github.com/florianrusch/vue3-quagga2) (not completed)
- [sin-tanaka/vue-quagga](https://github.com/sin-tanaka/vue-quagga)
- <https://codesandbox.io/s/hidden-star-361gx>

## License

The project is licensed under the ["MIT license"](./LICENSE).
