import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HomePage',
  async setup() {
    return () => <h1>Home page</h1>;
  },
});
