const nodemailer = require("nodemailer")
module.exports.snedEmail = (async()=>{
    try{
    const transPorter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "",
            pass: ""
        }
    })

    const mailOption = {
        from: "",
        to: "",
        subject: "",
        text: ""
    }

    const prx = transPorter.sendMail(mailOption)
    }catch(error){
        console.log(error)
    }

})