import nodemailer from 'nodemailer';

export const emailRegister = async(data) => {
    const { email, nombre, token } = data;

    const transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "975a71180b912a",
            pass: "da2cd1de8d2776"
        }
    });

    const info = await transport.sendMail({
        from: 'UpTasks Admin <noreply@uptasks.com>',
        to: email,
        subject: 'UpTasks - Confirm your email',
        text: `Hi ${nombre}, please confirm your email by clicking on the link below:`,
        html: `
            <p>Hi ${nombre}, please confirm your email by clicking on the link below:</p>

            <a href="${process.env.FRONTEND_URL}/confirm-account/${token}">Confirm Email</a>

            <p>If you did not request this email, please ignore it.</p>
        `
    });
}