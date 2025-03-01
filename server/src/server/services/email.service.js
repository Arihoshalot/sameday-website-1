import nodemailer from "nodemailer";
import ejs from "ejs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { htmlToText } from "html-to-text";
import juice from "juice";
import config from "../config/config.js";
import moment from "moment";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const createTransporter = async () => {
  let transporter;
  if (process.env.NODE_ENV === "production") {
    transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      auth: config.email.auth,
    });
  } else {
    transporter = nodemailer.createTransport({
      host: "localhost",
      port: 25,
      auth: {
        user: "admin@localhost",
        pass: "admin",
      },
    });
  }

  return transporter;
};

const sendEmail = async (to, subject, text, templateName, templateVars, from = "") => {
  // templates are stored in the server/src/server/templates folder
  const templatePath = path.join(__dirname, `../templates/${templateName}.html`);
  if (templateName && fs.existsSync(templatePath)) {
    const template = fs.readFileSync(templatePath, "utf8");
    const html = ejs.render(template, templateVars);
    text = htmlToText(html);
    text = juice(html);

    const transporter = await createTransporter();
    const mailOptions = {
      from: config.email.from,
      to,
      subject,
      text,
      html,
    };
    await transporter.sendMail(mailOptions);
  } else {
  }
};

const sendNotifyEmail = async (subject = "", text = {}, type) => {
  let templateVars = {};
  switch (type) {
    case "NEW USER":
      subject = "New user Registered";
      templateVars = {
        ...text
      };
      break;
    case "NEW ORDER":
      subject = `New Order placed #${text.orderNumber}`;
      templateVars = {
        orderNumber: text.orderNumber,
        orderTotal: text.orderTotal,
        orderDate: moment(text.orderDate).format("DD-MMM-YY"),
        orderItems: text.orderItems,
        userName: text.userId.name,
        userEmail: text.userId.email,
        userPhone: text.userId.phone_number,
        userAddress: text.userId.address,
        userAddress2: text.userId.country + " " + text.userId.state + " " + text.userId.zip,
        homeService: text.homeService,
      };
      break;
    case "NEW APPOINTMENT":
      subject = `New Appointment #${text.appNumber}`;
      templateVars = {
        appNumber: text.appNumber,
        appDate: moment(text.date).format("DD-MMM-YY"),
        appTime: text.time,
        appService: text.department,
        appUser: text.patient.name,
        appUserEmail: text.patient.email,
        appUserPhone: text.patient.phone_number,
        appUserAddress: text.patient.address,
        appUserAddress2: text.patient.country + " " + text.patient.state + " " + text.patient.zip,
        appUserNotes: text.comment,
        docName: text.doctor.full_name,
        docEmail: text.doctor.email,
        docPhone: text.doctor.phone_number,
      }
      break;
    default:
      subject = "New user Registered";
  }
  const to = process.env.NODE_ENV === "production" ? config.email.from : "admin@localhost.com";
  const template = type.toLowerCase().split(" ").join("-");

  await sendEmail(to, subject, "", template, templateVars);
};

const sendResetPasswordEmail = async (to, token, origin) => {
  const subject = "Reset password";
  // replace this url with the link to the reset password page of your front-end app
  const resetLink = `${origin}/reset-password?token=${token}`;
  const templateVars = {
    emailAddress: to,
    resetLink,
  };
  await sendEmail(to, subject, "", "reset-password", templateVars);
};

const sendVerificationEmail = async (to, token) => {
  const subject = "Email Verification";
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `http://localhost:5000/api/v1/auth/verify-email?token=${token}`;
  const text = `Dear user,
  <button>Verify Email</button>
  To verify your email, click on this link: ${verificationEmailUrl}
  If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

const sendContactEmail = async (subject, text) => {
  const templateVars = {
    message: text.message,
    name: text.name,
  };
  const to = process.env.NODE_ENV === "production" ? config.email.from : "admin@localhost.com";
  await sendEmail(to, subject, text, "contact-email", templateVars, text.email);
};

export const emailService = {
  sendEmail,
  sendNotifyEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendContactEmail,
};
