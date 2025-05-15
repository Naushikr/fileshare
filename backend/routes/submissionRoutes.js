const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const upload = require('../middleware/upload');
const User = require('../models/User');
const logger = require('../logger'); // << Import logger

// POST /api/submit-file
router.post('/submit-file', upload.single('file'), async (req, res) => {
  const { userId, message, category1, category2 } = req.body;
  const file = req.file;
  const io = req.app.get('io'); 

  if (!file) {
    logger.warn('Submit-file failed: file missing');
    return res.status(400).json({ error: 'File missing' });
  }

  try {
    const submission = new Submission({
      userId,
      fileName: file.filename,
      message,
      category1,
      category2,
    });

    await submission.save();

    const user = await User.findById(userId).select('name');

    io.emit('new-submission', {
      ...submission._doc,
      sender_name: user ? user.name : 'Unknown'
    });

    logger.info('New submission saved by user %s, submissionId: %s', userId, submission._id);

    res.status(200).json(submission);
  } catch (err) {
    logger.error('Submit-file error: %o', err);
    res.status(500).json({ error: 'Submission failed' });
  }
});

// GET /api/my-submissions/:userId
router.get('/my-submissions/:userId', async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    logger.info('Fetched %d submissions for user %s', submissions.length, req.params.userId);
    res.json(submissions);
  } catch (err) {
    logger.error('Error fetching submissions for user %s: %o', req.params.userId, err);
    res.status(500).json({ error: 'Could not fetch submissions' });
  }
});

// GET /api/all-submissions
router.get('/all-submissions', async (req, res) => {
  try {
    const submissions = await Submission.find();

    // Attach user name to each submission
    const submissionsWithNames = await Promise.all(submissions.map(async (sub) => {
      const user = await User.findById(sub.userId).select('name');
      return {
        ...sub._doc,
        sender_name: user ? user.name : 'Unknown'
      };
    }));

    logger.info('Fetched all submissions: %d total', submissionsWithNames.length);
    res.json(submissionsWithNames);
  } catch (err) {
    logger.error('Failed to fetch all submissions: %o', err);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// PUT /api/update-status/:id
router.put('/update-status/:id', async (req, res) => {
  const { status, updatedBy } = req.body;
  const io = req.app.get('io');

  try {
    const updatedSubmission = await Submission.findByIdAndUpdate(
      req.params.id,
      { status, updatedBy },
      { new: true }
    );

    if (!updatedSubmission) {
      logger.warn('Update status failed: submission not found %s', req.params.id);
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Attach sender_name
    const user = await User.findById(updatedSubmission.userId).select('name');
    const submissionWithName = {
      ...updatedSubmission._doc,
      sender_name: user ? user.name : 'Unknown'
    };

    io.emit('status-updated', submissionWithName);

    logger.info('Submission %s status updated to %s by %s', req.params.id, status, updatedBy);

    res.json(submissionWithName);
  } catch (err) {
    logger.error('Status update failed for submission %s: %o', req.params.id, err);
    res.status(500).json({ error: 'Status update failed' });
  }
});

module.exports = router;
