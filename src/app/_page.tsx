import ContactForm from '../components/ContactForm';

export default function Home() {
  const services = [
    { title: 'Instalasi Jaringan Fisik', desc: 'Penarikan kabel struktur (Cat6/Fiber Optic), perapihan Rack Server, hingga instalasi Access Point indoor maupun outdoor.' },
    { title: 'Konsultasi & Desain Topologi', desc: 'Perancangan arsitektur jaringan baru yang aman, reliable, dan mudah di-scale sesuai perkembangan bisnis Anda.' },
    { title: 'Optimasi & Troubleshooting', desc: 'Analisis jaringan lambat, konfigurasi routing/VLAN (Mikrotik, Cisco, Ubiquiti), bandwidth management, dan penanganan celah keamanan.' },
  ];

  return (
    <main className="bg-slate-50 min-h-screen text-slate-800">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-24 px-6 text-center border-b border-slate-800">
        <div className="max-w-4xl mx-auto">
          <span className="bg-blue-500/10 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full border border-blue-500/20 uppercase tracking-wider">
            Network Architecture & Deployment Specialist
          </span>
          <h1 className="text-4xl md:text-6xl font-black mt-4 mb-6 tracking-tight leading-tight">
            Infrastruktur Jaringan Handal, <br />Bisnis Tanpa Hambatan.
          </h1>
          <p className="text-lg md:text-xl mb-10 text-slate-400 max-w-2xl mx-auto font-light">
            Kami menyediakan jasa instalasi profesional, manajemen perangkat routing-switching, hingga audit performa jaringan untuk korporasi, kantor, dan ISP.
          </p>
          <a href="#contact" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-8 rounded-xl text-md transition duration-200 shadow-lg shadow-blue-600/20">
            Konsultasikan Masalah Jaringan Anda
          </a>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900">Solusi Network End-to-End</h2>
          <p className="text-slate-500 mt-2">Layanan komprehensif dari perancangan fisik hingga konfigurasi logic.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((svc, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition duration-200">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-bold text-lg mb-6">
                0{idx + 1}
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">{svc.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{svc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-slate-100 px-6 border-t border-slate-200">
        <ContactForm />
      </section>
    </main>
  );
}