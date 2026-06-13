import {
  getContactFromEmail,
  getContactToEmail,
  getResendClient,
} from './resendClient.mjs';

export async function notifyOnboardingSubmission({ submissionId, payload, filesMeta }) {
  const resend = getResendClient();
  const toEmail = process.env.ONBOARDING_ALERT_TO_EMAIL || getContactToEmail();
  const fromEmail = process.env.ONBOARDING_ALERT_FROM_EMAIL || getContactFromEmail();

  if (!resend || !toEmail || !fromEmail) {
    return { sent: false, reason: 'Email notifications not configured' };
  }

  const personal = payload?.personal || {};
  const financial = payload?.financial || {};
  const nominees = payload?.nominees || [];

  const fileList = filesMeta
    .map((f) => `${f.field}: ${f.originalName} (${Math.round((f.size || 0) / 1024)} KB)`)
    .join('\n');

  const html = `
    <h2>New onboarding submission</h2>
    <p><strong>Submission ID:</strong> ${submissionId}</p>
    <p><strong>Name:</strong> ${personal.fullName || '-'}</p>
    <p><strong>Email:</strong> ${personal.email || '-'}</p>
    <p><strong>Mobile:</strong> ${personal.mobile || '-'}</p>
    <p><strong>PAN:</strong> ${personal.pan || '-'}</p>
    <p><strong>Annual Income:</strong> ${financial.annualIncome || '-'}</p>
    <p><strong>Investment Type:</strong> ${financial.investmentType || '-'}</p>
    <p><strong>Nominees:</strong> ${nominees.length || 0}</p>
    <p><strong>Files uploaded:</strong> ${filesMeta.length}</p>
    <pre>${fileList || 'No files'}</pre>
  `;

  await resend.emails.send({
    from: fromEmail,
    to: toEmail,
    subject: `New onboarding submission - ${submissionId}`,
    html
  });

  return { sent: true };
}
