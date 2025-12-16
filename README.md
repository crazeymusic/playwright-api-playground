# playwright-api-playground

API and integration test playground in TypeScript using Playwright Test (API only).

This repository focuses on backend API testing practice: clean test structure, readable assertions, negative cases, and CI execution.

## Recruiter notes

What this repo demonstrates:

- API test design: arrange act assert, positive and negative scenarios
- Separation of concerns: specs vs reusable flows vs low level request client
- CI ready execution via GitHub Actions
- Deterministic installs using npm ci and a committed lockfile

## Tech stack

- TypeScript
- Playwright Test request fixture (API only, no UI)

## System under test

Restful Booker public API playground

Base URL override:

- BOOKER_BASE_URL
  Default:
- https://restful-booker.herokuapp.com

## Setup

Run:
npm ci

## Run tests

npm test

## HTML report

After running tests:
npm run report

## CI

GitHub Actions runs the test suite on every push and pull request.

Optional badge URL:
https://github.com/crazeymusic/playwright-api-playground/actions/workflows/tests.yml/badge.svg

## Project structure

tests

- Specs and assertions

src planned

- clients: low level HTTP request wrappers, no business logic
- actions: higher level API flows, no assertions
- utils: shared utilities

## Roadmap

- Auth token handling
- Full CRUD scenarios (create get update delete)
- Negative tests and basic response contract checks
- Typed payload models for better maintainability
