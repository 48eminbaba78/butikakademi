import { isAuthed, publishDue } from '../lib/core.js';
import { applyCors } from '../lib/cors.js';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (!isAuthed(req)) return res.status(401).json({ error: 'Yetkisiz' });

  if (req.query && req.query.debug === '1') {
    const cwd = process.cwd();
    const dirContents = (dir) => {
      try {
        return fs.readdirSync(dir);
      } catch (e) {
        return e.message;
      }
    };
    return res.status(200).json({
      cwd,
      root: dirContents(cwd),
      fonts: dirContents(path.join(cwd, 'fonts')),
      apiFonts: dirContents(path.join(cwd, 'api/fonts')),
      regularFontCwd: fs.existsSync(path.join(cwd, 'fonts/Roboto-Regular.ttf')),
      regularFontApi: fs.existsSync(path.join(cwd, 'api/fonts/Roboto-Regular.ttf')),
    });
  }

  try {
    var id = req.query && req.query.id ? req.query.id : null;
    var results = await publishDue({ id: id });
    return res.status(200).json({ processed: results.length, results: results });
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) });
  }
}
