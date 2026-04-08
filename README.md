# 🍺 Botequim — Gestão de Conta de Bar

🇧🇷 [Português](#português) | 🇺🇸 [English](#english)

---

## Português

Aplicativo web progressivo (PWA) para gerenciar contas de bar de forma simples e rápida, direto no celular, sem precisar instalar nada.

### ✨ Funcionalidades

- Abertura de conta com nome do bar ou restaurante
- Adição de itens com nome, quantidade e preço
- Edição e remoção de itens
- Cálculo automático de couvert e gorjeta (10%)
- Compartilhamento da conta via WhatsApp
- Histórico de contas anteriores com detalhe e reenvio
- Funciona offline (PWA com Service Worker)
- Dados salvos localmente no dispositivo

### 🚀 Como usar

1. Acesse o app pelo navegador ou instale como PWA
2. Digite o nome do bar para abrir uma conta
3. Adicione os itens consumidos
4. Compartilhe a conta pelo WhatsApp quando quiser
5. Ao encerrar, clique em **Limpar** — a conta vai para o histórico

### 🛠️ Tecnologias

- HTML, CSS e JavaScript puro
- Tailwind CSS (via CDN)
- Font Awesome
- LocalStorage para persistência
- Service Worker para funcionamento offline

### 📁 Arquivos

| Arquivo | Descrição |
|---|---|
| `index.html` | Aplicação principal |
| `sw.js` | Service Worker para cache offline |
| `manifest.json` | Configuração PWA |
| `icon.png` | Ícone do app |
| `bar-bg.webp` | Imagem de fundo do modal inicial |

### ⚖️ Licença

© 2024. Todos os direitos reservados. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## English

A Progressive Web App (PWA) to manage bar tabs quickly and easily, straight from your phone, no installation required.

### ✨ Features

- Open a tab with the bar or restaurant name
- Add items with name, quantity and price
- Edit and remove items
- Automatic cover charge and tip (10%) calculation
- Share the tab via WhatsApp
- History of previous tabs with detail view and resend
- Works offline (PWA with Service Worker)
- Data saved locally on the device

### 🚀 How to use

1. Open the app in your browser or install it as a PWA
2. Enter the bar name to open a tab
3. Add the items consumed
4. Share the tab via WhatsApp whenever you want
5. When done, tap **Clear** — the tab is saved to history

### 🛠️ Technologies

- Plain HTML, CSS and JavaScript
- Tailwind CSS (via CDN)
- Font Awesome
- LocalStorage for data persistence
- Service Worker for offline support

### 📁 Files

| File | Description |
|---|---|
| `index.html` | Main application |
| `sw.js` | Service Worker for offline cache |
| `manifest.json` | PWA configuration |
| `icon.png` | App icon |
| `bar-bg.webp` | Background image for the initial modal |

### ⚖️ License

© 2024. All rights reserved. See the [LICENSE](LICENSE) file for details.
