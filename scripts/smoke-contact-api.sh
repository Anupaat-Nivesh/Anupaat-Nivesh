#!/usr/bin/env bash
# Smoke test contact email API (run after Vercel deploy + Resend env vars).
set -euo pipefail

API_BASE="${1:-https://anupaat-nivesh.vercel.app}"
ORIGIN="${2:-https://www.anupaatnivesh.com}"

echo "=== GET ${API_BASE}/api/contact/health ==="
curl -sS "${API_BASE}/api/contact/health" | tee /tmp/contact-health.json
echo ""

configured="$(python3 -c "import json; print(json.load(open('/tmp/contact-health.json')).get('configured', False))" 2>/dev/null || echo false)"
if [ "$configured" != "True" ] && [ "$configured" != "true" ]; then
  echo "WARN: configured is not true — set RESEND_API_KEY + CONTACT_ALERT_* on Vercel and redeploy."
fi

echo ""
echo "=== POST ${API_BASE}/api/contact/submit (dry run — set SMOKE_TEST_EMAIL to send) ==="
if [ -z "${SMOKE_TEST_EMAIL:-}" ]; then
  echo "Skip submit test (export SMOKE_TEST_EMAIL=you@example.com to run)."
  exit 0
fi

curl -sS -X POST "${API_BASE}/api/contact/submit" \
  -H "Content-Type: application/json" \
  -H "Origin: ${ORIGIN}" \
  -d "{\"formType\":\"contact\",\"firstName\":\"Smoke\",\"lastName\":\"Test\",\"email\":\"${SMOKE_TEST_EMAIL}\",\"phone\":\"+919501195200\",\"message\":\"API smoke test $(date -u +%Y-%m-%dT%H:%M:%SZ)\"}"
echo ""
