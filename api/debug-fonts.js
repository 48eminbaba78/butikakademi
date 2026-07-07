import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const cwd = process.cwd();
  const dirContents = (dir) => {
    try {
      return fs.readdirSync(dir);
    } catch (e) {
      return e.message;
    }
  };

  const results = {
    cwd,
    root: dirContents(cwd),
    api: dirContents(path.join(cwd, 'api')),
    fonts: dirContents(path.join(cwd, 'fonts')),
    apiFonts: dirContents(path.join(cwd, 'api/fonts')),
    regularFontCwd: fs.existsSync(path.join(cwd, 'fonts/Roboto-Regular.ttf')),
    regularFontApi: fs.existsSync(path.join(cwd, 'api/fonts/Roboto-Regular.ttf')),
  };

  return res.status(200).json(results);
}
