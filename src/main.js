import { createApp } from 'vue'
import App from './App.vue'
import './styles.css'

createApp(App).mount('#app')

const vlibrasScript = document.createElement('script')
vlibrasScript.src = 'https://vlibras.gov.br/app/vlibras-plugin.js'
vlibrasScript.async = true
vlibrasScript.onload = () => {
  if (window.VLibras) new window.VLibras.Widget('https://vlibras.gov.br/app')
}
document.body.appendChild(vlibrasScript)
