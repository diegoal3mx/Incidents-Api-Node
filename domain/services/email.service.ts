import nodemailer from 'nodemailer';
import { envs } from '../../src/config/envs.plugin';

interface mailOptions{
  to: string;
  subject: string;
  htmlBody: string;
}

export class EmailService{
  private transporter = nodemailer.createTransport({
    service: envs.MAIL_SERVICE,
    auth: {
    user: envs.MAIL_USER,
    pass: envs.MAIL_SECRET_KEY
    }
  });

  async sendEmail(options:mailOptions){
    try{
      const sentInformation = await this.transporter.sendMail({
      to:options.to,
      subject:options.subject,
      html: options.htmlBody});
      console.log(sentInformation)}
      catch(error){
        console.error(error);
      }

}
}