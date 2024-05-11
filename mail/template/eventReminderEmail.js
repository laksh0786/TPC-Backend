exports.eventReminderEmail = (recipientName, eventName, eventDate, eventDetails, clubName) => {
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Event Reminder</title>
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
        </style>
    </head>
    <body>
        <div class="container">
            <a href="#"><img class="logo" src="https://images.shiksha.com/mediadata/images/1617363431phpq5x9PO.jpeg" alt="Logo"></a>
            <div class="message">Event Reminder</div>
            <div class="body">
                <p>Dear ${recipientName},</p>
                <p>Just a friendly reminder that the event, "${eventName}", organized by ${clubName}, is happening tomorrow!</p>
                <p>The event will take place on <strong>${eventDate}</strong>.</p>
                <p>Event Details: ${eventDetails}</p>
                <a class="cta" href="#">View Event</a>
            </div>
            <div class="support">If you have any questions or need assistance, please feel free to reach out to us at <a href="mailto:lakshay.bansal198@gmail.com">info@mrsptu.com</a>. We are here to help!</div>
        </div>
    </body>
    </html>`;
};
