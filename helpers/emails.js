import nodemailer from 'nodemailer';

export const emailRegister = async(data) => {
    const { email, nombre, token } = data;

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const info = await transport.sendMail({
        from: 'UpTasks Admin <noreply@uptasks.com>',
        to: email,
        subject: 'UpTasks - Confirmar email',
        text: `Hola ${nombre}, por favor confirma tu email:`,
        html: `
            <p>Hola ${nombre}, por favor confirma tu email dando click al siguiente enlace:</p>

            <a href="${process.env.FRONTEND_URL}/confirm-account/${token}">Confirm Email</a>

            <p>Si tu no hiciste esta solicitud, ignora este mensaje.</p>
        `
    });
}


export const emailForgetPassword = async(data) => {
    const { email, nombre, token } = data;

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const info = await transport.sendMail({
        from: 'UpTasks Admin <noreply@uptasks.com>',
        to: email,
        subject: 'UpTasks - Reestablece tu password',
        text: `Hola ${nombre}, has solicitado reestablecer password.:`,
        html: `
            <p>Hola ${nombre}, has solicitado reestablecer password. Has click en el siguiente enlace:</p>
            <a href="${process.env.FRONTEND_URL}/forget-password/${token}">Reestablecer Password</a>

            <p>Si tu no hiciste esta solicitud, ignora este mensaje.</p>
        `
    });
}