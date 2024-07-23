<script>
import { QuaggaScanner } from "vue3-quagga2";
</script>

<template>
  <div>
    <h1>Barcode Reader</h1>
    <QuaggaScanner
      :on-detected="(data) => console.log(data)"
      :reader-types="['ean_reader']"
    />
  </div>
</template>
