const nodemailer = require("nodemailer")

module.exports.snedEmail = (async(obj)=>{
    try{
    const transPorter = await nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }
    })

    const mailOption = {
        from: process.env.SMTP_FROM_MAIL,
        to: obj.email,
        subject: obj.subject,
        text: obj.message
    }

    const prx = await transPorter.sendMail(mailOption)
    }catch(error){
        console.log(error)
        throw error
    }

})