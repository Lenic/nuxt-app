import { Disposable } from '~/composables/container';
import type { IHelloService } from './types';
import { BehaviorSubject, map, tap } from 'rxjs';
import type { Observable } from 'rxjs';
import { http$ } from '#imports';

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

  load(): Observable<true> {
    return http$<{ hello: string }>('/api/hello').pipe(
      tap((res) => this._helloSubject.next(res.hello)),
      map(() => true),
    );
  }

  update(nextValue: string): Observable<void> {
    return http$<{ hello: string }>({ url: '/api/hello', method: 'POST', body: { hello: nextValue } }).pipe(
      map((res) => this._helloSubject.next(res.hello)),
    );
  }
}
