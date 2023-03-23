export type TResultFile = {
  file?: File;
  result?: ProgressEvent<FileReader>;
};

export const readFileAsBinary = (file: File): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.readAsBinaryString(file)
  })
}

export const readFile = (file: File, onLoad: (r: TResultFile) => void) => {
  const reader = new FileReader()
  reader.onloadend = (result) => {
    onLoad({
      file,
      result
    })
  }
  reader.readAsDataURL(file)
}

export const loadScript = (url: string, id: string, callback?: () => void) => {
  const isExist = window.document.getElementById(id)
  if (isExist) {
    if (callback) callback()
  } else {
    const script = window.document.createElement('script')
    script.src = url
    script.id = id
    window.document.body.appendChild(script)
    script.onload = () => {
      if (callback) callback()
    }
  }
}
