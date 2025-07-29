import { register } from '@/composables/container';
import { HelloService, IHelloService } from './hello';

export function registerServices() {
  register(IHelloService, HelloService);
}
