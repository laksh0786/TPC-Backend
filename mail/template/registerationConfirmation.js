exports.registerationConfirmationEmail = (name) => {
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>User Registration Confirmation</title>
        <style>
            body {
                background-color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                color: #333333;
                margin: 0;
                padding: 0;
            }
    
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }
    
            .logo {
                max-width: 200px;
                margin-bottom: 20px;
            }
    
            .message {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
            }
    
            .body {
                font-size: 16px;
                margin-bottom: 20px;
            }
    
            .cta {
                display: inline-block;
                padding: 10px 20px;
                background-color: #FFD60A;
                color: #000000;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
                font-weight: bold;
                margin-top: 20px;
            }
    
            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 20px;
            }
    
            .highlight {
                font-weight: bold;
            }
        </style>
    
    </head>
    
    <body>
        <div class="container">
            <a href="#"><img class="logo" src="https://images.shiksha.com/mediadata/images/1617363431phpq5x9PO.jpeg"
                    alt="Logo"></a>
            <div class="message">User Registration Confirmation</div>
            <div class="body">
                <p>Dear ${name},</p>
                <p>You have successfully registered to the website.We
                    are excited to have you as a participant!</p>
                <p>Please log in to your learning dashboard to access the features and start your journey.
                </p>
                <a class="cta" href="#">Go to Dashboard</a>
            </div>
            <div class="support">If you have any questions or need assistance, please feel free to reach out to us at <a
                    href="mailto:lakshay.bansal198@gmail.com">info@mrsptu.com</a>. We are here to help!</div>
        </div>
    </body>
    
    </html>`;
  };