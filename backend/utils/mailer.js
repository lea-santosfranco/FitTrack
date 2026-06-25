const nodemailer = require('nodemailer');

const isSmtpConfigured = () => !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);

const transporter = isSmtpConfigured()
  ? nodemailer.createTransport({
      host:   process.env.SMTP_HOST,
      port:   Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })
  : null;

const buildVerificationLink = (token) => {
  const base = process.env.FRONTEND_URL || 'http://localhost:3000';
  return `${base}/verify-email?token=${token}`;
};

// En l'absence de SMTP configuré (dev/démo), le lien est simplement loggé
// pour rester testable sans dépendre d'un compte email réel.
const sendVerificationEmail = async (to, token) => {
  const link = buildVerificationLink(token);

  if (!transporter) {
    console.log(`[mailer] SMTP non configuré — lien de vérification pour ${to} : ${link}`);
    return;
  }

  await transporter.sendMail({
    from:    process.env.SMTP_FROM || 'FitTrack <no-reply@fittrack.app>',
    to,
    subject: 'Vérifiez votre adresse email — FitTrack',
    text:    `Bienvenue sur FitTrack ! Cliquez sur ce lien pour vérifier votre adresse email : ${link}`,
    html:    `<p>Bienvenue sur FitTrack !</p><p><a href="${link}">Cliquez ici pour vérifier votre adresse email</a></p>`,
  });
};

module.exports = { sendVerificationEmail, buildVerificationLink };
