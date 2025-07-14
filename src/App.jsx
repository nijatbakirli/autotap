import React, { useState, useEffect } from 'react';
import { MapPin, Search, Wrench, Car, ShieldCheck, Star, ChevronLeft, ChevronRight, Menu, X, SlidersHorizontal, DollarSign, Mail, Lock, User, Settings, List, LogOut, Heart, Upload, FileText, Calendar, Type, Info, BarChart2, Edit, Trash2, Phone, PlusCircle, CheckCircle, Users, Briefcase, MessageSquare, ShieldOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- ДАННЫЕ ДЛЯ ДЕМОНСТРАЦИИ (будут заменены на API вызовы) ---

const popularServicesData = [
  { name: 'Выездной шиномонтаж', icon: Wrench, image: 'https://placehold.co/600x400/1a202c/718096?text=Шиномонтаж' },
  { name: 'Компьютерная диагностика', icon: Car, image: 'https://placehold.co/600x400/2d3748/a0aec0?text=Диагностика' },
  { name: 'Детейлинг и химчистка', icon: Star, image: 'https://placehold.co/600x400/4a5568/e2e8f0?text=Детейлинг' },
  { name: 'Замена масла', icon: Wrench, image: 'https://placehold.co/600x400/718096/1a202c?text=Замена+масла' },
];

const advantagesData = [
  { title: 'Проверенные специалисты', description: 'Каждый исполнитель проходит строгую проверку документов и навыков.', icon: ShieldCheck },
  { title: 'Безопасная сделка', description: 'Оплата резервируется и переводится исполнителю только после вашего подтверждения.', icon: ShieldCheck },
  { title: 'Гарантия качества', description: 'Мы предоставляем гарантию на все выполненные работы через наш сервис.', icon: ShieldCheck },
  { title: 'Экономия времени', description: 'Мастер приедет сам, куда и когда вам удобно. Больше не нужно ждать в очередях.', icon: ShieldCheck },
];

const catalogServicesData = [
    { id: 1, name: 'Срочный шиномонтаж 24/7', provider: 'MobileTire Pro', rating: 4.9, reviews: 124, price: 35, currency: '$', image: 'https://placehold.co/600x400/1a202c/718096?text=Service+1' },
    { id: 2, name: 'Полная диагностика двигателя', provider: 'Engine Masters', rating: 4.8, reviews: 89, price: 80, currency: '$', image: 'https://placehold.co/600x400/2d3748/a0aec0?text=Service+2' },
    { id: 3, name: 'Премиум детейлинг кузова', provider: 'Shiny Auto', rating: 5.0, reviews: 210, price: 150, currency: '$', image: 'https://placehold.co/600x400/4a5568/e2e8f0?text=Service+3' },
    { id: 4, name: 'Замена масла и фильтров', provider: 'Quick Lube', rating: 4.7, reviews: 301, price: 50, currency: '$', image: 'https://placehold.co/600x400/718096/1a202c?text=Service+4' },
];

const orderHistoryData = [
    { id: 'AT7C3B', serviceName: 'Полная диагностика двигателя', provider: 'Engine Masters', date: '2024-06-15', amount: 80, status: 'Выполнен', image: 'https://placehold.co/600x400/2d3748/a0aec0?text=Service+2' },
    { id: 'AT9A1D', serviceName: 'Выездной шиномонтаж', provider: 'MobileTire Pro', date: '2024-05-28', amount: 45, status: 'Выполнен', image: 'https://placehold.co/600x400/1a202c/718096?text=Service+1' },
    { id: 'ATF8E2', serviceName: 'Детейлинг и химчистка', provider: 'Shiny Auto', date: '2024-04-12', amount: 180, status: 'Отменен', image: 'https://placehold.co/600x400/4a5568/e2e8f0?text=Service+3' },
];

const clientDemoData = {
    name: 'Иван Петров', type: 'client', email: 'ivan.petrov@example.com', phone: '+7 (926) 123-45-67', avatarUrl: 'https://placehold.co/256x256/E2E8F0/4A5568?text=IP',
    cars: [ { id: 1, make: 'Toyota', model: 'Camry', year: 2021, plate: 'A123BC777' }, { id: 2, make: 'BMW', model: 'X5', year: 2022, plate: 'X456YZ199' } ],
    favoriteProviders: [ { id: 1, name: 'MobileTire Pro', specialty: 'Шиномонтаж', rating: 4.9, avatarUrl: 'https://placehold.co/100x100/1A202C/4A5568?text=MTP' }, { id: 2, name: 'Shiny Auto', specialty: 'Детейлинг', rating: 5.0, avatarUrl: 'https://placehold.co/100x100/2D3748/E2E8F0?text=SA' } ]
};

const partnerDemoData = {
    name: 'MobileTire Pro', type: 'partner', email: 'contact@mobiletire.pro', avatarUrl: 'https://placehold.co/256x256/1A202C/A0AEC0?text=MTP',
    services: [ { id: 1, name: 'Срочный шиномонтаж 24/7', price: 35, status: 'Активна', orders: 42, rating: 4.9 }, { id: 2, name: 'Замена тормозных колодок', price: 60, status: 'На модерации', orders: 0, rating: 0 } ]
};

const adminDemoData = { name: 'Admin', type: 'admin', email: 'admin@autotap.com', avatarUrl: 'https://placehold.co/256x256/4299E1/FFFFFF?text=A' };

// --- ОСНОВНЫЕ КОМПОНЕНТЫ ПРИЛОЖЕНИЯ ---

function ServiceCard({ service, index }) {
  return (
    <motion.div className="relative rounded-xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
      <img src={service.image} alt={service.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 p-6">
        <div className="bg-blue-500/80 backdrop-blur-sm p-2 rounded-full inline-block mb-3"><service.icon className="w-6 h-6 text-white" /></div>
        <h3 className="text-white text-xl font-bold">{service.name}</h3>
      </div>
    </motion.div>
  );
}

function AdvantagesSlider() {
  const [current, setCurrent] = useState(0);
  const nextSlide = () => setCurrent(prev => (prev === advantagesData.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrent(prev => (prev === 0 ? advantagesData.length - 1 : prev - 1));
  useEffect(() => { const slideInterval = setInterval(nextSlide, 5000); return () => clearInterval(slideInterval); }, []);
  const IconComponent = advantagesData[current].icon;
  return (
    <div className="relative w-full max-w-4xl mx-auto mt-12">
      <div className="overflow-hidden relative min-h-[12rem] rounded-2xl bg-gray-800/50 backdrop-blur-sm p-8 flex items-center">
        <AnimatePresence mode="wait">
          <motion.div key={current} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.5 }} className="w-full flex flex-col items-center text-center">
            <IconComponent className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-2xl font-bold text-white">{advantagesData[current].title}</h3>
            <p className="text-gray-200 mt-2 max-w-md">{advantagesData[current].description}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <button onClick={prevSlide} className="absolute top-1/2 left-0 md:-left-12 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"><ChevronLeft className="w-6 h-6 text-white" /></button>
      <button onClick={nextSlide} className="absolute top-1/2 right-0 md:-right-12 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"><ChevronRight className="w-6 h-6 text-white" /></button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">{advantagesData.map((_, i) => (<div key={i} onClick={() => setCurrent(i)} className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-300 ${current === i ? 'bg-blue-500 w-4' : 'bg-gray-500'}`} />))}</div>
    </div>
  );
}

function Header({ onNavigate, user, isHomePage }) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(!isHomePage);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    if (isHomePage) {
      window.addEventListener('scroll', handleScroll);
      handleScroll();
      return () => window.removeEventListener('scroll', handleScroll);
    } else { setIsScrolled(true); }
  }, [isHomePage]);
  const navLinks = [ { name: 'Найти сервис', page: 'catalog' }, { name: 'О нас', page: 'about' } ];
  const handleNavClick = (page) => { onNavigate(page); setMobileMenuOpen(false); };
  const headerClasses = `fixed top-0 left-0 w-full z-50 py-4 px-4 sm:px-8 transition-all duration-300 ${isScrolled ? 'bg-gray-900/70 backdrop-blur-lg border-b border-gray-800/50' : 'bg-transparent'}`;
  return (
    <header className={headerClasses}>
      <div className="container mx-auto flex justify-between items-center">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="text-white text-3xl font-bold tracking-wider cursor-pointer" onClick={() => onNavigate('home')}>Auto<span className="text-blue-500">Tap</span></motion.div>
        <nav className="hidden md:flex items-center space-x-8">{navLinks.map((link, i) => (<motion.button key={link.name} onClick={() => handleNavClick(link.page)} className="text-gray-200 hover:text-white transition-colors duration-300" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}>{link.name}</motion.button>))}</nav>
        <div className="hidden md:flex items-center space-x-4">
          {user ? (<motion.button onClick={() => onNavigate(user.type === 'admin' ? 'admin' : (user.type === 'partner' ? 'partner-profile' : 'profile'))} className="flex items-center gap-2 text-gray-200 hover:text-white transition-colors" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}><User className="w-5 h-5 bg-blue-500/50 text-white p-1 rounded-full" /><span>{user.type === 'admin' ? 'Админ' : (user.type === 'partner' ? 'Панель' : 'Профиль')}</span></motion.button>
          ) : (
            <>
              <motion.button onClick={() => onNavigate('login')} className="text-gray-200 hover:text-white transition-colors" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>Войти</motion.button>
              <motion.button onClick={() => onNavigate('partner-signup')} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>Стать партнёром</motion.button>
            </>
          )}
        </div>
        <div className="md:hidden"><button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="text-white z-50 relative">{isMobileMenuOpen ? <X className="w-7 h-7"/> : <Menu className="w-7 h-7"/>}</button></div>
      </div>
      <AnimatePresence>{isMobileMenuOpen && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-gray-900/90 backdrop-blur-xl z-40 md:hidden"><motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="flex flex-col items-center justify-center h-full"><nav className="flex flex-col items-center space-y-6">{navLinks.map(link => (<button key={link.name} onClick={() => handleNavClick(link.page)} className="text-gray-200 hover:text-white text-2xl font-semibold">{link.name}</button>))}</nav><div className="mt-10 pt-6 border-t border-gray-700 w-4/5 flex flex-col items-center space-y-4">{user ? (<button onClick={() => handleNavClick(user.type === 'admin' ? 'admin' : (user.type === 'partner' ? 'partner-profile' : 'profile'))} className="text-gray-200 hover:text-white text-2xl font-semibold">Профиль</button>) : (<><button onClick={() => handleNavClick('login')} className="text-gray-200 hover:text-white text-2xl font-semibold">Войти</button><button onClick={() => handleNavClick('partner-signup')} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors w-full max-w-xs text-lg">Стать партнёром</button></>)}</div></motion.div></motion.div>)}</AnimatePresence>
    </header>
  );
}

function Footer({ onNavigate }) {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-12 px-4 sm:px-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-gray-300">
        <div className="md:col-span-1">
          <h3 onClick={() => onNavigate('home')} className="text-2xl font-bold text-white cursor-pointer w-max">Auto<span className="text-blue-500">Tap</span></h3>
          <p className="mt-4">Сервис, который всегда под рукой.</p>
        </div>
        <div>
          <h4 className="font-bold text-lg text-white">Навигация</h4>
          <ul className="mt-4 space-y-2">
            <li><button onClick={() => onNavigate('home')} className="hover:text-blue-400 transition-colors text-left cursor-pointer">Главная</button></li>
            <li><button onClick={() => onNavigate('catalog')} className="hover:text-blue-400 transition-colors text-left cursor-pointer">Каталог</button></li>
            <li><button onClick={() => onNavigate('partner-signup')} className="hover:text-blue-400 transition-colors text-left cursor-pointer">Партнёрство</button></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg text-white">Поддержка</h4>
          <ul className="mt-4 space-y-2">
            <li><a href="#" className="hover:text-blue-400 transition-colors cursor-pointer">FAQ</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors cursor-pointer">Связаться с нами</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors cursor-pointer">Политика конфиденциальности</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg text-white">Соцсети</h4>
          <div className="flex space-x-4 mt-4">
            <a href="#" className="hover:text-blue-400 transition-colors cursor-pointer">FB</a>
            <a href="#" className="hover:text-blue-400 transition-colors cursor-pointer">INST</a>
            <a href="#" className="hover:text-blue-400 transition-colors cursor-pointer">TG</a>
          </div>
        </div>
      </div>
      <div className="text-center text-gray-500 mt-10 border-t border-gray-800 pt-8">© {new Date().getFullYear()} AutoTap. Все права защищены.</div>
    </footer>
  );
}


// --- СТРАНИЦЫ ПРИЛОЖЕНИЯ ---

function HomePage({ onNavigate }) {
  return (
    <main>
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{backgroundImage: "url('https://placehold.co/1920x1080/0a0a0a/ffffff?text=Auto+Service')"}} />
        <div className="absolute inset-0 bg-black/80" />
        <div className="relative z-10 text-center flex flex-col items-center">
          <motion.h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight text-white" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>Выездной автосервис <br /> у вашего порога</motion.h1>
          <motion.p className="mt-6 max-w-2xl text-lg md:text-xl text-gray-200" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>Найдите лучших мастеров, готовых приехать в удобное для вас время. Быстро, надёжно и с гарантией.</motion.p>
          <motion.div className="mt-10 w-full max-w-2xl bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-2xl flex flex-col md:flex-row items-center gap-4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.4 }}>
            <div className="w-full flex-grow flex items-center bg-transparent border-b-2 border-transparent focus-within:border-blue-500 transition-colors"><MapPin className="w-6 h-6 text-gray-300 mr-3" /><input type="text" placeholder="Ваш город или адрес" className="w-full bg-transparent text-white placeholder-gray-300 focus:outline-none py-2" /></div>
            <button onClick={() => onNavigate('catalog')} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105"><Search className="w-5 h-5" /><span>Найти</span></button>
          </motion.div>
        </div>
      </section>
      <section className="py-20 px-4 sm:px-8 bg-gray-900"><div className="container mx-auto"><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.7 }}><h2 className="text-4xl font-bold text-center text-white">Популярные услуги</h2><p className="text-center text-gray-300 mt-4 max-w-2xl mx-auto">Самые востребованные услуги, которые вы можете заказать прямо сейчас с выездом на место.</p></motion.div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">{popularServicesData.map((service, index) => (<ServiceCard key={service.name} service={service} index={index} />))}</div></div></section>
      <section className="py-20 px-4 sm:px-8 bg-gray-800/30" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/carbon-fibre-v2.png')"}}><div className="container mx-auto text-center"><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.7 }}><h2 className="text-4xl font-bold text-white">Почему выбирают AutoTap?</h2><p className="text-gray-300 mt-4 max-w-3xl mx-auto">Мы создали платформу, которая меняет представление об автосервисе. Лидерство в технологиях, превосходство в качестве.</p></motion.div><AdvantagesSlider /></div></section>
      <section className="py-20 px-4 sm:px-8 bg-gray-900"><div className="container mx-auto"><motion.div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-10 md:p-16 text-center flex flex-col items-center" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.7 }}><h2 className="text-4xl font-bold text-white">Вы — профессиональный автомеханик?</h2><p className="mt-4 text-blue-100 max-w-2xl">Присоединяйтесь к нашей платформе, чтобы получать больше заказов, управлять своим графиком и развивать свой бизнес.</p><button onClick={() => onNavigate('partner-signup')} className="mt-8 bg-white hover:bg-gray-200 text-blue-700 font-bold py-4 px-10 rounded-lg transition-all duration-300 transform hover:scale-105 text-lg shadow-xl">Стать партнёром</button></motion.div></div></section>
    </main>
  );
}

function CatalogPage({ onOrder }) {
    const [priceRange, setPriceRange] = useState(150);
    const FilterSection = ({ title, children }) => (<div className="py-6 border-b border-gray-700"><h3 className="font-semibold text-white mb-4">{title}</h3>{children}</div>);
    const ServiceResultCard = ({ service, index }) => (
        <motion.div className="bg-gray-800 rounded-xl overflow-hidden flex flex-col md:flex-row group transition-all duration-300 hover:bg-gray-700/50" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.05 }}>
            <div className="md:w-1/3 h-48 md:h-auto overflow-hidden"><img src={service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /></div>
            <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start"><h3 className="text-xl font-bold text-white mb-1">{service.name}</h3><div className="flex items-center gap-1 bg-blue-500/20 text-blue-300 px-2 py-1 rounded-md text-sm font-bold"><Star className="w-4 h-4 text-yellow-400" /><span>{service.rating}</span></div></div>
                <p className="text-gray-300 text-sm mb-4">от {service.provider}</p>
                <div className="flex-grow" />
                <div className="flex justify-between items-end mt-4">
                    <div><p className="text-gray-400 text-sm">Цена от</p><p className="text-2xl font-bold text-white">{`${service.currency}${service.price}`}</p></div>
                    <button onClick={() => onOrder(service)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300">Заказать</button>
                </div>
            </div>
        </motion.div>
    );
    return (
        <main className="bg-gray-900 text-white min-h-screen pt-24">
            <div className="container mx-auto px-4 py-10">
                <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold mb-2">Найти сервис</motion.h1>
                <motion.p initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{delay: 0.1}} className="text-gray-300 mb-8">Найдено {catalogServicesData.length} услуг в вашем районе</motion.p>
                <div className="flex flex-col lg:flex-row gap-8">
                    <motion.aside initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{delay: 0.2}} className="lg:w-1/4"><div className="bg-gray-800 p-6 rounded-xl sticky top-28"><div className="flex justify-between items-center mb-4"><h2 className="text-2xl font-bold">Фильтры</h2><SlidersHorizontal className="w-6 h-6 text-blue-400"/></div><FilterSection title="Тип услуги"><select className="w-full bg-gray-700 border-gray-600 rounded-md p-2 text-white focus:ring-blue-500 focus:border-blue-500"><option>Любой</option><option>Шиномонтаж</option><option>Диагностика</option><option>Детейлинг</option><option>Ремонт</option></select></FilterSection><FilterSection title="Цена до"><input type="range" min="10" max="500" value={priceRange} onChange={e => setPriceRange(e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500" /><div className="text-right font-bold text-white mt-2">{`$${priceRange}`}</div></FilterSection><FilterSection title="Рейтинг"><div className="flex justify-between">{[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-8 h-8 text-gray-500 hover:text-yellow-400 cursor-pointer transition-colors"/>)}</div></FilterSection><button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg mt-6 transition-colors">Применить</button></div></motion.aside>
                    <div className="lg:w-3/4"><div className="grid grid-cols-1 gap-6">{catalogServicesData.map((service, index) => (<ServiceResultCard key={service.id} service={service} index={index}/>))}</div></div>
                </div>
            </div>
        </main>
    );
}

function AuthPage({ onLogin, onNavigate }) {
    const [isLogin, setIsLogin] = useState(true);
    const formVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }, exit: { opacity: 0, y: -20, transition: { duration: 0.3 } } };
    const InputField = ({icon: Icon, ...props}) => (<div className="relative"><Icon className="absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5 text-gray-400" /><input {...props} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>);
    return (
        <main className="min-h-screen bg-gray-900 flex items-center justify-center p-4 pt-24" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/carbon-fibre-v2.png')"}}><motion.div initial={{opacity: 0, scale: 0.9}} animate={{opacity: 1, scale: 1}} className="w-full max-w-md"><div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-8 shadow-2xl"><div className="text-center mb-8"><h1 className="text-3xl font-bold text-white cursor-pointer" onClick={() => onNavigate('home')}>Auto<span className="text-blue-500">Tap</span></h1><p className="text-gray-300 mt-2">{isLogin ? 'Рады видеть вас снова!' : 'Создайте аккаунт для начала'}</p></div><div className="flex justify-center bg-gray-700/50 rounded-lg p-1 mb-8"><button onClick={() => setIsLogin(true)} className={`w-1/2 py-2 rounded-md text-sm font-semibold transition-colors ${isLogin ? 'bg-blue-600 text-white' : 'text-gray-300'}`}>Вход</button><button onClick={() => setIsLogin(false)} className={`w-1/2 py-2 rounded-md text-sm font-semibold transition-colors ${!isLogin ? 'bg-blue-600 text-white' : 'text-gray-300'}`}>Регистрация</button></div><AnimatePresence mode="wait"><motion.div key={isLogin ? 'login' : 'signup'} variants={formVariants} initial="hidden" animate="visible" exit="exit">{isLogin ? (<form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(clientDemoData); }}><InputField type="email" placeholder="Email" icon={Mail} /><InputField type="password" placeholder="Пароль" icon={Lock} /><div className="flex justify-between items-center"><a href="#" className="text-sm text-blue-400 hover:underline cursor-pointer">Забыли пароль?</a></div><button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors transform hover:scale-105">Войти</button></form>) : (<form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(clientDemoData); }}><InputField type="text" placeholder="Ваше имя" icon={User} /><InputField type="email" placeholder="Email" icon={Mail} /><InputField type="password" placeholder="Пароль" icon={Lock} /><button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors transform hover:scale-105">Создать аккаунт</button></form>)}</motion.div></AnimatePresence><div className="text-center mt-4"><button onClick={() => { onLogin(partnerDemoData); }} className="text-sm text-blue-400 hover:underline cursor-pointer">Войти как партнер (демо)</button></div><div className="text-center mt-2"><button onClick={() => { onLogin(adminDemoData); }} className="text-sm text-gray-500 hover:underline cursor-pointer">Войти как администратор (демо)</button></div></div></motion.div></main>
    );
}

function ProfilePage({ user, onLogout }) {
    const [activeTab, setActiveTab] = useState('history');
    const getStatusChip = (status) => {
        switch (status) {
            case 'Выполнен': return 'bg-green-500/20 text-green-400';
            case 'Отменен': return 'bg-red-500/20 text-red-400';
            default: return 'bg-yellow-500/20 text-yellow-400';
        }
    };
    const menuItems = [ { id: 'history', label: 'История заказов', icon: List }, { id: 'favorites', label: 'Избранные исполнители', icon: Heart }, { id: 'settings', label: 'Настройки', icon: Settings } ];
    const renderContent = () => {
        switch(activeTab) {
            case 'history': return (<div className="space-y-4">{orderHistoryData.map((order, i) => (<motion.div key={order.id} className="bg-gray-800 p-4 rounded-lg flex items-center gap-4" initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} transition={{delay: i * 0.1}}><img src={order.image} className="w-16 h-16 rounded-md object-cover hidden sm:block" alt={order.serviceName}/><div className="flex-grow"><p className="font-bold text-white">{order.serviceName}</p><p className="text-sm text-gray-400">{order.provider} · {order.date}</p></div><div className="text-right"><p className="font-bold text-white text-lg">{`$${order.amount}`}</p><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusChip(order.status)}`}>{order.status}</span></div></motion.div>))}</div>);
            case 'favorites': return (<div className="space-y-4">{user.favoriteProviders.map((provider, i) => (<motion.div key={provider.id} className="bg-gray-800 p-4 rounded-lg flex items-center gap-4" initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} transition={{delay: i * 0.1}}><img src={provider.avatarUrl} className="w-16 h-16 rounded-full object-cover" alt={provider.name}/><div className="flex-grow"><p className="font-bold text-white">{provider.name}</p><p className="text-sm text-gray-400">{provider.specialty}</p></div><div className="flex items-center gap-1 text-yellow-400"><Star className="w-5 h-5" /><span className="font-bold">{provider.rating}</span></div></motion.div>))}</div>);
            case 'settings': return (<div className="space-y-8"><div><h3 className="text-xl font-bold text-white mb-4">Личная информация</h3><div className="space-y-4 bg-gray-800 p-6 rounded-lg"><div className="flex justify-between items-center"><div><p className="text-sm text-gray-400">Имя</p><p className="text-white">{user.name}</p></div><button className="text-blue-400 text-sm cursor-pointer">Изменить</button></div><div className="flex justify-between items-center"><div><p className="text-sm text-gray-400">Email</p><p className="text-white">{user.email}</p></div><button className="text-blue-400 text-sm cursor-pointer">Изменить</button></div><div className="flex justify-between items-center"><div><p className="text-sm text-gray-400">Телефон</p><p className="text-white">{user.phone}</p></div><button className="text-blue-400 text-sm cursor-pointer">Изменить</button></div></div></div><div><h3 className="text-xl font-bold text-white mb-4">Мои автомобили</h3><div className="space-y-4">{user.cars.map(car => (<div key={car.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center"><div className="flex items-center gap-4"><div className="bg-blue-500/20 p-3 rounded-lg"><Car className="w-6 h-6 text-blue-300"/></div><div><p className="font-bold text-white">{car.make} {car.model}</p><p className="text-sm text-gray-400">{car.year} · {car.plate}</p></div></div><button className="text-gray-400 hover:text-white cursor-pointer"><Trash2 className="w-5 h-5"/></button></div>))}<button className="w-full border-2 border-dashed border-gray-600 hover:border-blue-500 text-gray-400 hover:text-blue-400 p-4 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"><PlusCircle className="w-5 h-5" />Добавить автомобиль</button></div></div></div>);
            default: return null;
        }
    };
    return (
        <main className="bg-gray-900 text-white min-h-screen pt-24"><div className="container mx-auto px-4 py-10"><motion.div initial={{opacity: 0, y: -20}} animate={{opacity: 1, y: 0}} className="flex items-center gap-4 mb-8"><img src={user.avatarUrl} className="w-24 h-24 rounded-full border-4 border-gray-700" alt={user.name} /><div><h1 className="text-4xl font-bold">Личный кабинет</h1><p className="text-gray-300">Добро пожаловать, {user?.name || 'Пользователь'}!</p></div></motion.div><div className="flex flex-col lg:flex-row gap-8"><motion.aside initial={{opacity: 0, x: -20}} animate={{opacity: 1, x: 0}} transition={{delay: 0.1}} className="lg:w-1/4"><div className="bg-gray-800 p-4 rounded-xl sticky top-28"><ul className="space-y-2">{menuItems.map(item => (<li key={item.id}><button onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 p-3 rounded-md text-left transition-colors ${activeTab === item.id ? 'bg-blue-600 text-white font-semibold' : 'hover:bg-gray-700'}`}><item.icon className="w-5 h-5"/>{item.label}</button></li>))}<li><button onClick={onLogout} className="w-full flex items-center gap-3 p-3 rounded-md text-left text-red-400 hover:bg-red-500/20 transition-colors"><LogOut className="w-5 h-5"/>Выход</button></li></ul></div></motion.aside><motion.main initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} transition={{delay: 0.2}} className="lg:w-3/4 bg-gray-800/50 rounded-xl p-6"><AnimatePresence mode="wait"><motion.div key={activeTab} initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -10}} transition={{duration: 0.2}}>{renderContent()}</motion.div></AnimatePresence></motion.main></div></div></main>
    );
}

function CreateOfferPage({ onNavigate }) {
    const [step, setStep] = useState(1);
    const totalSteps = 4;
    const stepTitles = ["Тип услуги", "Описание", "Цена и локация", "Публикация"];
    const stepIcons = [Type, Info, DollarSign, ShieldCheck];
    const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));
    const InputField = ({label, ...props}) => (<div><label className="block text-sm font-medium text-gray-300 mb-2">{label}</label><input {...props} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>);
    const TextAreaField = ({label, ...props}) => (<div><label className="block text-sm font-medium text-gray-300 mb-2">{label}</label><textarea {...props} rows="4" className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>);
    const Step1 = () => (<div className="space-y-6"><h3 className="text-2xl font-bold text-white">Какую услугу вы предлагаете?</h3><InputField label="Название услуги" placeholder="Например, 'Выездной шиномонтаж'" /><div><label className="block text-sm font-medium text-gray-300 mb-2">Категория</label><select className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"><option>Шиномонтаж</option><option>Диагностика</option><option>Детейлинг</option><option>Ремонт</option><option>Замена масла</option></select></div></div>);
    const Step2 = () => (<div className="space-y-6"><h3 className="text-2xl font-bold text-white">Подробное описание</h3><TextAreaField label="Опишите вашу услугу" placeholder="Расскажите, что входит в услугу, какие материалы вы используете и в чем ваши преимущества." /><div><label className="block text-sm font-medium text-gray-300 mb-2">Фотографии ваших работ</label><div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md"><div className="space-y-1 text-center"><Upload className="mx-auto h-12 w-12 text-gray-400" /><p className="text-sm text-gray-400">Перетащите файлы сюда или нажмите для выбора</p></div></div></div></div>);
    const Step3 = () => (<div className="space-y-6"><h3 className="text-2xl font-bold text-white">Стоимость и зона обслуживания</h3><InputField label="Цена" type="number" placeholder="Укажите стоимость услуги" /><InputField label="Зона выезда" placeholder="Например, 'Весь город' или 'Центральный район'" /></div>);
    const Step4 = ({onNavigate}) => (<div className="text-center"><ShieldCheck className="mx-auto h-16 w-16 text-green-400" /><h3 className="text-2xl font-bold text-white mt-4">Все готово к публикации!</h3><p className="text-gray-300 mt-2">Ваше предложение будет отправлено на модерацию и опубликовано в ближайшее время.</p><button onClick={() => onNavigate('home')} className="mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">Опубликовать</button></div>);
    const renderStepContent = () => { switch(step) { case 1: return <Step1 />; case 2: return <Step2 />; case 3: return <Step3 />; case 4: return <Step4 onNavigate={onNavigate} />; default: return null; } };
    return (
        <main className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 pt-24"><div className="w-full max-w-3xl"><h1 className="text-4xl font-bold text-white text-center mb-2">Создание нового предложения</h1><p className="text-gray-300 text-center mb-8">Заполните все поля, чтобы клиенты могли легко найти вас.</p><div className="mb-8 px-4"><div className="relative"><div className="absolute left-0 top-1/2 w-full h-0.5 bg-gray-700" /><div className="absolute left-0 top-1/2 w-full h-0.5 bg-blue-600 transition-all duration-500" style={{width: `${((step - 1) / (totalSteps - 1)) * 100}%`}} /><div className="flex justify-between items-center">{stepTitles.map((title, i) => { const stepNumber = i + 1; const Icon = stepIcons[i]; return (<div key={title} className="flex flex-col items-center z-10"><div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${step >= stepNumber ? 'bg-blue-600' : 'bg-gray-700'}`}><Icon className={`w-5 h-5 ${step >= stepNumber ? 'text-white' : 'text-gray-400'}`} /></div><p className={`mt-2 text-xs text-center transition-colors duration-500 ${step >= stepNumber ? 'text-white' : 'text-gray-500'}`}>{title}</p></div>)})}</div></div></div><motion.div initial={{opacity: 0, scale: 0.95}} animate={{opacity: 1, scale: 1}} className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-8 shadow-2xl"><AnimatePresence mode="wait"><motion.div key={step} initial={{opacity: 0, x: 50}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: -50}} transition={{duration: 0.3}}>{renderStepContent()}</motion.div></AnimatePresence></motion.div><div className="flex justify-between mt-8"><button onClick={prevStep} disabled={step === 1} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Назад</button>{step < totalSteps && <button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">Далее</button>}</div></div></main>
    );
}

function PartnerProfilePage({ user, onLogout, onNavigate }) {
    const [activeTab, setActiveTab] = useState('dashboard');
    const menuItems = [ { id: 'dashboard', label: 'Дашборд', icon: BarChart2 }, { id: 'services', label: 'Мои услуги', icon: List }, { id: 'schedule', label: 'График', icon: Calendar }, { id: 'reviews', label: 'Отзывы', icon: Star }, { id: 'settings', label: 'Настройки', icon: Settings } ];
    const StatCard = ({ title, value, icon: Icon, color }) => (<div className="bg-gray-800 p-6 rounded-xl flex items-center gap-4"><div className={`p-3 rounded-full ${color}`}><Icon className="w-6 h-6 text-white" /></div><div><p className="text-gray-400 text-sm">{title}</p><p className="text-2xl font-bold text-white">{value}</p></div></div>);
    const getStatusChip = (status) => {
        switch (status) {
            case 'Активна': return 'bg-green-500/20 text-green-400';
            case 'На модерации': return 'bg-yellow-500/20 text-yellow-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };
    const renderContent = () => {
        switch(activeTab) {
            case 'dashboard': return (<div className="grid grid-cols-1 md:grid-cols-3 gap-6"><StatCard title="Общий доход" value="$4,850" icon={DollarSign} color="bg-green-500" /><StatCard title="Заказов в месяц" value="28" icon={List} color="bg-blue-500" /><StatCard title="Рейтинг" value="4.9 / 5.0" icon={Star} color="bg-yellow-500" /></div>);
            case 'services': return (<div><div className="flex justify-between items-center mb-4"><h3 className="text-2xl font-bold text-white">Мои услуги</h3><button onClick={() => onNavigate('partner-signup')} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">Добавить услугу</button></div><div className="space-y-4">{user.services.map((service, i) => (<motion.div key={service.id} className="bg-gray-800 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center gap-4" initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: i * 0.1}}><div className="flex-grow"><p className="font-bold text-white">{service.name}</p><p className="text-sm text-gray-400">{`Цена: $${service.price} · Заказов: ${service.orders}`}</p></div><div className="flex items-center gap-4 w-full sm:w-auto"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusChip(service.status)}`}>{service.status}</span><button className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"><Edit className="w-4 h-4" /></button><button className="p-2 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button></div></motion.div>))}</div></div>);
            case 'schedule': case 'reviews': case 'settings': return <PlaceholderSection title="Раздел в разработке" description={`Функционал для "${menuItems.find(item => item.id === activeTab).label}" скоро появится.`} />;
            default: return null;
        }
    };
    const PlaceholderSection = ({title, description}) => (<div className="text-center py-16"><h3 className="text-2xl font-bold text-white">{title}</h3><p className="text-gray-400 mt-2">{description}</p></div>);
    return (
        <main className="bg-gray-900 text-white min-h-screen pt-24"><div className="container mx-auto px-4 py-10"><motion.div initial={{opacity: 0, y: -20}} animate={{opacity: 1, y: 0}} className="flex items-center gap-4 mb-8"><img src={user.avatarUrl} className="w-24 h-24 rounded-full border-4 border-gray-700" alt={user.name} /><div><h1 className="text-4xl font-bold">Панель управления партнера</h1><p className="text-gray-300">Добро пожаловать, {user?.name || 'Партнер'}!</p></div></motion.div><div className="flex flex-col lg:flex-row gap-8"><motion.aside initial={{opacity: 0, x: -20}} animate={{opacity: 1, x: 0}} transition={{delay: 0.1}} className="lg:w-1/4"><div className="bg-gray-800 p-4 rounded-xl sticky top-28"><ul className="space-y-2">{menuItems.map(item => (<li key={item.id}><button onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 p-3 rounded-md text-left transition-colors ${activeTab === item.id ? 'bg-blue-600 text-white font-semibold' : 'hover:bg-gray-700'}`}><item.icon className="w-5 h-5"/>{item.label}</button></li>))}<li><button onClick={onLogout} className="w-full flex items-center gap-3 p-3 rounded-md text-left text-red-400 hover:bg-red-500/20 transition-colors"><LogOut className="w-5 h-5"/>Выход</button></li></ul></div></motion.aside><motion.main initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} transition={{delay: 0.2}} className="lg:w-3/4 bg-gray-800/50 rounded-xl p-6"><AnimatePresence mode="wait"><motion.div key={activeTab} initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -10}} transition={{duration: 0.2}}>{renderContent()}</motion.div></AnimatePresence></motion.main></div></div></main>
    );
}

function AdminPage({ user, onLogout }) {
    const [activeTab, setActiveTab] = useState('users');
    const menuItems = [ { id: 'users', label: 'Пользователи', icon: Users }, { id: 'services', label: 'Услуги', icon: Briefcase }, { id: 'reviews', label: 'Отзывы', icon: MessageSquare } ];
    const renderContent = () => {
        switch(activeTab) {
            case 'users': return <div className="text-white">Раздел управления пользователями</div>;
            case 'services': return <div className="text-white">Раздел модерации услуг</div>;
            case 'reviews': return <div className="text-white">Раздел модерации отзывов</div>;
            default: return null;
        }
    };
    return (
        <main className="bg-gray-900 text-white min-h-screen pt-24"><div className="container mx-auto px-4 py-10"><motion.div initial={{opacity: 0, y: -20}} animate={{opacity: 1, y: 0}} className="flex items-center gap-4 mb-8"><img src={user.avatarUrl} className="w-24 h-24 rounded-full border-4 border-blue-500" alt={user.name} /><div><h1 className="text-4xl font-bold">Панель Администратора</h1><p className="text-gray-300">Добро пожаловать, {user?.name}!</p></div></motion.div><div className="flex flex-col lg:flex-row gap-8"><motion.aside initial={{opacity: 0, x: -20}} animate={{opacity: 1, x: 0}} transition={{delay: 0.1}} className="lg:w-1/4"><div className="bg-gray-800 p-4 rounded-xl sticky top-28"><ul className="space-y-2">{menuItems.map(item => (<li key={item.id}><button onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 p-3 rounded-md text-left transition-colors ${activeTab === item.id ? 'bg-blue-600 text-white font-semibold' : 'hover:bg-gray-700'}`}><item.icon className="w-5 h-5"/>{item.label}</button></li>))}<li><button onClick={onLogout} className="w-full flex items-center gap-3 p-3 rounded-md text-left text-red-400 hover:bg-red-500/20 transition-colors"><LogOut className="w-5 h-5"/>Выход</button></li></ul></div></motion.aside><motion.main initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} transition={{delay: 0.2}} className="lg:w-3/4 bg-gray-800/50 rounded-xl p-6"><AnimatePresence mode="wait"><motion.div key={activeTab} initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -10}} transition={{duration: 0.2}}>{renderContent()}</motion.div></AnimatePresence></motion.main></div></div></main>
    );
}

// Новая страница "О нас"
function AboutPage() {
  const timelineEvents = [
    { year: '2021', title: 'Рождение идеи', description: 'Основатели, столкнувшись с трудностями поиска качественного автосервиса, решают создать AutoTap.' },
    { year: '2022', title: 'Разработка и запуск', description: 'Запуск бета-версии платформы в одном городе. Привлечение первых 50 партнеров.' },
    { year: '2023', title: 'Рост и масштабирование', description: 'Расширение на 5 крупных городов, более 10,000 успешных заказов.' },
    { year: '2024', title: 'Новые горизонты', description: 'Внедрение AI для подбора мастеров и запуск мобильного приложения.' },
  ];

  return (
    <main className="bg-gray-900 text-white min-h-screen pt-24">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-4 text-center">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" style={{backgroundImage: "url('https://placehold.co/1920x1080/1a202c/718096?text=Our+Workshop')"}} />
        <div className="relative z-10 container mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight"
          >
            Мы меняем мир автосервиса.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-gray-300"
          >
            AutoTap был создан с одной простой целью: сделать уход за автомобилем максимально удобным, прозрачным и надежным. Мы соединяем автовладельцев с лучшими выездными специалистами, экономя ваше время и нервы.
          </motion.p>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-20 px-4 sm:px-8 bg-gray-800/50">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Наша миссия</h2>
            <p className="text-gray-300 mb-4">
              Мы стремимся полностью избавить автовладельцев от головной боли, связанной с обслуживанием автомобиля. Больше никаких очередей, неожиданных счетов и потраченных впустую выходных. Только качественный сервис там, где удобно вам.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start"><CheckCircle className="w-6 h-6 text-blue-400 mr-3 mt-1 flex-shrink-0" /><span><strong className="text-white">Прозрачность:</strong> Честные цены и отзывы. Вы всегда знаете, за что платите.</span></li>
              <li className="flex items-start"><CheckCircle className="w-6 h-6 text-blue-400 mr-3 mt-1 flex-shrink-0" /><span><strong className="text-white">Удобство:</strong> Мастер приезжает к вам — домой, на работу, куда угодно.</span></li>
              <li className="flex items-start"><CheckCircle className="w-6 h-6 text-blue-400 mr-3 mt-1 flex-shrink-0" /><span><strong className="text-white">Надежность:</strong> Только проверенные исполнители с гарантией на все работы.</span></li>
            </ul>
          </motion.div>
          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true, amount: 0.5 }}
             transition={{ duration: 0.7 }}
             className="rounded-xl overflow-hidden shadow-2xl"
          >
            <img src="https://placehold.co/600x450/2d3748/a0aec0?text=Convenience" alt="Удобство сервиса" className="w-full h-full object-cover" />
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4 sm:px-8 bg-gray-900">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">Наша история</h2>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-1/2 top-0 h-full w-0.5 bg-gray-700 -translate-x-1/2" aria-hidden="true"></div>
            <div className="relative space-y-16">
              {timelineEvents.map((event, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-col md:flex-row items-center"
                >
                  <div className={`flex-1 md:w-1/2 ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left md:order-2'}`}>
                    <p className="text-blue-400 font-bold text-xl mb-1">{event.year}</p>
                    <h3 className="text-2xl font-semibold text-white">{event.title}</h3>
                    <p className="text-gray-400 mt-2">{event.description}</p>
                  </div>
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 border-4 border-gray-900 z-10 my-4 md:my-0"></div>
                  <div className="flex-1 md:w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}


function BookingModal({ service, onClose }) {
    const [step, setStep] = useState(1);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const availableTimes = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];
    const daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
    const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const startingDay = (firstDayOfMonth.getDay() + 6) % 7; // 0 (Monday) to 6 (Sunday)
    const calendarDays = Array.from({ length: startingDay + daysInMonth }, (_, i) => {
        if (i < startingDay) return null;
        return i - startingDay + 1;
    });
    const handleDateSelect = (day) => { if (!day) return; const newSelectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day); setSelectedDate(newSelectedDate); setSelectedTime(null); };
    const changeMonth = (offset) => { setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1)); setSelectedDate(null); setSelectedTime(null); }
    const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
    const modalVariants = { hidden: { scale: 0.9, opacity: 0 }, visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } }, exit: { scale: 0.9, opacity: 0, transition: { duration: 0.2 } } };
    return (
        <motion.div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" onClick={onClose}>
            <motion.div className="bg-gray-800 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden" variants={modalVariants} onClick={(e) => e.stopPropagation()}>
                <AnimatePresence mode="wait">
                    {step === 1 && (<motion.div key="step1" initial={{opacity: 0, x: 50}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: -50}}><div className="p-8"><h2 className="text-2xl font-bold text-white mb-2">Подтверждение заказа</h2><p className="text-gray-400 mb-6">Пожалуйста, проверьте детали вашего заказа.</p><div className="bg-gray-700/50 p-4 rounded-lg space-y-3"><div className="flex justify-between"><span className="text-gray-400">Услуга:</span><span className="font-semibold text-white">{service.name}</span></div><div className="flex justify-between"><span className="text-gray-400">Исполнитель:</span><span className="font-semibold text-white">{service.provider}</span></div><div className="flex justify-between"><span className="text-gray-400">Стоимость:</span><span className="font-bold text-lg text-white">{`${service.currency}${service.price}`}</span></div></div></div><div className="bg-gray-700/50 px-8 py-4 flex justify-end gap-4"><button onClick={onClose} className="text-gray-300 hover:text-white transition-colors">Отмена</button><button onClick={() => setStep(2)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">Выбрать время</button></div></motion.div>)}
                    {step === 2 && (<motion.div key="step2" initial={{opacity: 0, x: 50}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: -50}}><div className="p-8"><h2 className="text-2xl font-bold text-white mb-6">Выберите дату и время</h2><div className="bg-gray-700/50 p-4 rounded-lg"><div className="flex justify-between items-center mb-4"><button onClick={() => changeMonth(-1)}><ChevronLeft/></button><h3 className="font-bold text-lg">{`${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}</h3><button onClick={() => changeMonth(1)}><ChevronRight/></button></div><div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-2">{daysOfWeek.map(day => <div key={day}>{day}</div>)}</div><div className="grid grid-cols-7 gap-1">{calendarDays.map((day, i) => (<button key={i} onClick={() => handleDateSelect(day)} disabled={!day} className={`w-10 h-10 rounded-full transition-colors disabled:opacity-20 ${selectedDate?.toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString() ? 'bg-blue-600 text-white font-bold' : 'hover:bg-gray-600'}`}>{day}</button>))}</div></div>{selectedDate && <div className="mt-6"><h3 className="font-bold text-white mb-3">Доступное время:</h3><div className="grid grid-cols-3 sm:grid-cols-4 gap-2">{availableTimes.map(time => (<button key={time} onClick={() => setSelectedTime(time)} className={`p-2 rounded-lg transition-colors ${selectedTime === time ? 'bg-blue-600 text-white font-bold' : 'bg-gray-700 hover:bg-gray-600'}`}>{time}</button>))}</div></div>}</div><div className="bg-gray-700/50 px-8 py-4 flex justify-between gap-4"><button onClick={() => setStep(1)} className="text-gray-300 hover:text-white transition-colors">Назад</button><button onClick={() => setStep(3)} disabled={!selectedDate || !selectedTime} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50">Подтвердить</button></div></motion.div>)}
                    {step === 3 && (<motion.div key="step3" initial={{opacity: 0, scale: 0.9}} animate={{opacity: 1, scale: 1}} className="p-8 text-center"><CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" /><h2 className="text-2xl font-bold text-white mb-2">Заказ успешно оформлен!</h2><p className="text-gray-400 mb-6">Вы записаны на <span className="font-bold text-white">{service.name}</span> на <span className="font-bold text-white">{selectedDate.toLocaleDateString()} в {selectedTime}</span>. Детали в вашем личном кабинете.</p><button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-8 rounded-lg transition-colors">Отлично</button></motion.div>)}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
}


export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [bookingService, setBookingService] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    if (userData.type === 'admin') {
      handleNavigate('admin');
    } else if (userData.type === 'partner') {
      handleNavigate('partner-profile');
    } else {
      handleNavigate('profile');
    }
  };

  const handleLogout = () => {
    setUser(null);
    handleNavigate('home');
  };
  
  const handleOrder = (service) => {
    setBookingService(service);
    setIsBookingOpen(true);
  };

  const PageWrapper = ({ children }) => (
    <motion.div key={currentPage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      {children}
    </motion.div>
  );

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <PageWrapper><HomePage onNavigate={handleNavigate} /></PageWrapper>;
      case 'catalog':
        return <PageWrapper><CatalogPage onOrder={handleOrder} /></PageWrapper>;
      case 'login':
        return <PageWrapper><AuthPage onLogin={handleLogin} onNavigate={handleNavigate} /></PageWrapper>;
      case 'partner-signup':
        return <PageWrapper><CreateOfferPage onNavigate={handleNavigate} /></PageWrapper>;
      case 'about':
        return <PageWrapper><AboutPage /></PageWrapper>;
      case 'profile':
        if (!user || user.type !== 'client') return <PageWrapper><AuthPage onLogin={handleLogin} onNavigate={handleNavigate} /></PageWrapper>;
        return <PageWrapper><ProfilePage user={user} onLogout={handleLogout} /></PageWrapper>;
      case 'partner-profile':
        if (!user || user.type !== 'partner') return <PageWrapper><AuthPage onLogin={handleLogin} onNavigate={handleNavigate} /></PageWrapper>;
        return <PageWrapper><PartnerProfilePage user={user} onLogout={handleLogout} onNavigate={handleNavigate} /></PageWrapper>;
      case 'admin':
        if (!user || user.type !== 'admin') return <PageWrapper><AuthPage onLogin={handleLogin} onNavigate={handleNavigate} /></PageWrapper>;
        return <PageWrapper><AdminPage user={user} onLogout={handleLogout} /></PageWrapper>;
      default:
        return <PageWrapper><HomePage onNavigate={handleNavigate} /></PageWrapper>;
    }
  };
  
  return (
    <div className="bg-gray-900">
      <Header onNavigate={handleNavigate} user={user} isHomePage={currentPage === 'home'} />
      
      <AnimatePresence mode="wait">
        {renderPage()}
      </AnimatePresence>
      
      <Footer onNavigate={handleNavigate} />

      <AnimatePresence>
        {isBookingOpen && (
          <BookingModal 
            service={bookingService} 
            onClose={() => setIsBookingOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
