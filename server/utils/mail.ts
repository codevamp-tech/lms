import path from "path";
import dotenv from "dotenv";
import mailjet from "node-mailjet";

// Load .env (works when running from any folder)
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Debug env
console.log(
    "email envs...",
    process.env.MJ_APIKEY_PUBLIC,
    process.env.MJ_PRIKEY_PRIVATE
);

// Create Mailjet client
const client = mailjet.apiConnect(
    process.env.MJ_APIKEY_PUBLIC as string,
    process.env.MJ_PRIKEY_PRIVATE as string
);

// Type for function parameters
interface SendEmailParams {
    to: string;
    name: string;
    subject: string;
    html: string;
}

// Send email function
export const sendMail = ({
    to,
    name,
    subject,
    html,
}: SendEmailParams) => {
    return client.post("send", { version: "v3.1" }).request({
        Messages: [
            {
                From: {
                    Email: process.env.SENDER_EMAIL,
                    Name: "Mr English Academy",
                },
                To: [
                    {
                        Email: to,
                        Name: name,
                    },
                ],
                Subject: subject,
                HTMLPart: html,
            },
        ],
    });
};
