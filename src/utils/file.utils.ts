export async function loadBinaryFromFile(
  file: File
): Promise<ArrayBuffer | null> {
  if (file == null) {
    return null;
  }

  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(new Error("Unable to read"));
    reader.readAsArrayBuffer(file);
  });
}

export async function loadBinaryFromURL(url: string) {
  const resp = await fetch(url);
  return await resp.arrayBuffer();
}
