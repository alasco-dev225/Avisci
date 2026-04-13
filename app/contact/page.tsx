export default function Contact() {
  return (
    <div style={{ backgroundColor: '#ffffff' }} className="min-h-screen">

      {/* Header */}
      <div style={{ backgroundColor: '#1B2B4B' }} className="py-12 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Contactez-nous</h1>
        <p style={{ color: '#aab4c8' }} className="text-lg">On est là pour vous aider 😊</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-16 space-y-8">

        {/* Infos contact */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">

          <a href="mailto:avisci225@hotmail.com"
            className="flex items-center gap-4 p-4 rounded-xl hover:opacity-80 transition"
            style={{ backgroundColor: '#F8F7F4' }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
              style={{ backgroundColor: '#1B2B4B' }}>
              📧
            </div>
            <div>
              <p className="font-semibold" style={{ color: '#1B2B4B' }}>Email</p>
              <p className="text-sm" style={{ color: '#6B6560' }}>avisci225@hotmail.com</p>
            </div>
          </a>

          <a href="https://wa.me/2250711260591"
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-xl hover:opacity-80 transition"
            style={{ backgroundColor: '#F8F7F4' }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
              style={{ backgroundColor: '#25D366' }}>
              📱
            </div>
            <div>
              <p className="font-semibold" style={{ color: '#1B2B4B' }}>WhatsApp</p>
              <p className="text-sm" style={{ color: '#6B6560' }}>+225 07 11 26 05 91</p>
            </div>
          </a>

          <a href="https://www.facebook.com/avisci225/"
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-xl hover:opacity-80 transition"
            style={{ backgroundColor: '#F8F7F4' }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
              style={{ backgroundColor: '#1877F2' }}>
              📘
            </div>
            <div>
              <p className="font-semibold" style={{ color: '#1B2B4B' }}>Facebook</p>
              <p className="text-sm" style={{ color: '#6B6560' }}>facebook.com/avisci225</p>
            </div>
          </a>

        </div>

        {/* Horaires */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="font-bold text-lg mb-4" style={{ color: '#1B2B4B' }}>🕐 Disponibilité</h2>
          <p className="text-sm" style={{ color: '#6B6560' }}>Lundi — Vendredi : 8h00 - 18h00</p>
          <p className="text-sm mt-1" style={{ color: '#6B6560' }}>Samedi : 9h00 - 13h00</p>
          <p className="text-sm mt-1" style={{ color: '#6B6560' }}>Réponse WhatsApp sous 24h</p>
        </div>

      </div>
    </div>
  )
}