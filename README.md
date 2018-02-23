# hs-sim

This is core game processor.
It has only console output and two input methods:
- **Running** via main.js (e2e style tests, which programmatically call game actions)
- **Building** via main_rpc.js (not-so-restful hooks for http server) See `./server/` and `./client/` for details. When both are launched, they expose UI at http:\\localhost:3000

## Running

To run e2e: `ts-node main.ts` or `npm run start`
To simply check that rpc connector works `ts-node main_rpc.ts`
This is cross-platform project that should run OK on both Windows and Mac. Probably on Linux too, but we never tried.

## Building

`npm run build`, then manually copy `.json` data files from `/data` to current ts output directory.
After that - server would be able to pickup the generated js files, so:
To run HTTP + UI do **both** things below:
- `npm run watch` in `./cient/`
- `npm run watch` in `./server/`

## Testing

`npm run test` for mocha tests written in `.ts`
`npm run coverage` to get coverage (BUG: does not work yet)

## Known issues

- VSCode or ts-node has a problem with big .ts files, in particular - from time to time `actions.colectiblePlus.ts` can loose lines randomly. So be very careful when you save it.
- zero coverage with Istanbul (nyc 11.0 bug, or just me doing something wrong)
- no unit tests exist (well there is one, just to prove ts + mocha work)
- lint is not fully configured yet
- auras and buffs are not yet fully implemented

For questions - ~~call me~~ create issue on github.

## To configure

- decks: edit `./classes/cardUniverse.ts` (yes, manually)
- e2e: edit `./main.ts` (yes, manually of course)
- abilities `./data/actions.collectiblePlus.ts` (not just manually, but also writing javascript in 9000+ lines of code file)

### Webstorm Users: To enable better automatic code style fixes install
jscs globally and enable the plugin in webstorm
https://www.themarketingtechnologist.co/how-to-get-airbnbs-javascript-code-style-working-in-webstorm/

## Legal Disclaimer

This project was not made for profit.
It's sole purpose is to explore and study software design and architecture approaches, using a complex business domain (hs game) as a model goal.
All data files and strings used are here for scientific and research purposes, as they create a constraints that system under development must meet.
If you believe you are the copyright holder of any assets here - feel free to open issue on github and i will contact you.
