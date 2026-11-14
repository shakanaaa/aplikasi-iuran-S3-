# S3 AI DEVELOPER CONSTITUTION

Read and follow this file before making any changes.

## 1. Core Principles
- Only implement requested features and necessary dependencies.
- Do not invent features or requirements.
- Do not duplicate existing functionality.
- Do not create unnecessary files, classes, components, abstractions, or dependencies.
- Preserve existing working functionality.
- Prefer the simplest maintainable solution.
- Never claim completion without verification.

## 2. Before Coding
- Read project instructions and inspect the existing structure.
- Inspect composer.json, package.json, migrations, models, and related code.
- Check git status, current branch, and recent commits.
- Identify existing implementations before creating new ones.
- Identify affected modules and potential regressions.
- Make a concise plan for significant changes.

## 3. Technology
- Backend: Laravel / PHP.
- Frontend: React / TypeScript.
- Integration: Inertia.js.
- Database: MySQL.
- Styling: Tailwind CSS.
- Excel: Laravel Excel.
- PWA: Vite PWA.
- Do not replace established technologies without explicit approval.

## 4. Laravel Rules
- Follow Laravel conventions and PSR-12.
- Use Form Requests for request validation.
- Keep controllers focused.
- Put reusable business logic in Services when justified.
- Use Eloquent and parameterized queries.
- Avoid N+1 queries.
- Use database transactions for financial and bulk operations.
- Protect mass assignment.
- Use migrations for schema changes.
- Never run destructive migrations on important databases without approval.

## 5. React and TypeScript Rules
- Use strict TypeScript.
- Avoid any unless explicitly justified.
- Reuse existing components.
- Avoid unnecessary useEffect and state.
- Handle loading, empty, and error states.
- Keep payment secrets and business-critical logic on the backend.
- Do not use dummy data as a production substitute.
- Maintain responsive and consistent UI.

## 6. S3 Business Rules
- Daily contribution: Rp1,000 per school day.
- Friday is excluded.
- Additional holidays are configurable.
- No manual payment date selection.
- Allocate payments to the oldest unpaid school day.
- Cash and QRIS share one transaction and calendar system.
- QRIS requires verified gateway webhooks.
- Prevent duplicate payment processing.
- Preserve prepaid balances.
- Preserve student payment history after graduation.
- students.id is the internal student identity; no separate student identifier is stored.
- Student full_name is not unique; duplicate names are resolved through admin account identification/activation.
- Student login uses full name + password.
- Excel import columns: nama_lengkap, kode_jurusan, kode_kelas, tanggal_masuk; student IDs are generated automatically.
- Class promotion must preserve academic history.
- Class promotion must support exclusions and validation.

## 7. Database Rules
- Use foreign keys, unique constraints, and suitable indexes.
- Preserve financial records.
- Use integer rupiah amounts or suitable DECIMAL fields.
- Prevent duplicate daily savings and duplicate payment references.
- Do not use student names as foreign keys.
- Do not delete historical data casually.
- Use transactions for bulk academic operations.

## 8. Security
- Hash passwords with bcrypt.
- Enforce authorization on the backend.
- Protect student-specific resources against IDOR.
- Validate all requests.
- Verify payment gateway webhooks.
- Keep secrets in environment variables.
- Never commit .env or credentials.
- Record important administrative operations.

## 9. Dependencies
- Inspect existing packages before installing.
- Install only necessary, compatible, maintained libraries.
- Never duplicate package functionality.
- Do not upgrade all dependencies to solve an isolated issue.
- Explain significant dependency changes.

## 10. Debugging
- Reproduce the issue.
- Inspect the actual error and stack trace.
- Find the root cause.
- Make the smallest safe fix.
- Test the fix.
- Never hide errors, disable validation, or delete tests to make a build pass.

## 11. Testing
Run relevant tests before completion:
- php artisan test
- vendor/bin/pint --test
- npx tsc --noEmit
- npm run build
- npm run lint (if configured)
- npm run test (if configured)

Do not claim a test passed unless it actually ran successfully.
Inspect package.json before assuming scripts exist.

## 12. Git
Before work:
- git status
- git branch --show-current
- git log -5 --oneline

Never overwrite uncommitted user changes.
Never run git reset --hard or git clean -fd without explicit approval.
Use descriptive Conventional Commits:
feat, fix, refactor, style, docs, test, perf, chore.
Keep commits focused.
Never commit secrets, local databases, debug files, or unrelated changes.

## 13. Push and Pull Requests
Push only when explicitly requested or previously authorized for the current scope.
Before pushing:
- Inspect git status and git diff.
- Run relevant tests.
- Inspect staged files.
- Verify no secrets are included.
- Verify no unrelated user changes are included.

Never force push, rewrite shared history, change remotes, delete remote branches, or merge to main without explicit approval.
Verify the remote result after pushing.

## 14. Deployment
Deployment requires separate explicit approval.
Back up production data.
Review migrations.
Verify production environment and HTTPS.
Never expose credentials.
Never execute destructive production operations without approval.

## 15. Strict Prohibitions
- No unnecessary features.
- No duplicate files or components.
- No unnecessary dependencies.
- No destructive database commands.
- No unapproved technology changes.
- No silent business rule changes.
- No unverified payment operations.
- No fabricated test results.
- No unapproved Git push, force push, merge, or deployment.

## 16. Completion Report
Report:
1. Work completed.
2. Important files changed.
3. Database changes.
4. Tests executed and actual results.
5. Git branch and commit status.
6. Remaining issues or required approval.

Keep reports concise.

## 17. Workflow
INSPECT -> ANALYZE -> PLAN -> IMPLEMENT -> TEST -> REVIEW -> REPORT -> COMMIT (if authorized) -> PUSH (if authorized) -> DEPLOY (separately authorized).

If a requirement is ambiguous and affects data integrity, security, or financial behavior, ask before making assumptions.

Do not sacrifice correctness for speed.