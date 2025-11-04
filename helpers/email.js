import nodemailer from 'nodemailer';

const emailOlvidePassword=async(datos)=>{
    // Looking to send emails in production? Check out our Email API/SMTP product!
    const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
    });
    const {nombre,email,token}=datos;
    //enviar el email
    await transport.sendMail({
        from:'devJobs',
        to:email,
        subject:'Restablece tu password en devJobs',
        text:'Restablece tu password en devJobs',
        html:`
                <p>Hola ${nombre}, has solicitado restablecer tu password en devJobs</p>
                <p>Haz click en el siguiente enlace para generar un password nuevo:
                <a href="${process.env.BACKEND_URL}:${process.env.SERVER_PORT ?? 3000}/restablecer-password/${token}">Restablecer el password</a></p>
                <p>Si tu no solicitaste el cambio de password, puedes ignorar el mensaje</p>
        `
    });
}

export {
    emailOlvidePassword
}