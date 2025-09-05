// utils/mailer.js
import nodemailer from 'nodemailer';

let transporterPromise = null; // singleton

export async function getMailer() {
  if (transporterPromise) return transporterPromise;

  transporterPromise = (async () => {
    const { SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_PORT } = process.env;
    const hasRealSmtp = SMTP_HOST && SMTP_USER && SMTP_PASS;

    if (hasRealSmtp) {
      return nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT || 587),
        secure: Number(SMTP_PORT) === 465, // 465=SSL，其它端口用 STARTTLS
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      });
    }

    // Dev fallback: 动态创建 Ethereal 账号
    const testAccount = await nodemailer.createTestAccount();
    console.log('[mailer] Using Ethereal account:', testAccount.user, testAccount.pass);

    return nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
  })();

  return transporterPromise;
}

export async function sendMail({ to, subject, html, text }) {
  const transporter = await getMailer();
  const info = await transporter.sendMail({
    from: process.env.MAIL_FROM || 'UoN Events <no-reply@uon-events.test>',
    to,
    subject,
    html,
    text,
  });

  // 开发期（Ethereal）给出预览链接
  const preview = nodemailer.getTestMessageUrl?.(info);
  if (preview) console.log('[mailer] Preview URL:', preview);

  return info;
}
