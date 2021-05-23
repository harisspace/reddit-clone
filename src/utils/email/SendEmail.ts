import * as nodemailer from "nodemailer";

export class Email {
  constructor(protected email: string, protected token: string) {
    this.email = email;
    this.token = token;
    this.sendEmail(email, token);
  }
  protected createTransport() {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
  }

  protected async sendEmail(email: string, token: string) {
    await this.createTransport().sendMail({
      from: process.env.GMAIL_USER!,
      to: email,
      subject: "Verification signin",
      html: `<b>please click this <a href="http://localhost:4000/api/v1/auth/confirmation/${token}">link</a> to activation account</b>`,
    });
  }
}
