# Developer run & debug notes

This file contains quick commands to run the dev server and gather logs for debugging.

1) Ensure you have a local `.env.local` in the repo root (do NOT commit it).

2) Install dependencies (one-time):
```powershell
cd "C:\Users\Dell\LUXERA AGENCY"
npm install
```

3) Start the dev server and capture logs to `dev.log`:
```powershell
.\scripts\run-dev-log.ps1
```

4) After the script runs (or after reproducing the error), open `dev.log` and paste its contents here so I can inspect.

5) Quick check endpoints (once server is running):
- Health: `http://localhost:3000/api/debug/health` — shows whether key env vars are present (does not reveal their values).
- OpenAI test: `http://localhost:3000/api/test-openai`

Security reminders:
- Revoke any API key you accidentally posted publicly and generate a new one.
- Never paste secrets into chat. Share only logs and error traces (they are safe).
