import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
    host: this.configService.get<string>('SMTP_HOST'),
    port: 465,
    secure:true,
      auth: {
        user: this.configService.get<string>('SMTP_EMAIL'),
        pass: this.configService.get<string>('SMTP_PASSWORD'),
        
      },
    });
  }

  async sendMail({
    to,
    subject,
    html,
    text,
    ...rest
  }: {
    to: string;
    subject: string;
    html?: string;
    text?: string;
    [key: string]: any;
  }): Promise<any> {
    const mailOptions = {
      from: this.configService.get<string>('SMTP_EMAIL'),
      to,
      subject,
      html,
      text,
      ...rest,
    };
    return this.transporter.sendMail(mailOptions);
  }
}
