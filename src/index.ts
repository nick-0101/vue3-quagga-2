import "webrtc-adapter";
import QuaggaScanner from "./QuaggaScanner.vue";
import { App as AppType } from "vue";
import { createApp } from "vue";
import App from "./App.vue";

export { QuaggaScanner };

export default {
  install: (app: AppType) => {
    app.component("QuaggaScanner", QuaggaScanner);
  },
};

const app = createApp(App);
app.mount("#app");
