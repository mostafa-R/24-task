# 🎙️ Next.js TTS (Text-to-Speech) Application

A modern, responsive web application that converts text to speech using Next.js 14 and ElevenLabs API. Features a clean interface with real-time voice synthesis capabilities and professional audio output.

## ✨ Features

- **Professional TTS**: High-quality voice synthesis using ElevenLabs API
- **Real-time Audio**: Instant text-to-speech conversion
- **Audio Controls**: Play, pause, seek, and volume controls
- **Download & Share**: Save audio files and share via link
- **Dark/Light Mode**: Toggle between themes
- **Responsive Design**: Works on desktop and mobile
- **Character Counter**: Real-time text statistics
- **Modern UI**: Built with Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager
- ElevenLabs API key (get from [elevenlabs.io](https://elevenlabs.io))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd 24-task
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:
   ```env
   ELEVENLABS_API_KEY=your_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Usage

### Web Interface

1. **Enter Text**: Type your message in the text area
2. **Convert**: Click "Convert to Voice" to generate speech
3. **Play**: Use the audio player to listen
4. **Download**: Save the audio as MP3
5. **Share**: Copy link or share directly

### API Usage

#### POST `/api/tts`

**Request:**
```bash
curl -X POST http://localhost:3000/api/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello, this is a test message"}'
```

**Response:** Audio file (MP3 format)

## 🏗️ Project Structure

```
24-task/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── tts/
│   │   │       └── route.js          # TTS API with ElevenLabs
│   │   ├── globals.css               # Global styles
│   │   ├── layout.js                 # Root layout
│   │   └── page.js                   # Main UI component
├── public/                           # Static assets
├── package.json                      # Dependencies
├── next.config.mjs                   # Next.js config
├── tailwind.config.js               # Tailwind config
└── README.md                        # This file
```

## 🎨 Customization

### Voice Selection
The app uses ElevenLabs voice ID `MFZUKuGQUsGJPQjTS4wC`. To change:
1. Update the voice ID in `src/app/api/tts/route.js`
2. Get voice IDs from [ElevenLabs dashboard](https://elevenlabs.io/app/voices)

### Styling
- Modify themes in `src/app/globals.css`
- Update Tailwind config in `tailwind.config.js`
- Colors defined in dark/light mode variables

## 🔧 Development

### Scripts
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm start` - Production server
- `npm run lint` - Code linting

### Environment Variables
```env
ELEVENLABS_API_KEY=your_api_key
```

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

- Create an issue for bugs
- Check existing issues before reporting
- Provide clear reproduction steps

---

**Built with ❤️ using Next.js 14, Tailwind CSS, and ElevenLabs API**
