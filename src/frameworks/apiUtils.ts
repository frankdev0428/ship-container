// import { Failure } from '../apis-client/models'

interface Failure {
    /**
     * Error messages
     * @type {Array<string>}
     * @memberof Failure
     */
    errors: Array<string>;
}

/**
 * Parses the JSON entity of an HTTP response as an Aeler Failure
 * @param f Function doing something with a `Failure`
 */
export const aelerApiFailure: (f: (failure: Failure) => void) => (error: any) => void = f => async error => {
  console.log('error', error)
  if (error instanceof Response && error.status >= 400) {
    f(await error.json())
  } else {
    f({ errors: ['Unable to decode server response'] })
  }
}
