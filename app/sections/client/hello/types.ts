import type { Observable } from 'rxjs';
import { createIdentifier } from '~/composables/container';

export interface IHelloService {
  readonly hello: string;
  $hello: Observable<string>;

  load(): Observable<true>;
  set(nextValue: string): void;
  update(nextValue: string): Observable<void>;
}

export const IHelloService = createIdentifier<IHelloService>(Symbol('IHelloService'));
