const nodemailer = require('nodemailer');

// SendGrid API key
const sendgridApiKey = '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';

class EmailVerification {
  constructor() {
    // Use the API Key provided by SendGrid
    this.transporter = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: 'apikey', // This is fixed as 'apikey'
        pass: sendgridApiKey, // Load the API key using environment variables
      },
    });
  }

  // Generate a random 6-digit verification code
  generateVerificationCode() {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    return code;
  }

  // Send email
  sendVerificationEmail(toEmail, subject, text, callback) {
    // Generate verification code
    const verificationCode = this.generateVerificationCode();

    // Email content
    const mailOptions = {
      from: 'verify@mathscichem.com',
      to: toEmail,
      subject: subject,
      html: `<p>${text}: <span style="font-weight: bold;">${verificationCode}</span></p>`,
    };

    // Send email
    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        callback(error);
      } else {
        console.log('Message sent: %s', info.messageId);
        callback(null, verificationCode);
      }
    });
  }
}

// Export EmailVerification object
module.exports = new EmailVerification();
