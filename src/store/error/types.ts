
export type MessageSeverity = 'error' | 'warning' | 'success'

export type ErrorsReducerState = {
  errorMessages?: string[];
  severity: MessageSeverity;
}
