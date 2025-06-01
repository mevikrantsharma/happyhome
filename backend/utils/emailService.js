const nodemailer = require('nodemailer');

/**
 * Email service for sending contact form submissions to the admin
 */
const sendContactEmail = async (contactData) => {
  try {
    console.log('Setting up email transporter with credentials...');
    
    // Important: For Gmail, you MUST use an App Password, not your regular password
    // This requires 2-step verification to be enabled on your Google account
    // Then generate an App Password at: https://myaccount.google.com/apppasswords
    
    // Create a transporter using Gmail with OAuth2
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD // This must be an App Password from Google
      },
      tls: {
        rejectUnauthorized: false // For testing only - remove in production
      }
    });
    
    // Format the message
    const { name, email, phone, message, service } = contactData;
    
    // Service display name
    const serviceDisplayName = formatServiceName(service);

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'maahive2628@gmail.com',
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #0f3460; border-bottom: 2px solid #0f3460; padding-bottom: 10px;">New Contact Form Submission</h2>
          
          <div style="margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Service:</strong> ${serviceDisplayName}</p>
          </div>
          
          <div style="background-color: #f7f7f7; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #0f3460;">Message:</h3>
            <p style="white-space: pre-line;">${message}</p>
          </div>
          
          <div style="font-size: 12px; color: #777; margin-top: 30px; border-top: 1px solid #e0e0e0; padding-top: 15px;">
            <p>This is an automated email from the Happy Home Renovation website contact form.</p>
          </div>
        </div>
      `
    };

    console.log('Attempting to send email to maahive2628@gmail.com...');
    
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Contact email sent successfully:', info.messageId);
    console.log('Full email response:', info);
    return true;
  } catch (error) {
    console.error('Error sending contact email:', error);
    return false;
  }
};

/**
 * Format service name for better readability
 */
const formatServiceName = (service) => {
  if (!service) return 'Not specified';
  
  // Map of service values to display names
  const serviceMap = {
    'kitchen': 'Kitchen Renovation',
    'bathroom': 'Bathroom Remodeling',
    'full-house': 'Full House Renovation',
    'basement': 'Basement Finishing',
    'addition': 'Home Addition',
    'other': 'Other'
  };
  
  return serviceMap[service] || service;
};

module.exports = {
  sendContactEmail
};
