export type RunnerFunctionContext<R, P> = R & { providers: P };

export interface RunnerFunctionCallData<T, R> {
  args: T;
  context: R;
}