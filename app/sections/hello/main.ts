import { Disposable } from '~/composables/container';
import type { IHelloService } from './types';
import { BehaviorSubject } from 'rxjs';

export class HelloService extends Disposable implements IHelloService {
  private _hello = '';
  private _helloSubject = new BehaviorSubject('');

  $hello = this._helloSubject.asObservable();

  constructor() {
    super();

    this.disposeWithMe(this.$hello.subscribe((val) => void (this._hello = val)));
  }

  get hello() {
    return this._hello;
  }

  set(nextValue: string): void {
    this._helloSubject.next(nextValue);
  }
}
