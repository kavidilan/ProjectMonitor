Please do not commit `node_modules` to this repository.

Why:
- `node_modules` contains installed dependencies that are platform-specific and large.
- Committing it bloats the repository and can exceed GitHub's file size limits.

How to work safely:
- Ensure `node_modules/` is listed in `.gitignore` (already done).
- Use `npm install` or `npm ci` locally to restore dependencies.
- If you need large binary assets, use Git LFS or external storage.

If you accidentally commit large files, contact the repo owner before force-pushing history rewrites.
