# Deferred Items — Phase 01

| Category | Item | Status | Found At |
|----------|------|--------|----------|
| Security | npm audit reporta 2 high (esbuild GHSA-gv7w-rqvm-qjhr / GHSA-g7r4-m6w7-qqqr), transitivo de vite@7.3.1. Afeta apenas o dev server (não build estático de produção). Fix exige vite@8 (breaking major) que quebra a versão pinada do plano e a paridade com lp-otc-mutual/lp-mutual-capital. Disposicionado `accept` no threat model (T-01-01). | Deferred (Rule 4 — version bump arquitetural; fora do escopo deste plano) | 2026-06-16 Task 1 |
