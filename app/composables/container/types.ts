import type { CONTAINER_IDENTIFIER_KEY } from './constants';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface IContainerIdentifier<T> {
  [CONTAINER_IDENTIFIER_KEY]: string | symbol;

  getIdentifier(): string | symbol;
  toString(): string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- this is the core code.
export type TConstructor<TInstance = unknown, TArgs extends unknown[] = any[]> = new (...args: TArgs) => TInstance;

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- this is the core code.
export interface IRegistration<T = any> {
  constructor: TConstructor<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- this is the core code.
  dependencies: IContainerIdentifier<any>[];
}

export interface IDisposable {
  dispose(): void;
}

export interface SubscriptionLike {
  unsubscribe(): void;
  readonly closed: boolean;
}

type Prototype<T> = {
  [Property in keyof T]: T[Property] extends NewableFunction ? T[Property] : T[Property] | undefined;
} & {
  constructor: NewableFunction;
};
interface ConstructorFunction<T = Record<string, unknown>> {
  prototype: Prototype<T>;
  new (...args: unknown[]): T;
}
type DecoratorTarget<T = unknown> = ConstructorFunction<T> | Prototype<T>;

interface TypedPropertyDescriptor<T> {
  enumerable?: boolean;
  configurable?: boolean;
  writable?: boolean;
  value?: T;
  get?: () => T;
  set?: (value: T) => void;
}

export type TInjectedParameter<T> = (
  target: DecoratorTarget,
  targetKey?: string | symbol,
  indexOrPropertyDescriptor?: number | TypedPropertyDescriptor<T>,
) => void;
