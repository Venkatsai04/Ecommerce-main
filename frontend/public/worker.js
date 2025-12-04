self.onmessage = (event) => {
  const file = event.data;
  if (!file) {
    self.postMessage({ error: 'No file received' });
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    const base64Data = reader.result.toString();
    self.postMessage({
      full: base64Data,
      raw: base64Data.split(',')[1],
      mime: file.type
    });
  };
  reader.onerror = (error) => self.postMessage({ error: error.message });
  reader.readAsDataURL(file);
};