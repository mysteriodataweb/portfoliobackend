import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendContactEmail = async ({ name, email, subject, message }) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "fredbiam9@gmail.com",
    replyTo: email,
    subject: `[Portfolio] ${subject || "Nouveau message de contact"}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f4ee; border-radius: 16px;">
        <h2 style="color: #171717; margin-bottom: 20px;">Nouveau message de contact</h2>
        <div style="background-color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
          <p style="margin: 0 0 10px 0;"><strong style="color: #171717;">Nom :</strong> <span style="color: #6B6B6B;">${name}</span></p>
          <p style="margin: 0 0 10px 0;"><strong style="color: #171717;">Email :</strong> <span style="color: #6B6B6B;">${email}</span></p>
          ${subject ? `<p style="margin: 0 0 10px 0;"><strong style="color: #171717;">Sujet :</strong> <span style="color: #6B6B6B;">${subject}</span></p>` : ""}
        </div>
        <div style="background-color: white; padding: 20px; border-radius: 12px;">
          <p style="margin: 0 0 10px 0;"><strong style="color: #171717;">Message :</strong></p>
          <p style="color: #6B6B6B; white-space: pre-wrap; margin: 0;">${message}</p>
        </div>
        <p style="color: #6B6B6B; font-size: 12px; margin-top: 20px; text-align: center;">
          Envoyé depuis le formulaire de contact de votre portfolio
        </p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};
