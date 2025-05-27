const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Store OTPs temporarily (in production, consider using Redis or another caching solution)
const otpStorage = {};

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// @desc    Generate and send OTP to email
// @route   POST /api/users/send-otp
// @access  Public
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    
    // Store OTP with timestamp (expires in 10 minutes)
    otpStorage[email] = {
      code: otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    };

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Happy Home Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #4a6da7;">Happy Home Verification</h2>
          <p>Thank you for signing up with Happy Home Renovation! Please use the following verification code to complete your registration:</p>
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 4px;">
            ${otp}
          </div>
          <p>This code will expire in 10 minutes for security reasons.</p>
          <p>If you did not request this code, please ignore this email.</p>
          <p style="margin-top: 30px; font-size: 12px; color: #777;">© ${new Date().getFullYear()} Happy Home Renovation. All rights reserved.</p>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'OTP sent to email successfully'
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send OTP. Please try again.'
    });
  }
};

// @desc    Verify OTP
// @route   POST /api/users/verify-otp
// @access  Public
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validate input
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        error: 'Email and OTP are required'
      });
    }

    // Check if OTP exists for email
    const storedOTPData = otpStorage[email];
    if (!storedOTPData) {
      return res.status(400).json({
        success: false,
        error: 'No OTP found for this email. Please request a new one.'
      });
    }

    // Check if OTP is expired
    if (new Date() > new Date(storedOTPData.expiresAt)) {
      // Clean up expired OTP
      delete otpStorage[email];
      
      return res.status(400).json({
        success: false,
        error: 'OTP has expired. Please request a new one.'
      });
    }

    // Verify OTP
    if (storedOTPData.code !== otp) {
      return res.status(400).json({
        success: false,
        error: 'Invalid OTP. Please try again.'
      });
    }

    // OTP verified successfully
    // Remove OTP from storage after successful verification
    delete otpStorage[email];

    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify OTP. Please try again.'
    });
  }
};
