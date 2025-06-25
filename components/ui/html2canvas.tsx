import html2canvas from 'html2canvas'

export const downloadCardImage = async (element: HTMLElement, filename: string) => {
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: null,
    })

    const link = document.createElement('a')
    link.download = filename
    link.href = canvas.toDataURL('image/png')
    link.click()
  } catch (error) {
    console.error('Error downloading card image:', error)
  }
}
