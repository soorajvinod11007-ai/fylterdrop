# Error Page Overrides

> **Route:** Application error boundary
> **Applies with:** [MASTER.md](../MASTER.md)

## Layout

- Keep the error message concise and on-brand, with a clear retry action and a secondary route back to safety.
- Use the existing neutral palette and avoid exposing implementation details or stack traces.

## Interaction

- The retry control must perform the actual reset action, have a visible focus state, and avoid success-shaped fallbacks.
