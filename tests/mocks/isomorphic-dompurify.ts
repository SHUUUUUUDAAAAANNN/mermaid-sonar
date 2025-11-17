/**
 * Mock implementation of isomorphic-dompurify for testing
 */

const createDOMPurify = (_window: any) => ({
  sanitize: (input: string) => input,
  addHook: () => {},
});

export default createDOMPurify;
