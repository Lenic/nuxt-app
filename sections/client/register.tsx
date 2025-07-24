import { ClientOnly } from '#components';

import { register } from '~/composables/container';
import { HelloService, IHelloService } from './hello';

export const ContainerRegister = defineComponent({
  name: 'ContainerRegister',
  setup() {
    register(IHelloService, HelloService);

    return () => <ClientOnly />;
  },
});
