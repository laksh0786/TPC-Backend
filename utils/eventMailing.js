const schedule = require('node-schedule');
const ClubEvent = require('../model/clubEventSchema');


// Function to send reminder email to a single attendee
async function sendReminderEmail(attendee, event) {

    const { name, email } = attendee;

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: `Reminder: Upcoming Event - ${event.name}`,
        text: `Dear ${name},\n\nThis is a friendly reminder that the event "${event.name}" will be taking place today at ${event.time}.\n\nWe look forward to seeing you there!\n\nBest regards,\nYour Event Team`,
        html: `<p>Dear ${name},</p><p>This is a friendly reminder that the event "${event.name}" will be taking place today at ${event.time}.</p><p>We look forward to seeing you there!</p><p>Best regards,<br>Your Event Team</p>`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Reminder email sent to ${name} (${email}): ${info.response}`);
    } catch (error) {
        console.error(`Error sending reminder email to ${name} (${email}):`, error);
    }
}


// Function to schedule sending reminder emails for an event
async function scheduleReminderEmails() {

    //finding all the events
    const events = await ClubEvent.find().populate('eventAttendees');

    //loop through each event
    for (const event of events) {

        // Schedule sending reminder emails on the event day
        schedule.scheduleJob(new Date(event.eventDate), async () => {
            for (const attendee of event.eventAttendees) {
                await sendReminderEmail(attendee, event);
            }
            console.log(`All reminder emails sent for event: ${event.name}`);
        });

    }

}

