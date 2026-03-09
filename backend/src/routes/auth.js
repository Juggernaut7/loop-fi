const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { env } = require('../config/env');
const router = express.Router();

// X (Twitter) OAuth Routes
router.get('/x', (req, res) => {
  try {
    // Generate code verifier and challenge for PKCE
    const codeVerifier = Math.random().toString(36).substring(2, 15) + 
                        Math.random().toString(36).substring(2, 15);
    const codeChallenge = Buffer.from(codeVerifier).toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    
    // Store verifier in session for callback
    req.session.codeVerifier = codeVerifier;
    
    const xAuthUrl = new URL('https://twitter.com/i/oauth2/authorize');
    xAuthUrl.searchParams.append('response_type', 'code');
    xAuthUrl.searchParams.append('client_id', env.xClientId);
    xAuthUrl.searchParams.append('redirect_uri', `${env.frontendUrl}/api/auth/x/callback`);
    xAuthUrl.searchParams.append('scope', 'tweet.read users.read offline.access');
    xAuthUrl.searchParams.append('state', Math.random().toString(36).substring(7));
    xAuthUrl.searchParams.append('code_challenge', codeChallenge);
    xAuthUrl.searchParams.append('code_challenge_method', 'S256');
    
    res.redirect(xAuthUrl.toString());
  } catch (error) {
    console.error('X OAuth initiation error:', error);
    res.redirect(`${env.frontendUrl}/login?error=oauth_failed`);
  }
});

router.get('/x/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    
    if (!code) {
      throw new Error('No authorization code received');
    }

    // Exchange code for access token
    const tokenResponse = await axios.post('https://api.twitter.com/2/oauth2/token', {
      code,
      client_id: env.xClientId,
      client_secret: env.xClientSecret,
      redirect_uri: `${env.frontendUrl}/api/auth/x/callback`,
      grant_type: 'authorization_code',
      code_verifier: req.session.codeVerifier
    });

    const { access_token, refresh_token } = tokenResponse.data;

    // Get user info from X
    const userResponse = await axios.get('https://api.twitter.com/2/users/me', {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });

    const { id, username, name } = userResponse.data.data;

    // Generate JWT token for LoopFi
    const token = jwt.sign(
      { 
        xId: id, 
        username, 
        name 
      },
      env.jwtSecret,
      { expiresIn: '30d' }
    );

    // Redirect to frontend with token
    res.redirect(`${env.frontendUrl}/auth/callback?token=${token}&user=${username}`);

  } catch (error) {
    console.error('X OAuth callback error:', error);
    res.redirect(`${env.frontendUrl}/login?error=oauth_failed`);
  }
});

// Wallet-based authentication endpoint
router.post('/wallet', async (req, res) => {
  try {
    const { walletAddress, signature, message } = req.body;

    if (!walletAddress || !signature || !message) {
      return res.status(400).json({ error: 'Missing wallet authentication data' });
    }

    // Generate JWT token for wallet
    const token = jwt.sign(
      { walletAddress },
      env.jwtSecret,
      { expiresIn: '30d' }
    );

    res.json({
      message: 'Wallet authenticated successfully',
      token,
      walletAddress
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Traditional Email/Password Login
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      env.jwtSecret,
      { expiresIn: '7d' }
    );

    // Return user data and token
    const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      isVerified: user.isVerified,
      isActive: user.isActive,
      profilePicture: user.profilePicture,
      notificationPreferences: user.notificationPreferences,
      preferences: user.preferences,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt
    };

    res.json({
      message: 'Login successful',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not
      return res.json({ message: 'If an account with this email exists, a reset link has been sent' });
    }

    // Generate reset token (in production, send via email)
    const resetToken = jwt.sign(
      { userId: user._id, email: user.email },
      env.jwtSecret,
      { expiresIn: '1h' }
    );

    // For now, just return the token (in production, send via email)
    res.json({
      message: 'Password reset link sent to your email',
      resetToken, // Remove this in production
      userId: user._id
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Verify token
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Hash new password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    user.passwordHash = passwordHash;
    await user.save();

    res.json({ message: 'Password reset successful' });

  } catch (error) {
    console.error('Reset password error:', error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout (client-side token removal)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    // Get user ID from JWT token (middleware will handle this)
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const user = await User.findById(userId).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({ 
        success: true, 
        message: 'If an account with that email exists, a password reset link has been sent.' 
      });
    }

    // Generate reset token
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save reset token to user
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetTokenExpires;
    await user.save();

    // Send reset email
    try {
      await emailService.sendPasswordResetEmail(email, resetToken, user.firstName);
      console.log(`✅ Password reset email sent to ${email}`);
    } catch (emailError) {
      console.error('❌ Failed to send password reset email:', emailError);
      // Don't fail the request if email fails
    }

    res.json({ 
      success: true, 
      message: 'If an account with that email exists, a password reset link has been sent.' 
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 
