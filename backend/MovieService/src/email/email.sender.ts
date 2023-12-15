import nodemailer, { SentMessageInfo } from "nodemailer";
import { Response } from "express";
import dotenv from "dotenv";
import CustomResponse from "../utils/custom.response";
dotenv.config();

export const emailSend = (
  to: string,
  subject: string,
  text: string,
  res: Response
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.ADMIN_PASSWORD,
    },
  });
  var mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: to,
    subject: subject,
    text: text,
  };
  transporter.sendMail(
    mailOptions,
    (err: Error | null, info: SentMessageInfo) => {
      if (err) {
        console.log(err);
        return new CustomResponse(
          null,
          "An error occurred while sending email"
        ).error500(res);
      } else {
        console.log("Email is sent to " + info);
      }
    }
  );
};
