# playwright-api-playground

API and integration test playground in TypeScript using Playwright Test (API only).

This repository focuses on backend API testing practice: clean test structure, readable assertions, negative cases, contract-style checks, and CI execution.

## Recruiter notes

What this repo demonstrates:

- API test design: arrange act assert, positive and negative scenarios
- Separation of concerns: specs vs reusable flows vs low level request client
- CI ready execution via GitHub Actions
- Deterministic installs using npm ci and a committed lockfile
- Quality tooling: ESLint, Prettier, lint-staged + Husky (pre-commit)

## Tech stack

- TypeScript
- Playwright Test request fixture (API only, no UI)
- zod (runtime response validation)
- dotenv (environment configuration)
- ESLint + Prettier (code quality and formatting)
- Husky + lint-staged (pre-commit checks)

## System under test

Restful Booker public API playground.

Base URL override:

- BOOKER_BASE_URL
  Default:
- https://restful-booker.herokuapp.com

## Setup

Install dependencies:

```bash
npm ci
```

## Run tests

```bash
npm test
```

## HTML report

After running tests:

```bash
npm run report
```

## Lint and format

```bash
npm run lint
npm run lint:fix
npm run format
npm run format:check
npm run typecheck
```

## CI

GitHub Actions runs the test suite on every push and pull request.

Optional badge URL:

```text
https://github.com/crazeymusic/playwright-api-playground/actions/workflows/tests.yml/badge.svg
```

## Commit message convention

This repo uses a lightweight Conventional Commits style:

- test: test additions/changes
- feat: new functionality (clients, actions, utils)
- fix: bug fixes
- refactor: refactors without behavior changes
- chore: tooling/config/dependencies
- docs: documentation updates
- ci: CI workflow changes

Examples:

- test: add ping response validation
- feat: add auth client for restful-booker
- chore: add eslint prettier and pre-commit hooks

## Project structure

- tests
  - Specs and assertions

- src planned
  - clients: low level HTTP request wrappers, no business logic
  - actions: higher level API flows, no assertions
  - schemas: zod schemas for response validation
  - utils: shared utilities

## Roadmap

- Auth token handling
- Full CRUD scenarios (create get update delete)
- Negative tests and basic response contract checks
- Typed payload models for better maintainability
