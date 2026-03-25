# Code Review Rules

## TypeScript
- Use const/let, never var
- Prefer type over interface for object shapes
- No any types — use unknown or proper generics
- Strict mode enabled

## React / Next.js
- Use functional components only
- "use client" directive only where needed
- Prefer named exports for components
- Extract shared logic into custom hooks

## Architecture
- Business logic in lib/, UI in components/
- API routes handle validation and auth
- Server-only code must import "server-only"

## Security
- No secrets in code — use environment variables
- httpOnly cookies for auth
- Validate all API inputs with Zod
- Admin-only routes protected by middleware + handler
