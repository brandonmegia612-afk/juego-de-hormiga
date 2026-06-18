import { execFileSync } from 'node:child_process'
import { cpSync, existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const distDir = join(root, 'dist')
const deployDir = mkdtempSync(join(tmpdir(), 'hormiga-game-pages-'))
const repo = 'https://github.com/brandonmegia612-afk/juego-de-hormiga.git'

function git(args, cwd = root) {
  return execFileSync('git', args, { cwd, stdio: 'inherit' })
}

function gitOutput(args) {
  try {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim()
  } catch {
    return ''
  }
}

if (!existsSync(distDir)) {
  throw new Error('Missing dist directory. Run npm run build first.')
}

cpSync(distDir, deployDir, { recursive: true })
writeFileSync(join(deployDir, '.nojekyll'), '')

git(['init'], deployDir)
git(['checkout', '-b', 'gh-pages'], deployDir)
git(['config', 'user.name', gitOutput(['config', 'user.name']) || 'GitHub Pages'], deployDir)
git(['config', 'user.email', gitOutput(['config', 'user.email']) || 'pages@example.com'], deployDir)
git(['add', '-A'], deployDir)
git(['commit', '-m', 'Deploy to GitHub Pages'], deployDir)
git(['remote', 'add', 'origin', repo], deployDir)
git(['push', '-u', 'origin', 'gh-pages', '--force'], deployDir)
rmSync(deployDir, { recursive: true, force: true })
