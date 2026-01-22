import nodemailer from "nodemailer";

/**
 * Sends an email using Gmail SMTP
 * @param to - Recipient email address
 * @param subject - Email subject
 * @param html - HTML content of the email
 * @returns Promise that resolves when email is sent
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
): Promise<void> {
  // Validate email configuration
  if (
    !process.env.EMAIL_USER ||
    !process.env.EMAIL_PASSWORD ||
    !process.env.EMAIL_FROM
  ) {
    throw new Error(
      "Email configuration is missing. Please set EMAIL_USER, EMAIL_PASSWORD, and EMAIL_FROM environment variables.",
    );
  }

  // Create transporter using Gmail SMTP
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Email options
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: to,
    subject: subject,
    html: html,
  };

  // Send email
  console.log(`[sendEmail] Attempting to send email to: ${to}`);
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(
      "[sendEmail] Email sent successfully. MessageId:",
      info.messageId,
    );
  } catch (error) {
    console.error("[sendEmail] Failed to send email:", error);
    throw error;
  }
}

/**
 * Generates HTML for password reset email
 * @param resetLink - The password reset link
 * @returns HTML string
 */
export function generateResetEmailHTML(resetLink: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden;">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🔐 Password Reset Request</h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="font-size: 16px; color: #333333; line-height: 1.6; margin: 0 0 20px 0;">
                    Hello Admin,
                  </p>
                  
                  <p style="font-size: 16px; color: #333333; line-height: 1.6; margin: 0 0 20px 0;">
                    We received a request to reset your password for <strong>The Kind Travel</strong> admin panel.
                  </p>
                  
                  <p style="font-size: 16px; color: #333333; line-height: 1.6; margin: 0 0 30px 0;">
                    Click the button below to reset your password:
                  </p>
                  
                  <!-- Button -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding: 20px 0;">
                        <a href="${resetLink}" 
                           style="display: inline-block; padding: 15px 40px; background-color: #667eea; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">
                          Reset Password
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="font-size: 14px; color: #666666; line-height: 1.6; margin: 20px 0;">
                    Or copy and paste this link into your browser:
                  </p>
                  
                  <p style="font-size: 12px; color: #667eea; background-color: #f8f9fa; padding: 15px; border-radius: 5px; word-break: break-all; margin: 0 0 20px 0;">
                    ${resetLink}
                  </p>
                  
                  <p style="font-size: 14px; color: #d63031; line-height: 1.6; margin: 20px 0 10px 0;">
                    <strong>⚠️ Important:</strong> This link will expire in 1 hour.
                  </p>
                  
                  <p style="font-size: 14px; color: #666666; line-height: 1.6; margin: 0;">
                    If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                  <p style="font-size: 12px; color: #999999; margin: 0;">
                    © 2025 The Kind Travel. All rights reserved.
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * Generates HTML for password change confirmation email
 * @param name - Admin's name
 * @returns HTML string
 */
export function generatePasswordChangeEmailHTML(name: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden;">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🔒 Password Changed</h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="font-size: 16px; color: #333333; line-height: 1.6;">
                    Hello ${name || "Admin"},
                  </p>
                  
                  <p style="font-size: 16px; color: #333333; line-height: 1.6;">
                    This is a confirmation that your password for <strong>The Kind Travel</strong> admin panel was successfully changed.
                  </p>

                  <p style="font-size: 15px; color: #555555; line-height: 1.6;">
                    If you did not initiate this change, please reset your password immediately or contact our support team.
                  </p>

                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding: 30px 0;">
                        <a href="${
                          process.env.APP_URL || "https://thekindtravel.com"
                        }/reset-password"
                           style="display: inline-block; padding: 15px 40px; background-color: #667eea; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">
                          Reset Password
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="font-size: 14px; color: #666666;">
                    For your security, we recommend changing your password regularly and keeping your account credentials private.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                  <p style="font-size: 12px; color: #999999; margin: 0;">
                    © 2025 The Kind Travel. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * Generates HTML for profile update notification email
 * @param name - Admin's name
 * @param changes - List of changes made
 * @returns HTML string
 */
export function generateProfileUpdateEmailHTML(
  name: string,
  changes: { field: string; old: string; new: string }[],
): string {
  const changesList = changes
    .map(
      (change) => `
      <li style="margin-bottom: 10px;">
        <strong>${change.field}:</strong> Changed from <span style="background-color: #ffebee; padding: 2px 5px; border-radius: 3px; text-decoration: line-through;">${change.old}</span> to <span style="background-color: #e8f5e9; padding: 2px 5px; border-radius: 3px;">${change.new}</span>
      </li>
    `,
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden;">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px;">👤 Profile Updated</h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="font-size: 16px; color: #333333; line-height: 1.6;">
                    Hello ${name || "Admin"},
                  </p>
                  
                  <p style="font-size: 16px; color: #333333; line-height: 1.6;">
                    Your admin profile details have been successfully updated. Here is a summary of the changes:
                  </p>
                  
                  <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0;">
                    <ul style="margin: 0; padding-left: 20px; color: #555555; font-size: 15px;">
                      ${changesList}
                    </ul>
                  </div>

                  <p style="font-size: 15px; color: #555555; line-height: 1.6;">
                    If you did not make these changes, please contact support immediately.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                  <p style="font-size: 12px; color: #999999; margin: 0;">
                    © 2025 The Kind Travel. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * Generates HTML for email change notification email
 * @param name - Admin's name
 * @param oldEmail - The previous email address
 * @param newEmail - The new email address
 * @returns HTML string
 */
export function generateEmailChangeEmailHTML(
  name: string,
  oldEmail: string,
  newEmail: string,
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden;">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%); padding: 40px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px;">📧 Email Address Updated</h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="font-size: 16px; color: #333333; line-height: 1.6;">
                    Hello ${name || "Admin"},
                  </p>
                  
                  <p style="font-size: 16px; color: #333333; line-height: 1.6;">
                    Your administrative email address for <strong>The Kind Travel</strong> has been successfully updated.
                  </p>
                  
                  <div style="background-color: #f8f9fa; border-left: 4px solid #d4af37; padding: 20px; margin: 20px 0;">
                    <p style="margin: 0 0 10px 0; color: #555555; font-size: 15px;">
                      <strong>Old Email:</strong> <span style="text-decoration: line-through; opacity: 0.6;">${oldEmail}</span>
                    </p>
                    <p style="margin: 0; color: #555555; font-size: 15px;">
                      <strong>New Email:</strong> <span style="color: #0c6b58; font-weight: bold;">${newEmail}</span>
                    </p>
                  </div>

                  <p style="font-size: 15px; color: #555555; line-height: 1.6;">
                    From now on, please use your <strong>new email</strong> to log in to the admin panel.
                  </p>

                  <p style="font-size: 14px; color: #666666; margin-top: 30px;">
                    If you did not authorized this change, please contact our security team immediately.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                  <p style="font-size: 12px; color: #999999; margin: 0;">
                    © 2025 The Kind Travel. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
