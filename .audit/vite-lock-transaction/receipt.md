## regenerate_lock
```text

up to date, audited 163 packages in 8s

52 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```
exit_code: 0

## locked_install
```text
npm warn deprecated whatwg-encoding@3.1.1: Use @exodus/bytes instead for a more spec-conformant and faster implementation

added 124 packages, and audited 125 packages in 3s

33 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```
exit_code: 0

## behavior_tests
```text

> megaminds-pdf@0.2.0 test:ci
> vitest run


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/runner/work/megaminds-pdf/megaminds-pdf[39m

 [32m✓[39m src/App.test.jsx [2m([22m[2m4 tests[22m[2m)[22m[32m 131[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m4 passed[39m[22m[90m (4)[39m
[2m   Start at [22m 10:17:32
[2m   Duration [22m 978ms[2m (transform 112ms, setup 93ms, import 208ms, tests 131ms, environment 408ms)[22m

```
exit_code: 0

## production_build
```text

> megaminds-pdf@0.2.0 build
> vite build

[36mvite v8.1.5 [32mbuilding client environment for production...[36m[39m
[2Ktransforming...✓ 54 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                        0.67 kB │ gzip:   0.40 kB
dist/assets/Black–Scholes_equation-uNZqdi33.pdf      444.81 kB
dist/assets/pdf.worker.min-qwK7q_zL.mjs            1,046.21 kB
dist/assets/index-BIqzo9VF.css                        10.65 kB │ gzip:   2.57 kB
dist/assets/index-CRmfg50U.js                        564.17 kB │ gzip: 170.91 kB

[32m✓ built in 250ms[39m
[33m[plugin builtin:vite-reporter] 
(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.[39m
```
exit_code: 0

## production_audit
```text

> megaminds-pdf@0.2.0 audit:prod
> npm audit --omit=dev --audit-level=high

found 0 vulnerabilities
```
exit_code: 0

transaction_status: VERIFIED
source_commit: 043b619ef6bde75b6443019122b3979b7d3147dd
node_version: v22.12.0
npm_version: 10.9.0
