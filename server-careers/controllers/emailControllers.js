const expressAsyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
dotenv.config();

let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_MAIL, // generated ethereal user
    pass: process.env.SMTP_PASSWORD, // generated ethereal password
  },
});

const sendEmail = expressAsyncHandler(async (req, res) => {
  const { name, email, number, pdfFile, about, jobName } = req.body;
  console.log(name, email, number, pdfFile, about, jobName);

  // Convert the request body to a string
  // const dataString = JSON.stringify(req.body);
  const candiedData = `
    <!DOCTYPE html>
<html>
<head>
<style>
body {
  font-family: sans-serif;
  margin: 0;
  padding: 0;
}

h3 {
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 0.5em;
}

p {
  font-size: 1em;
  margin-bottom: 0.5em;
}

.container {
  width: 500px;
}
</style>
</head>
<body>
<div class="container">
  <h3>Name:</h3> <p>${name}</p><br>
  <h3>Email:</h3> <p>${email}</p><br>
  <h3>Phone Number:</h3> <p>${number}</p><br>
  <h3>Job Name:</h3> <p>${jobName}</p>
  <h3>About:</h3> <p>${about}</p><br>
</div>
</body>
</html>
`;

  const successMessage = `
   <html lang="en">
      <head>
        <meta charset="utf-8" />
        
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title></title>
        <link
          href="https://fonts.googleapis.com/css?family=Lato:300,400|Montserrat:700"
          rel="stylesheet"
          type="text/css"
        />
      <style>
    body {
      font-family: sans-serif;
    }

    h1 {
      text-align: center;
    }

    p {
      margin-bottom: 10px;
    }

    .quote {
      font-style: italic;
      margin-top: 20px;
    }

    .footer {
      text-align: right;
    }
  </style>
        <link
          rel="stylesheet"
          href="https://2-22-4-dot-lead-pages.appspot.com/static/lp918/min/default_thank_you.css"
        />
        <script src="https://2-22-4-dot-lead-pages.appspot.com/static/lp918/min/jquery-1.9.1.min.js"></script>
        <script src="https://2-22-4-dot-lead-pages.appspot.com/static/lp918/min/html5shiv.js"></script>
      </head>
      <body className="mt-16">
       <h1>Thank You For Apply</h1>

  <p>This is an exciting time in your career, and we are thrilled to have you join the AnyQuotes team. We know you have a lot to offer, and we are eager to see what you can accomplish.</p>

  <p>As you prepare for your new role, we encourage you to take some time to relax and recharge. This is your last chance to enjoy some downtime before you start your new job.</p>

  <p>When you start your new job, please be sure to come prepared to learn and grow. We have a lot of resources available to help you succeed, and we are always happy to answer your questions.</p>

  <p>We are confident that you will be a valuable asset to our team, and we look forward to working with you.</p>

  <p class="quote">"The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle." - Steve Jobs</p>

  <p class="footer">Best regards,<br>
  The AnyQuotes Team</p>
        <footer className="site-footer" id="footer">
          <p className="site-footer__fineprint" id="fineprint">
            © 2023 ANY QUOTES - All Right Reserved.
          </p>
        </footer>
      </body>
    </html>
    `;

  // Create an array of mail options, one for each recipient
  const mailOptions = [
    {
      from: "hr@anyquotes.co.uk",
      to: "hr@anyquotes.co.uk",
      // to: "delwerhossain006@gmail.com",
      subject: `Jobs Apply ${jobName}`,
      text: `AQ`,
      html: candiedData,
      attachments: [
        {
          filename: `${name}_CV.pdf`,
          path: `${pdfFile}`,
          contentType: "application/pdf",
        },
      ],
    },
    {
      from: "hr@anyquotes.co.uk",
      to: email,
      subject: `successfully applied on anyquotes `,
      text: `AQ`,
      html: successMessage,
    },
  ];

  try {
    // Send each email
    for (const mailOption of mailOptions) {
      transporter.sendMail(mailOption, function (error, info) {
        if (error) {
          console.log(error);
          res
            .status(500)
            .json({ acknowledged: false, error: "Error sending email" });
          throw error;
        } else {
          console.log("Email sent successfully to " + mailOption.to);
        }
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    // Respond to the client with success
    res.status(200).json({ acknowledged: true });
  }
});

module.exports = { sendEmail };
