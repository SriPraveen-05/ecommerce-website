// middleware/sendMail.js
import { createTransport } from "nodemailer";

const sendMail = async (email, subject, text) => {
    try {
        // Config
        const transport = createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.GMAIL,
                pass: process.env.GPASS,
            }
        });

        // Send mail
        await transport.sendMail({
            from: process.env.GMAIL,
            to: email,
            subject,
            text,
        });

        console.log(`Email sent to ${email}`);
    } catch (error) {
        console.error(`Error sending email to ${email}: ${error.message}`);
        throw new Error("Failed to send email");
    }
};

export default sendMail;
