import path from 'node:path'
import fs from 'node:fs'

const CURRENT_DIR = process.cwd()

export function getDirectoryPath(dir: string) {
  return path.join(CURRENT_DIR, dir)
}


export type GetDirectoryFilesOptions = {
  recursive?: boolean
  extensions?: string[]
  /**
   * if true, will read file content
   */
  isReadFile?: boolean
}

export type GetDirectoryFile = {
  path: string
  name: string
  ext: string
  content?: string | null
}

/**
 * scan directory and return all files
 * @param dir directory path
 * @param options options
 * @returns 
 */
export async function getDirectoryFiles(dir: string, options?: GetDirectoryFilesOptions) {
  const { recursive = false, extensions = [], isReadFile } = options || {}
  const directoryPath = getDirectoryPath(dir)
  const fileList: GetDirectoryFile[] = []

  const matchSet = new Set(extensions.map(ext => ext.toLowerCase()))

  async function scanDirectory(currentPath: string) {
    const files = await fs.promises.readdir(currentPath, { withFileTypes: true })
    
    for (const file of files) {
      const filePath = path.join(currentPath, file.name)
      
      if (file.isDirectory() && recursive) {
        await scanDirectory(filePath)
      } else if (file.isFile()) {
        const ext = path.extname(file.name).toLowerCase()
        if (matchSet.size === 0 || matchSet.has(ext)) {
          fileList.push({
            path: filePath,
            name: path.basename(file.name, ext),
            ext: ext,
            content: isReadFile ? await getFileContent(filePath) : undefined,
          })
        }
      }
    }
  }

  await scanDirectory(directoryPath)
  return fileList
}

/**
 * get file content
 * @param filePath file path
 */
export async function getFileContent(filePath: string) {
  try {
    const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(CURRENT_DIR, filePath)
    const content = await fs.promises.readFile(absolutePath, 'utf8')
    return content
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error)
    return null
  }
}
