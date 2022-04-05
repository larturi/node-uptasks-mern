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

    // TODO: Ocultar en variables de entorno
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
        subject: 'UpTasks - Reestablece tu password',
        text: `Hola ${nombre}, has solicitado reestablecer password.:`,
        html: `
            <p>Hola ${nombre}, has solicitado reestablecer password. Has click en el siguiente enlace:</p>
            <a href="${process.env.FRONTEND_URL}/forget-password/${token}">Reestablecer Password</a>

            <p>Si tu no hiciste esta solicitud, ignora este mensaje.</p>
        `
    });
}