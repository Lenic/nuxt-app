import type { Observable } from 'rxjs';
import { createIdentifier } from '~/composables/container';

export interface IHelloService {
  readonly hello: string;
  $hello: Observable<string>;

  set(nextValue: string): void;
}

export const IHelloService = createIdentifier<IHelloService>(Symbol('IHelloService'));
