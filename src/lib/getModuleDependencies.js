import fs from 'fs'
import path from 'path'
import resolve from 'resolve'
import detective from 'detective'

function createModule (file) {
  const source = fs.readFileSync(file, 'utf-8')
  const requires = detective(source)

  return { file, requires }
}

/**
 * @description 分析用户配置文件中的本地依赖（排除了node_modules文件夹）
 * @param {object} entryFile 用户配置tailwind.config.js内容
 * @returns {array=[localConfigDep,...localDeps]}
 */
export default function getModuleDependencies (entryFile) {
  const rootModule = createModule(entryFile)
  const modules = [rootModule]

  // Iterate over the modules, even when new
  // ones are being added
  for (const mdl of modules) {
    mdl.requires
      .filter(dep => {
        // Only track local modules, not node_modules
        return dep.startsWith('./') || dep.startsWith('../')
      })
      .forEach(dep => {
        try {
          const basedir = path.dirname(mdl.file)
          const depPath = resolve.sync(dep, { basedir })
          const depModule = createModule(depPath)

          modules.push(depModule)
        } catch (_err) {
          // eslint-disable-next-line no-empty
        }
      })
  }

  return modules
}
