import * as nodemailer from "nodemailer";

export class Email {
  constructor(protected email: string, protected token: string) {
    this.email = email;
    this.token = token;
  }
  public createTransport() {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
  }

  public async sendEmail() {
    return await this.createTransport().sendMail({
      from: process.env.GMAIL_USER!,
      to: this.email,
      subject: "Verification signin",
      html: `<b>please click this <a href="http://localhost:4000/api/v1/auth/confirmation/${this.token}">link</a> to activation account</b>`,
    });
  }
}
