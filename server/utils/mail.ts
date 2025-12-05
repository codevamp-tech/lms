import path from "path";
import dotenv from "dotenv";
import mailjet from "node-mailjet";

// Load .env manually (useful on local but Render uses dashboard env vars)
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Debug Render environment values
console.log("🔍 DEBUG: Current NODE_ENV =", process.env.NODE_ENV);
console.log("🔍 DEBUG: Render environment variables loaded:");
console.log("  MJ_APIKEY_PUBLIC:", process.env.MJ_APIKEY_PUBLIC ? "✔ Loaded" : "❌ Missing");
console.log("  MJ_PRIKEY_PRIVATE:", process.env.MJ_PRIKEY_PRIVATE ? "✔ Loaded" : "❌ Missing");
console.log("  SENDER_EMAIL:", process.env.SENDER_EMAIL || "❌ Missing");

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

// Send email function with logs
export const sendMail = async ({ to, name, subject, html }: SendEmailParams) => {
    console.log("📧 DEBUG: Preparing to send email...");
    console.log("  To:", to);
    console.log("  Subject:", subject);
    console.log("  Using Sender Email:", process.env.SENDER_EMAIL);

    try {
        const res = await client.post("send", { version: "v3.1" }).request({
            Messages: [
                {
                    From: {
                        Email: process.env.SENDER_EMAIL,
                        Name: "Mr English Academy",
                    },
                    To: [{ Email: to, Name: name }],
                    Subject: subject,
                    HTMLPart: html,
                },
            ],
        });

        console.log("✅ DEBUG: Raw Mailjet response object:", res);
        console.log(
            "✅ DEBUG: Mailjet response body:",
            JSON.stringify(res.body, null, 2)
        );
        return res;
    } catch (error: any) {
        console.error("❌ ERROR sending email:", error?.statusCode, error?.message);
        console.error("❌ Full error:", JSON.stringify(error, null, 2));
        throw error;
    }
};
