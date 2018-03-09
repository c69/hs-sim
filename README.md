# hs-sim

This is core game processor.
It has two operating modes:
- **E2E CLI** via `main` (e2e style tests, which programmatically call game actions, creating 1 game for fatigue test, 1 game with full console output, and N=50 random "monte-carlo" simulations)
- **Web Client** via `main_rpc` (not-so-restful hooks for http server) See `./server/` and `./client/` for details. When both are launched, they expose UI at http://localhost:3000

## Running

To run e2e: `ts-node main.ts` or `npm run start`.
To run e2e with dynamic number of runs (e.g. 42): `ts-node main.ts 42` or `npm run start -- 42`.
To simply check that rpc connector works `ts-node main_rpc.ts`
This is cross-platform project that should run OK on both Windows and Mac. Probably on Linux too, but we never tried.

## Building

`npm run build`, then manually copy `.json` data files from `/data` to current ts output directory.
After that - server would be able to pickup the generated js files, so:
To run HTTP + UI do **both** things below:
- `npm run watch` in `./cient/`
- `npm run watch` in `./server/`

Alternatively, you also can run `node main.js` from `./dist/` folder (but i don't know why would you do such thing).

## To configure

- decks: edit `./classes/cardUniverse.ts` (yes, manually)
- e2e: edit `./main.ts` (yes, manually of course)
- abilities `./data/actions.collectiblePlus.ts` (not just manually, but also writing javascript in 9000+ lines of code file)

## Testing

`npm run test` for mocha tests written in `.ts`
`npm run coverage` to get coverage (BUG: does not work yet)

## Known issues

- either VSCode or ts-node (or my computer) has a problem with big .ts files. To be more specific, one file in particular - `actions.colectiblePlus.ts` from time to time can loose lines randomly (causing errors in aplication upon start). No changes are visible in git unless you add EXTRA changes. So be very careful when you save it and always check your commits for integrity. To resolve the issue: replace contents of the file with previous version from git inside of VSCode.
- zero coverage with Istanbul (nyc 11.0 bug, or just me doing something wrong)
- no unit tests exist (well there is one, just to prove ts + mocha work)
- ts/eslint is not fully configured yet
- auras and buffs are not yet fully implemented

For questions - ~~call me~~ create issue on github.

## Note to Webstorm Users:
To enable better automatic code style fixes install
jscs globally and enable the plugin in webstorm
https://www.themarketingtechnologist.co/how-to-get-airbnbs-javascript-code-style-working-in-webstorm/

## Legal Disclaimer

This project was not made for profit.
It's sole purpose is to explore and study software design and architecture approaches, using a complex business domain (hs game) as a model goal.
All data files and strings used are here for scientific and research purposes, as they create the constraints that system under development must meet.
If you believe you are the copyright holder of any assets here - feel free to open issue on github and i will contact you.
