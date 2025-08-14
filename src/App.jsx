import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { MapPin, Search, Wrench, Car, ShieldCheck, Star, ChevronLeft, ChevronRight, Menu, X, SlidersHorizontal, DollarSign, Mail, Lock, User, Settings, List, LogOut, Heart, FileText, PlusCircle, CheckCircle, Users, Briefcase, MessageSquare, Sun, Moon, AlertTriangle, Building, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db } from './firebase';
import { GoogleAuthProvider, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut, signInWithCustomToken } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, onSnapshot, addDoc, deleteDoc } from 'firebase/firestore';

// --- I18N (МНОГОЯЗЫЧНОСТЬ) SETUP ---

const translations = {
  ru: {
    // Header & Footer
    findService: 'Найти сервис',
    aboutUs: 'О нас',
    login: 'Войти',
    becomePartner: 'Стать партнёром',
    profile: 'Профиль',
    partnerPanel: 'Панель партнера',
    adminPanel: 'Админ-панель',
    logout: 'Выйти',
    navigation: 'Навигация',
    home: 'Главная',
    catalog: 'Каталог',
    partnership: 'Партнёрство',
    support: 'Поддержка',
    // Home Page
    heroTitle: 'Выездной автосервис у вашего порога',
    heroSubtitle: 'Найдите лучших мастеров, готовых приехать в удобное для вас время. Быстро, надёжно и с гарантией.',
    find: 'Найти',
    popularServices: 'Популярные услуги',
    popularServicesDesc: 'Самые востребованные услуги, которые вы можете заказать прямо сейчас с выездом на место.',
    whyChooseUs: 'Почему выбирают AutoTap?',
    whyChooseUsDesc: 'Мы создали платформу, которая меняет представление об автосервисе. Лидерство в технологиях, превосходство в качестве.',
    areYouMechanic: 'Вы — профессиональный автомеханик?',
    areYouMechanicDesc: 'Присоединяйтесь к нашей платформе, чтобы получать больше заказов, управлять своим графиком и развивать свой бизнес.',
    // Auth Page
    welcomeBack: 'Рады видеть вас снова!',
    createAccountPrompt: 'Создайте аккаунт для начала',
    forgotPassword: 'Забыли пароль?',
    createAccount: 'Создать аккаунт',
    // Profile Page
    myCabinet: 'Личный кабинет',
    welcomeUser: 'Добро пожаловать',
    orderHistory: 'История заказов',
    favoriteProviders: 'Избранные исполнители',
    settings: 'Настройки',
    personalInfo: 'Личная информация',
    myCars: 'Мои автомобили',
    addCar: 'Добавить автомобиль',
    noCars: 'У вас пока нет добавленных автомобилей.',
    // AddCarModal
    addCarTitle: 'Добавить автомобиль',
    fillAllFields: 'Пожалуйста, заполните все поля.',
    carMake: 'Марка (e.g., Toyota)',
    carModel: 'Модель (e.g., Camry)',
    carYear: 'Год',
    carPlate: 'Гос. номер',
    cancel: 'Отмена',
    add: 'Добавить',
    deleteCarConfirm: 'Вы уверены, что хотите удалить этот автомобиль?',
  },
  en: {
    // Header & Footer
    findService: 'Find a Service',
    aboutUs: 'About Us',
    login: 'Log In',
    becomePartner: 'Become a Partner',
    profile: 'Profile',
    partnerPanel: 'Partner Panel',
    adminPanel: 'Admin Panel',
    logout: 'Log Out',
    navigation: 'Navigation',
    home: 'Home',
    catalog: 'Catalog',
    partnership: 'Partnership',
    support: 'Support',
    // Home Page
    heroTitle: 'Mobile Auto Service at Your Doorstep',
    heroSubtitle: 'Find the best mechanics ready to come to you at your convenience. Fast, reliable, and with a guarantee.',
    find: 'Find',
    popularServices: 'Popular Services',
    popularServicesDesc: 'The most requested services you can order right now for on-site service.',
    whyChooseUs: 'Why Choose AutoTap?',
    whyChooseUsDesc: 'We have created a platform that changes the perception of car service. Leadership in technology, excellence in quality.',
    areYouMechanic: 'Are you a professional auto mechanic?',
    areYouMechanicDesc: 'Join our platform to get more orders, manage your schedule, and grow your business.',
    // Auth Page
    welcomeBack: 'Glad to see you again!',
    createAccountPrompt: 'Create an account to get started',
    forgotPassword: 'Forgot password?',
    createAccount: 'Create Account',
    // Profile Page
    myCabinet: 'My Account',
    welcomeUser: 'Welcome',
    orderHistory: 'Order History',
    favoriteProviders: 'Favorite Providers',
    settings: 'Settings',
    personalInfo: 'Personal Information',
    myCars: 'My Cars',
    addCar: 'Add Car',
    noCars: 'You have no cars added yet.',
    // AddCarModal
    addCarTitle: 'Add a Car',
    fillAllFields: 'Please fill in all fields.',
    carMake: 'Make (e.g., Toyota)',
    carModel: 'Model (e.g., Camry)',
    carYear: 'Year',
    carPlate: 'License Plate',
    cancel: 'Cancel',
    add: 'Add',
    deleteCarConfirm: 'Are you sure you want to delete this car?',
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'ru');

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    const t = (key) => translations[language][key] || key;

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useTranslation = () => useContext(LanguageContext);

// --- THEME HELPER ---
const useTheme = () => {
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);
    const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    return [theme, toggleTheme];
};

// --- DEMO DATA ---
const popularServicesData = [
  { name: 'Выездной шиномонтаж', icon: Wrench, image: 'https://i.ibb.co/pvQrdh4g/pexels-artempodrez-8986177.jpg' },
  { name: 'Компьютерная диагностика', icon: Car, image: 'https://i.ibb.co/3mMG3Xqr/pexels-lumierestudiomx-4116193.jpg' },
  { name: 'Детейлинг и химчистка', icon: Star, image: 'https://i.ibb.co/vvjNmvCZ/pexels-tima-miroshnichenko-6873020.jpg' },
  { name: 'Замена масла', icon: Wrench, image: 'https://i.ibb.co/DDbbJjDn/pexels-daniel-andraski-197681005-13065690-1.jpg' },
  {name: 'Замена шин', icon: Wrench, image: 'https://i.ibb.co/pvQrdh4g/pexels-artempodrez-8986177.jpg' },
];
const advantagesData = [
  { title: 'Проверенные специалисты', description: 'Каждый исполнитель проходит строгую проверку документов и навыков.', icon: ShieldCheck },
  { title: 'Безопасная сделка', description: 'Оплата резервируется и переводится исполнителю только после вашего подтверждения.', icon: ShieldCheck },
  { title: 'Гарантия качества', description: 'Мы предоставляем гарантию на все выполненные работы через наш сервис.', icon: ShieldCheck },
  { title: 'Экономия времени', description: 'Мастер приедет сам, куда и когда вам удобно. Больше не нужно ждать в очередях.', icon: ShieldCheck },
];
const catalogServicesData = [
    { id: 1, name: 'Срочный шиномонтаж 24/7', provider: 'MobileTire Pro', rating: 4.9, reviews: 124, price: 35, currency: '$', image: 'https://i.ibb.co/pvQrdh4g/pexels-artempodrez-8986177.jpg' },
    { id: 2, name: 'Полная диагностика двигателя', provider: 'Engine Masters', rating: 4.8, reviews: 89, price: 80, currency: '$', image: 'https://i.ibb.co/3mMG3Xqr/pexels-lumierestudiomx-4116193.jpg' },
    { id: 3, name: 'Премиум детейлинг кузова', provider: 'Shiny Auto', rating: 5.0, reviews: 210, price: 150, currency: '$', image: 'https://i.ibb.co/vvjNmvCZ/pexels-tima-miroshnichenko-6873020.jpg' },
    { id: 4, name: 'Замена масла и фильтров', provider: 'Quick Lube', rating: 4.7, reviews: 301, price: 50, currency: '$', image: 'https://i.ibb.co/DDbbJjDn/pexels-daniel-andraski-197681005-13065690-1.jpg' },
];
const orderHistoryData = [
    { id: 'AT7C3B', serviceName: 'Полная диагностика двигателя', provider: 'Engine Masters', date: '2024-06-15', amount: 80, status: 'Выполнен', image: 'https://i.ibb.co/3mMG3Xqr/pexels-lumierestudiomx-4116193.jpg' },
    { id: 'AT9A1D', serviceName: 'Выездной шиномонтаж', provider: 'MobileTire Pro', date: '2024-05-28', amount: 45, status: 'Выполнен', image: 'https://i.ibb.co/pvQrdh4g/pexels-artempodrez-8986177.jpg' },
    { id: 'ATF8E2', serviceName: 'Детейлинг и химчистка', provider: 'Shiny Auto', date: '2024-04-12', amount: 180, status: 'Отменен', image: 'https://i.ibb.co/vvjNmvCZ/pexels-tima-miroshnichenko-6873020.jpg' },
];


// --- UI COMPONENTS ---

function BackToTopButton() {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 bg-blue-600/80 backdrop-blur-sm hover:bg-blue-700 text-white rounded-full p-3 shadow-lg z-50 cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                >
                    <ChevronUp className="w-6 h-6" />
                </motion.button>
            )}
        </AnimatePresence>
    );
}

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
      <div className="overflow-hidden relative min-h-[12rem] rounded-2xl bg-slate-200/50 dark:bg-gray-800/50 backdrop-blur-sm p-8 flex items-center">
        <AnimatePresence mode="wait">
          <motion.div key={current} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.5 }} className="w-full flex flex-col items-center text-center">
            <IconComponent className="w-12 h-12 text-blue-500 dark:text-blue-400 mb-4" />
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{advantagesData[current].title}</h3>
            <p className="text-slate-600 dark:text-gray-200 mt-2 max-w-md">{advantagesData[current].description}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <button onClick={prevSlide} className="absolute top-1/2 left-0 md:-left-12 transform -translate-y-1/2 bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer"><ChevronLeft className="w-6 h-6 text-slate-800 dark:text-white" /></button>
      <button onClick={nextSlide} className="absolute top-1/2 right-0 md:-right-12 transform -translate-y-1/2 bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer"><ChevronRight className="w-6 h-6 text-slate-800 dark:text-white" /></button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">{advantagesData.map((_, i) => (<div key={i} onClick={() => setCurrent(i)} className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-300 ${current === i ? 'bg-blue-500 w-4' : 'bg-gray-400 dark:bg-gray-500'}`} />))}</div>
    </div>
  );
}

function LanguageSwitcher() {
    const { language, setLanguage } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const languages = [
        { code: 'ru', flag: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 6" width="24"><path fill="#fff" d="M0 0h9v3H0z"/><path fill="#d52b1e" d="M0 3h9v3H0z"/><path fill="#0039a6" d="M0 2h9v2H0z"/></svg> },
        { code: 'en', flag: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" width="24"><clipPath id="a"><path d="M30 15h30v15zv15h-30zH0z"/></clipPath><path d="M0 0v30h60V0z" fill="#012169"/><path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6"/><path d="M0 0l60 30m0-30L0 30" clipPath="url(#a)" stroke="#C8102E" strokeWidth="4"/><path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10"/><path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6"/></svg> }
    ];

    const selectedLanguage = languages.find(l => l.code === language);

    return (
        <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                {selectedLanguage.flag}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-max bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 z-50"
                    >
                        {languages.map(lang => (
                            <button 
                                key={lang.code}
                                onClick={() => { setLanguage(lang.code); setIsOpen(false); }}
                                className={`w-full flex items-center gap-3 p-2 rounded-md text-left transition-colors cursor-pointer ${language === lang.code ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'hover:bg-slate-100 dark:hover:bg-gray-700'}`}
                            >
                                {lang.flag} <span className="text-slate-700 dark:text-gray-200 uppercase text-sm font-semibold">{lang.code}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function Header({ onNavigate, user, theme, toggleTheme, onLogout }) {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navLinks = [ { name: t('findService'), page: 'catalog' }, { name: t('aboutUs'), page: 'about' } ];
  const handleNavClick = (page) => { onNavigate(page); setMobileMenuOpen(false); };
  const headerClasses = `fixed top-0 left-0 w-full z-50 py-4 px-4 sm:px-8 transition-all duration-300 bg-white/80 dark:bg-gray-900/70 backdrop-blur-lg border-b border-slate-200/50 dark:border-gray-800/50`;
  
  let targetPage = 'profile';
  if (user?.role === 'admin') targetPage = 'admin';
  if (user?.role === 'partner') targetPage = 'partner-profile';

  return (
    <header className={headerClasses}>
      <div className="container mx-auto flex justify-between items-center">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="text-slate-900 dark:text-white text-3xl font-bold tracking-wider cursor-pointer" onClick={() => onNavigate('home')}>Auto<span className="text-blue-500">Tap</span></motion.div>
        <nav className="hidden md:flex items-center space-x-8">{navLinks.map((link, i) => (<motion.button key={link.name} onClick={() => handleNavClick(link.page)} className="text-slate-600 dark:text-gray-200 hover:text-slate-900 dark:hover:text-white transition-colors duration-300 cursor-pointer" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}>{link.name}</motion.button>))}</nav>
        <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
            {/* <button onClick={toggleTheme} className="p-2 rounded-full text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button> */}
          {user ? (
            <>
                <motion.button onClick={() => onNavigate(targetPage)} className="flex items-center gap-2 text-slate-600 dark:text-gray-200 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
                    <User className="w-5 h-5 bg-blue-500/20 dark:bg-blue-500/50 text-blue-600 dark:text-white p-1 rounded-full" />
                    <span>{t(user.role === 'admin' ? 'adminPanel' : (user.role === 'partner' ? 'partnerPanel' : 'profile'))}</span>
                </motion.button>
                <motion.button onClick={onLogout} className="text-slate-600 dark:text-gray-200 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}>
                    <LogOut className="w-5 h-5"/>
                </motion.button>
            </>
          ) : (
            <>
              <motion.button onClick={() => onNavigate('login')} className="text-slate-600 dark:text-gray-200 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>{t('login')}</motion.button>
              <motion.button onClick={() => onNavigate('partner-signup')} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 cursor-pointer" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>{t('becomePartner')}</motion.button>
            </>
          )}
        </div>
        <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher />
            {/* <button onClick={toggleTheme} className="p-2 rounded-full text-slate-800 dark:text-gray-300 z-50 cursor-pointer">
                {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button> */}
            <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-800 dark:text-white z-50 relative cursor-pointer">{isMobileMenuOpen ? <X className="w-7 h-7"/> : <Menu className="w-7 h-7"/>}</button>
        </div>
      </div>
      <AnimatePresence>{isMobileMenuOpen && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl z-40 md:hidden"><motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="flex flex-col items-center justify-center h-full"><nav className="flex flex-col items-center space-y-6">{navLinks.map(link => (<button key={link.name} onClick={() => handleNavClick(link.page)} className="text-slate-600 dark:text-gray-200 hover:text-slate-900 dark:hover:text-white text-2xl font-semibold cursor-pointer">{link.name}</button>))}</nav><div className="mt-10 pt-6 border-t border-slate-200 dark:border-gray-700 w-4/5 flex flex-col items-center space-y-4">{user ? (<><button onClick={() => handleNavClick(targetPage)} className="text-slate-600 dark:text-gray-200 hover:text-slate-900 dark:hover:text-white text-2xl font-semibold cursor-pointer">{t(user.role === 'admin' ? 'adminPanel' : (user.role === 'partner' ? 'partnerPanel' : 'profile'))}</button><button onClick={onLogout} className="text-red-600 dark:text-red-400 text-2xl font-semibold mt-4 cursor-pointer">{t('logout')}</button></>) : (<><button onClick={() => handleNavClick('login')} className="text-slate-600 dark:text-gray-200 hover:text-slate-900 dark:hover:text-white text-2xl font-semibold cursor-pointer">{t('login')}</button><button onClick={() => onNavigate('partner-signup')} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors w-full max-w-xs text-lg cursor-pointer">{t('becomePartner')}</button></>)}</div></motion.div></motion.div>)}</AnimatePresence>
    </header>
  );
}

function Footer({ onNavigate }) {
    const { t } = useTranslation();
    return (
      <footer className="bg-slate-100 dark:bg-gray-900 border-t border-slate-200 dark:border-gray-800 py-12 px-4 sm:px-8">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-slate-600 dark:text-gray-300">
          <div className="md:col-span-1">
            <h3 onClick={() => onNavigate('home')} className="text-2xl font-bold text-slate-900 dark:text-white cursor-pointer w-max">Auto<span className="text-blue-500">Tap</span></h3>
            <p className="mt-4">Сервис, который всегда под рукой.</p>
          </div>
          <div>
            <h4 className="font-bold text-lg text-slate-800 dark:text-white">{t('navigation')}</h4>
            <ul className="mt-4 space-y-2">
              <li><button onClick={() => onNavigate('home')} className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors text-left cursor-pointer">{t('home')}</button></li>
              <li><button onClick={() => onNavigate('catalog')} className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors text-left cursor-pointer">{t('catalog')}</button></li>
              <li><button onClick={() => onNavigate('partner-signup')} className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors text-left cursor-pointer">{t('partnership')}</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg text-slate-800 dark:text-white">{t('support')}</h4>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors cursor-pointer">FAQ</a></li>
              <li><a href="#" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors cursor-pointer">Связаться с нами</a></li>
              <li><a href="#" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors cursor-pointer">Политика конфиденциальности</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg text-slate-800 dark:text-white">Соцсети</h4>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors cursor-pointer">FB</a>
              <a href="#" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors cursor-pointer">INST</a>
              <a href="#" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors cursor-pointer">TG</a>
            </div>
          </div>
        </div>
        <div className="text-center text-slate-500 dark:text-gray-500 mt-10 border-t border-slate-200 dark:border-gray-800 pt-8">© {new Date().getFullYear()} AutoTap. Все права защищены.</div>
      </footer>
    );
  }

// --- PAGES ---

function HomePage({ onNavigate }) {
  const { t } = useTranslation();
  return (
    <main className="pt-24">
      <section className="relative min-h-screen flex items-center justify-center px-4 -mt-24">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{backgroundImage: "url('https://i.ibb.co/DDbbJjDn/pexels-daniel-andraski-197681005-13065690-1.jpg')"}} />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 text-center flex flex-col items-center">
          <motion.h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight text-white" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>{t('heroTitle')}</motion.h1>
          <motion.p className="mt-6 max-w-2xl text-lg md:text-xl text-gray-200" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>{t('heroSubtitle')}</motion.p>
          <motion.div className="mt-10 w-full max-w-2xl bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-2xl flex flex-col md:flex-row items-center gap-4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.4 }}>
            <div className="w-full flex-grow flex items-center bg-transparent border-b-2 border-transparent focus-within:border-blue-500 transition-colors"><MapPin className="w-6 h-6 text-gray-300 mr-3" /><input type="text" placeholder="Ваш город или адрес" className="w-full bg-transparent text-white placeholder-gray-300 focus:outline-none py-2" /></div>
            <button onClick={() => onNavigate('catalog')} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 cursor-pointer"><Search className="w-5 h-5" /><span>{t('find')}</span></button>
          </motion.div>
        </div>
      </section>
      <section className="py-20 px-4 sm:px-8 bg-white dark:bg-gray-900"><div className="container mx-auto"><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.7 }}><h2 className="text-4xl font-bold text-center text-slate-900 dark:text-white">{t('popularServices')}</h2><p className="text-center text-slate-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">{t('popularServicesDesc')}</p></motion.div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">{popularServicesData.map((service, index) => (<ServiceCard key={service.name} service={service} index={index} />))}</div></div></section>
      <section className="py-20 px-4 sm:px-8 bg-slate-50 dark:bg-gray-800/30" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/carbon-fibre-v2.png')"}}><div className="container mx-auto text-center"><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.7 }}><h2 className="text-4xl font-bold text-slate-900 dark:text-white">{t('whyChooseUs')}</h2><p className="text-slate-600 dark:text-gray-300 mt-4 max-w-3xl mx-auto">{t('whyChooseUsDesc')}</p></motion.div><AdvantagesSlider /></div></section>
      <section className="py-20 px-4 sm:px-8 bg-white dark:bg-gray-900"><div className="container mx-auto"><motion.div className="bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-800 rounded-2xl p-10 md:p-16 text-center flex flex-col items-center" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.7 }}><h2 className="text-4xl font-bold text-white">{t('areYouMechanic')}</h2><p className="mt-4 text-blue-100 max-w-2xl">{t('areYouMechanicDesc')}</p><button onClick={() => onNavigate('partner-signup')} className="mt-8 bg-white hover:bg-gray-200 text-blue-700 font-bold py-4 px-10 rounded-lg transition-all duration-300 transform hover:scale-105 text-lg shadow-xl cursor-pointer">{t('becomePartner')}</button></motion.div></div></section>
    </main>
  );
}

function CatalogPage({ onOrder }) {
    const [priceRange, setPriceRange] = useState(150);
    const FilterSection = ({ title, children }) => (<div className="py-6 border-b border-slate-200 dark:border-gray-700"><h3 className="font-semibold text-slate-800 dark:text-white mb-4">{title}</h3>{children}</div>);
    const ServiceResultCard = ({ service, index }) => (
        <motion.div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden flex flex-col md:flex-row group transition-all duration-300 hover:shadow-lg dark:hover:bg-gray-700/50" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.05 }}>
            <div className="md:w-1/3 h-48 md:h-auto overflow-hidden"><img src={service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /></div>
            <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start"><h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{service.name}</h3><div className="flex items-center gap-1 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 px-2 py-1 rounded-md text-sm font-bold"><Star className="w-4 h-4 text-yellow-500 dark:text-yellow-400" /><span>{service.rating}</span></div></div>
                <p className="text-slate-500 dark:text-gray-300 text-sm mb-4">от {service.provider}</p>
                <div className="flex-grow" />
                <div className="flex justify-between items-end mt-4">
                    <div><p className="text-slate-500 dark:text-gray-400 text-sm">Цена от</p><p className="text-2xl font-bold text-slate-900 dark:text-white">{`${service.currency}${service.price}`}</p></div>
                    <button onClick={() => onOrder(service)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300 cursor-pointer">Заказать</button>
                </div>
            </div>
        </motion.div>
    );
    return (
        <main className="bg-slate-50 dark:bg-gray-900 text-slate-800 dark:text-white min-h-screen pt-24">
            <div className="container mx-auto px-4 py-10">
                <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold mb-2">Найти сервис</motion.h1>
                <motion.p initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{delay: 0.1}} className="text-slate-600 dark:text-gray-300 mb-8">Найдено {catalogServicesData.length} услуг в вашем районе</motion.p>
                <div className="flex flex-col lg:flex-row gap-8">
                    <motion.aside initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{delay: 0.2}} className="lg:w-1/4"><div className="bg-white dark:bg-gray-800 p-6 rounded-xl sticky top-28 shadow-sm"><div className="flex justify-between items-center mb-4"><h2 className="text-2xl font-bold">Фильтры</h2><SlidersHorizontal className="w-6 h-6 text-blue-500 dark:text-blue-400"/></div><FilterSection title="Тип услуги"><select className="w-full bg-slate-100 dark:bg-gray-700 border-slate-200 dark:border-gray-600 rounded-md p-2 text-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 cursor-pointer"><option>Любой</option><option>Шиномонтаж</option><option>Диагностика</option><option>Детейлинг</option><option>Ремонт</option></select></FilterSection><FilterSection title="Цена до"><input type="range" min="10" max="500" value={priceRange} onChange={e => setPriceRange(e.target.value)} className="w-full h-2 bg-slate-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500" /><div className="text-right font-bold text-slate-800 dark:text-white mt-2">{`$${priceRange}`}</div></FilterSection><FilterSection title="Рейтинг"><div className="flex justify-between">{[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-8 h-8 text-gray-300 dark:text-gray-500 hover:text-yellow-400 cursor-pointer transition-colors"/>)}</div></FilterSection><button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg mt-6 transition-colors cursor-pointer">Применить</button></div></motion.aside>
                    <div className="lg:w-3/4"><div className="grid grid-cols-1 gap-6">{catalogServicesData.map((service, index) => (<ServiceResultCard key={service.id} service={service} index={index}/>))}</div></div>
                </div>
            </div>
        </main>
    );
}

function AuthPage({ onNavigate }) {
    const { t } = useTranslation();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleEmailPasswordSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                await setDoc(doc(db, "users", user.uid), {
                    email: user.email,
                    role: 'client',
                    createdAt: new Date(),
                });
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError('');
        setLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (!userDocSnap.exists()) {
                await setDoc(userDocRef, {
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    role: 'client',
                    createdAt: new Date(),
                });
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }, exit: { opacity: 0, y: -20, transition: { duration: 0.3 } } };
    const InputField = ({icon: Icon, ...props}) => (<div className="relative"><Icon className="absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5 text-gray-400" /><input {...props} className="w-full bg-slate-200/50 dark:bg-gray-700/50 border border-slate-300 dark:border-gray-600 rounded-lg p-3 pl-10 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>);
    
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-gray-900 flex items-center justify-center p-4 pt-24" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/carbon-fibre-v2.png')"}}>
            <motion.div initial={{opacity: 0, scale: 0.9}} animate={{opacity: 1, scale: 1}} className="w-full max-w-md">
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white cursor-pointer" onClick={() => onNavigate('home')}>Auto<span className="text-blue-500">Tap</span></h1>
                        <p className="text-slate-600 dark:text-gray-300 mt-2">{isLogin ? t('welcomeBack') : t('createAccountPrompt')}</p>
                    </div>
                    <div className="flex justify-center bg-slate-200/50 dark:bg-gray-700/50 rounded-lg p-1 mb-6">
                        <button onClick={() => setIsLogin(true)} className={`w-1/2 py-2 rounded-md text-sm font-semibold transition-colors cursor-pointer ${isLogin ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-gray-300'}`}>{t('login')}</button>
                        <button onClick={() => setIsLogin(false)} className={`w-1/2 py-2 rounded-md text-sm font-semibold transition-colors cursor-pointer ${!isLogin ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-gray-300'}`}>Регистрация</button>
                    </div>
                    
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg relative mb-4 text-sm flex items-center gap-2">
                           <AlertTriangle className="w-4 h-4"/> <span>{error}</span>
                        </div>
                    )}

                    <AnimatePresence mode="wait">
                        <motion.div key={isLogin ? 'login' : 'signup'} variants={formVariants} initial="hidden" animate="visible" exit="exit">
                           <form className="space-y-4" onSubmit={handleEmailPasswordSubmit}>
                                <InputField type="email" placeholder="Email" icon={Mail} value={email} onChange={e => setEmail(e.target.value)} required />
                                <InputField type="password" placeholder="Пароль" icon={Lock} value={password} onChange={e => setPassword(e.target.value)} required />
                                {isLogin && <div className="flex justify-end items-center"><a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">{t('forgotPassword')}</a></div>}
                                <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                    {loading ? 'Загрузка...' : (isLogin ? t('login') : t('createAccount'))}
                                </button>
                            </form>
                        </motion.div>
                    </AnimatePresence>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-slate-300 dark:border-gray-600" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-gray-800 text-slate-500 dark:text-gray-400">Или продолжите с</span>
                        </div>
                    </div>

                    <div>
                        <button onClick={handleGoogleSignIn} disabled={loading} className="w-full flex justify-center items-center gap-3 bg-white dark:bg-gray-700 hover:bg-slate-50 dark:hover:bg-gray-600 border border-slate-300 dark:border-gray-600 text-slate-700 dark:text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 cursor-pointer">
                            <svg className="w-5 h-5" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                                <g fill="none" fillRule="evenodd">
                                    <path d="M17.64 9.2045c0-.6381-.0573-1.2518-.1682-1.8409H9v3.4818h4.8436c-.2086 1.125-.844 2.0782-1.7958 2.7164v2.2581h2.9087c1.7018-1.5668 2.6836-3.8745 2.6836-6.6154z" fill="#4285F4"/>
                                    <path d="M9 18c2.43 0 4.4673-.806 5.9564-2.1818l-2.9087-2.2581c-.806.5409-1.8368.8618-3.0477.8618-2.3455 0-4.3282-1.5818-5.0355-3.7091H.9564v2.3318C2.4364 16.1455 5.4273 18 9 18z" fill="#34A853"/>
                                    <path d="M3.9645 10.7027c-.1818-.5409-.2864-1.1182-.2864-1.7209s.1045-1.18.2864-1.7209V4.9282H.9564C.3477 6.1732 0 7.5455 0 9.0001c0 1.4546.3477 2.8269.9564 4.0719l3.0081-2.3693z" fill="#FBBC05"/>
                                    <path d="M9 3.5455c1.3227 0 2.5182.4545 3.4409 1.3455l2.5818-2.5818C13.4636.891 11.43 0 9 0 5.4273 0 2.4364 1.8545.9564 4.9282l3.0081 2.3318C4.6718 5.1273 6.6545 3.5455 9 3.5455z" fill="#EA4335"/>
                                </g>
                            </svg>
                            Google
                        </button>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}

function PartnerSignUpPage({ onNavigate }) {
    const [companyName, setCompanyName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePartnerSignUp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                displayName: companyName,
                role: 'partner',
                createdAt: new Date(),
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const InputField = ({icon: Icon, ...props}) => (<div className="relative"><Icon className="absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5 text-gray-400" /><input {...props} className="w-full bg-slate-200/50 dark:bg-gray-700/50 border border-slate-300 dark:border-gray-600 rounded-lg p-3 pl-10 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>);
    
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-gray-900 flex items-center justify-center p-4 pt-24" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/carbon-fibre-v2.png')"}}>
            <motion.div initial={{opacity: 0, scale: 0.9}} animate={{opacity: 1, scale: 1}} className="w-full max-w-md">
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white cursor-pointer" onClick={() => onNavigate('home')}>Auto<span className="text-blue-500">Tap</span></h1>
                        <p className="text-slate-600 dark:text-gray-300 mt-2">Станьте нашим партнёром</p>
                    </div>
                    
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg relative mb-4 text-sm flex items-center gap-2">
                           <AlertTriangle className="w-4 h-4"/> <span>{error}</span>
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handlePartnerSignUp}>
                        <InputField type="text" placeholder="Название компании или ваше имя" icon={Building} value={companyName} onChange={e => setCompanyName(e.target.value)} required />
                        <InputField type="email" placeholder="Рабочий Email" icon={Mail} value={email} onChange={e => setEmail(e.target.value)} required />
                        <InputField type="password" placeholder="Пароль" icon={Lock} value={password} onChange={e => setPassword(e.target.value)} required />
                        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                            {loading ? 'Регистрация...' : 'Зарегистрироваться как партнёр'}
                        </button>
                    </form>
                    <div className="text-center mt-6">
                        <button onClick={() => onNavigate('login')} className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Уже есть аккаунт? Войти</button>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}

function AddCarModal({ isOpen, onClose, onAddCar }) {
    const { t } = useTranslation();
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [plate, setPlate] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!make || !model || !year || !plate) {
            setError(t('fillAllFields'));
            return;
        }
        onAddCar({ make, model, year, plate });
        setMake(''); setModel(''); setYear(''); setPlate(''); setError('');
    };

    if (!isOpen) return null;

    return (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.9, opacity:0}} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl max-w-md w-full">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">{t('addCarTitle')}</h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder={t('carMake')} value={make} onChange={e => setMake(e.target.value)} className="w-full bg-slate-100 dark:bg-gray-700 border-transparent rounded-md p-3 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500" />
                    <input type="text" placeholder={t('carModel')} value={model} onChange={e => setModel(e.target.value)} className="w-full bg-slate-100 dark:bg-gray-700 border-transparent rounded-md p-3 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500" />
                    <input type="number" placeholder={t('carYear')} value={year} onChange={e => setYear(e.target.value)} className="w-full bg-slate-100 dark:bg-gray-700 border-transparent rounded-md p-3 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500" />
                    <input type="text" placeholder={t('carPlate')} value={plate} onChange={e => setPlate(e.target.value)} className="w-full bg-slate-100 dark:bg-gray-700 border-transparent rounded-md p-3 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500" />
                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={onClose} className="w-full bg-slate-200 dark:bg-gray-600 hover:bg-slate-300 dark:hover:bg-gray-500 text-slate-800 dark:text-white font-semibold py-3 rounded-lg transition-colors cursor-pointer">{t('cancel')}</button>
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors cursor-pointer">{t('add')}</button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}


function ProfilePage({ user, onLogout }) {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('settings');
    const [cars, setCars] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (user) {
            const carsCollectionRef = collection(db, 'users', user.uid, 'cars');
            const unsubscribe = onSnapshot(carsCollectionRef, (snapshot) => {
                const carsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setCars(carsData);
            });
            return () => unsubscribe();
        }
    }, [user]);

    const handleAddCar = async (carData) => {
        if (user) {
            try {
                const carsCollectionRef = collection(db, 'users', user.uid, 'cars');
                await addDoc(carsCollectionRef, carData);
                setIsModalOpen(false);
            } catch (error) {
                console.error("Error adding car: ", error);
            }
        }
    };

    const handleDeleteCar = async (carId) => {
        if (user) {
            if (window.confirm(t('deleteCarConfirm'))) {
                try {
                    const carDocRef = doc(db, 'users', user.uid, 'cars', carId);
                    await deleteDoc(carDocRef);
                } catch (error) {
                    console.error("Error deleting car: ", error);
                }
            }
        }
    };

    const getStatusChip = (status) => {
        switch (status) {
            case 'Выполнен': return 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400';
            case 'Отменен': return 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400';
            default: return 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400';
        }
    };
    const menuItems = [ { id: 'history', label: t('orderHistory'), icon: List }, { id: 'favorites', label: t('favoriteProviders'), icon: Heart }, { id: 'settings', label: t('settings'), icon: Settings } ];
    
    const renderContent = () => {
        switch(activeTab) {
            case 'history': return (<div className="space-y-4">{orderHistoryData.map((order, i) => (<motion.div key={order.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg flex items-center gap-4" initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} transition={{delay: i * 0.1}}><img src={order.image} className="w-16 h-16 rounded-md object-cover hidden sm:block" alt={order.serviceName}/><div className="flex-grow"><p className="font-bold text-slate-800 dark:text-white">{order.serviceName}</p><p className="text-sm text-slate-500 dark:text-gray-400">{order.provider} · {order.date}</p></div><div className="text-right"><p className="font-bold text-slate-800 dark:text-white text-lg">{`$${order.amount}`}</p><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusChip(order.status)}`}>{order.status}</span></div></motion.div>))}</div>);
            case 'favorites': return (<div><p className="text-slate-500 dark:text-gray-400">Этот раздел находится в разработке.</p></div>);
            case 'settings': return (
                <div className="space-y-8">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">{t('personalInfo')}</h3>
                        <div className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-slate-500 dark:text-gray-400">Имя</p>
                                    <p className="text-slate-800 dark:text-white">{user.displayName || 'Не указано'}</p>
                                </div>
                                <button className="text-blue-600 dark:text-blue-400 text-sm cursor-pointer">Изменить</button>
                            </div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-slate-500 dark:text-gray-400">Email</p>
                                    <p className="text-slate-800 dark:text-white">{user.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">{t('myCars')}</h3>
                        <div className="space-y-4">
                            {cars.length > 0 ? (
                                cars.map(car => (
                                    <div key={car.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-blue-100 dark:bg-blue-500/20 p-3 rounded-lg"><Car className="w-6 h-6 text-blue-600 dark:text-blue-300"/></div>
                                            <div>
                                                <p className="font-bold text-slate-800 dark:text-white">{car.make} {car.model}</p>
                                                <p className="text-sm text-slate-500 dark:text-gray-400">{car.year} · {car.plate}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => handleDeleteCar(car.id)} className="text-slate-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 cursor-pointer transition-colors"><Trash2 className="w-5 h-5"/></button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-500 dark:text-gray-400 text-center py-4">{t('noCars')}</p>
                            )}
                            <button onClick={() => setIsModalOpen(true)} className="w-full border-2 border-dashed border-slate-300 dark:border-gray-600 hover:border-blue-500 text-slate-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 p-4 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer">
                                <PlusCircle className="w-5 h-5" />
                                {t('addCar')}
                            </button>
                        </div>
                    </div>
                </div>
            );
            default: return null;
        }
    };

    return (
        <>
            <AddCarModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddCar={handleAddCar} />
            <main className="bg-slate-50 dark:bg-gray-900 text-slate-800 dark:text-white min-h-screen pt-24">
                <div className="container mx-auto px-4 py-10">
                    <motion.div initial={{opacity: 0, y: -20}} animate={{opacity: 1, y: 0}} className="flex items-center gap-4 mb-8">
                        <img src={user.photoURL || `https://placehold.co/256x256/E2E8F0/4A5568?text=${user.email[0].toUpperCase()}`} className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-700" alt="User Avatar" />
                        <div>
                            <h1 className="text-4xl font-bold">{t('myCabinet')}</h1>
                            <p className="text-slate-600 dark:text-gray-300">{t('welcomeUser')}, {user?.displayName || user?.email}!</p>
                        </div>
                    </motion.div>
                    <div className="flex flex-col lg:flex-row gap-8">
                        <motion.aside initial={{opacity: 0, x: -20}} animate={{opacity: 1, x: 0}} transition={{delay: 0.1}} className="lg:w-1/4">
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl sticky top-28 shadow-sm">
                                <ul className="space-y-2">
                                    {menuItems.map(item => (
                                        <li key={item.id}>
                                            <button onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 p-3 rounded-md text-left transition-colors cursor-pointer ${activeTab === item.id ? 'bg-blue-600 text-white font-semibold' : 'hover:bg-slate-100 dark:hover:bg-gray-700'}`}>
                                                <item.icon className="w-5 h-5"/>
                                                {item.label}
                                            </button>
                                        </li>
                                    ))}
                                    <li>
                                        <button onClick={onLogout} className="w-full flex items-center gap-3 p-3 rounded-md text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20 transition-colors cursor-pointer">
                                            <LogOut className="w-5 h-5"/>
                                            {t('logout')}
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </motion.aside>
                        <motion.main initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} transition={{delay: 0.2}} className="lg:w-3/4 bg-slate-100/50 dark:bg-gray-800/50 rounded-xl p-6">
                            <AnimatePresence mode="wait">
                                <motion.div key={activeTab} initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -10}} transition={{duration: 0.2}}>
                                    {renderContent()}
                                </motion.div>
                            </AnimatePresence>
                        </motion.main>
                    </div>
                </div>
            </main>
        </>
    );
}

function PartnerProfilePage({ user, onLogout }) {
    const StatCard = ({ title, value, icon: Icon, color }) => (<div className="bg-white dark:bg-gray-800 p-6 rounded-xl flex items-center gap-4 shadow-sm"><div className={`p-3 rounded-full ${color}`}><Icon className="w-6 h-6 text-white" /></div><div><p className="text-slate-500 dark:text-gray-400 text-sm">{title}</p><p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p></div></div>);
    
    return (
        <main className="bg-slate-50 dark:bg-gray-900 text-slate-800 dark:text-white min-h-screen pt-24">
            <div className="container mx-auto px-4 py-10">
                <motion.div initial={{opacity: 0, y: -20}} animate={{opacity: 1, y: 0}} className="flex items-center gap-4 mb-8">
                    <img src={user.photoURL || `https://placehold.co/256x256/1A202C/A0AEC0?text=${(user.displayName || 'P')[0]}`} className="w-24 h-24 rounded-full border-4 border-gray-300 dark:border-gray-700" alt="Partner Avatar" />
                    <div>
                        <h1 className="text-4xl font-bold">Панель партнера</h1>
                        <p className="text-slate-600 dark:text-gray-300">Добро пожаловать, {user?.displayName || user?.email}!</p>
                    </div>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Всего заказов" value="152" icon={List} color="bg-blue-500" />
                    <StatCard title="Общий доход" value="$8,430" icon={DollarSign} color="bg-green-500" />
                    <StatCard title="Ваш рейтинг" value="4.9" icon={Star} color="bg-yellow-500" />
                    <StatCard title="Новых отзывов" value="3" icon={MessageSquare} color="bg-purple-500" />
                </div>
                 <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                    <h2 className="text-2xl font-bold mb-4">Ваши активные услуги</h2>
                    <p className="text-slate-500 dark:text-gray-400">Здесь будет список ваших услуг и возможность ими управлять...</p>
                </div>
            </div>
        </main>
    );
}

function AdminPage({ user, onLogout }) {
    const StatCard = ({ title, value, icon: Icon, color }) => (<div className="bg-white dark:bg-gray-800 p-6 rounded-xl flex items-center gap-4 shadow-sm"><div className={`p-3 rounded-full ${color}`}><Icon className="w-6 h-6 text-white" /></div><div><p className="text-slate-500 dark:text-gray-400 text-sm">{title}</p><p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p></div></div>);
    
    return (
        <main className="bg-slate-50 dark:bg-gray-900 text-slate-800 dark:text-white min-h-screen pt-24">
            <div className="container mx-auto px-4 py-10">
                <motion.div initial={{opacity: 0, y: -20}} animate={{opacity: 1, y: 0}} className="flex items-center gap-4 mb-8">
                    <img src={user.photoURL || `https://placehold.co/256x256/4299E1/FFFFFF?text=A`} className="w-24 h-24 rounded-full border-4 border-blue-500" alt="Admin Avatar" />
                    <div>
                        <h1 className="text-4xl font-bold">Панель Администратора</h1>
                        <p className="text-slate-600 dark:text-gray-300">Добро пожаловать, {user?.displayName || user?.email}!</p>
                    </div>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Всего пользователей" value="1,245" icon={Users} color="bg-blue-500" />
                    <StatCard title="Активных услуг" value="312" icon={Briefcase} color="bg-green-500" />
                    <StatCard title="Заказов сегодня" value="42" icon={DollarSign} color="bg-yellow-500" />
                    <StatCard title="Отзывов на модерации" value="8" icon={MessageSquare} color="bg-red-500" />
                </div>
                 <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                    <h2 className="text-2xl font-bold mb-4">Недавняя активность</h2>
                    <p className="text-slate-500 dark:text-gray-400">Здесь будет лента последних событий в системе...</p>
                </div>
            </div>
        </main>
    );
}

function AboutPage() {
    const timelineEvents = [
      { year: '2023', title: 'Рождение идеи', description: 'Основатели, столкнувшись с трудностями поиска качественного автосервиса, решают создать AutoTap.' },
      { year: '2023', title: 'Разработка и запуск', description: 'Запуск бета-версии платформы в одном городе. Привлечение первых 50 партнеров.' },
      { year: '2024', title: 'Рост и масштабирование', description: 'Расширение на 5 крупных городов, более 10,000 успешных заказов.' },
      { year: '2025', title: 'Новые горизонты', description: 'Внедрение AI для подбора мастеров и запуск мобильного приложения.' },
    ];
  
    return (
      <main className="bg-white dark:bg-gray-900 text-slate-800 dark:text-white min-h-screen pt-24">
        <section className="relative py-20 md:py-32 px-4 text-center">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 dark:opacity-20" style={{backgroundImage: "url('https://i.ibb.co/WNfkwHwF/pexels-daniel-andraski-197681005-13065692.jpg')"}} />
          <div className="relative z-10 container mx-auto">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-4xl md:text-6xl font-extrabold tracking-tight">Мы меняем мир автосервиса.</motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-slate-600 dark:text-gray-300">AutoTap был создан с одной простой целью: сделать уход за автомобилем максимально удобным, прозрачным и надежным. Мы соединяем автовладельцев с лучшими выездными специалистами, экономя ваше время и нервы.</motion.p>
          </div>
        </section>
  
        <section className="py-20 px-4 sm:px-8 bg-slate-50 dark:bg-gray-800/50">
          <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.7 }}>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Наша миссия</h2>
              <p className="text-slate-600 dark:text-gray-300 mb-4">Мы стремимся полностью избавить автовладельцев от головной боли, связанной с обслуживанием автомобиля. Больше никаких очередей, неожиданных счетов и потраченных впустую выходных. Только качественный сервис там, где удобно вам.</p>
              <ul className="space-y-3">
                <li className="flex items-start"><CheckCircle className="w-6 h-6 text-blue-500 dark:text-blue-400 mr-3 mt-1 flex-shrink-0" /><span><strong className="text-slate-800 dark:text-white">Прозрачность:</strong> Честные цены и отзывы. Вы всегда знаете, за что платите.</span></li>
                <li className="flex items-start"><CheckCircle className="w-6 h-6 text-blue-500 dark:text-blue-400 mr-3 mt-1 flex-shrink-0" /><span><strong className="text-slate-800 dark:text-white">Удобство:</strong> Мастер приезжает к вам — домой, на работу, куда угодно.</span></li>
                <li className="flex items-start"><CheckCircle className="w-6 h-6 text-blue-500 dark:text-blue-400 mr-3 mt-1 flex-shrink-0" /><span><strong className="text-slate-800 dark:text-white">Надежность:</strong> Только проверенные исполнители с гарантией на все работы.</span></li>
              </ul>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.7 }} className="rounded-xl overflow-hidden shadow-2xl"><img src="https://i.ibb.co/RkFVd7ZN/pexels-tim-samuel-5835426.jpg " alt="Удобство сервиса" className="w-full h-full object-cover" /></motion.div>
          </div>
        </section>
  
        <section className="py-20 px-4 sm:px-8 bg-white dark:bg-gray-900">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Наша история</h2>
            <div className="relative max-w-3xl mx-auto">
              <div className="absolute left-1/2 top-0 h-full w-0.5 bg-slate-200 dark:bg-gray-700 -translate-x-1/2" aria-hidden="true"></div>
              <div className="relative space-y-16">
                {timelineEvents.map((event, index) => (
                  <motion.div key={index} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.6 }} className="flex flex-col md:flex-row items-center">
                    <div className={`flex-1 md:w-1/2 ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left md:order-2'}`}>
                      <p className="text-blue-500 dark:text-blue-400 font-bold text-xl mb-1">{event.year}</p>
                      <h3 className="text-2xl font-semibold">{event.title}</h3>
                      <p className="text-slate-600 dark:text-gray-400 mt-2">{event.description}</p>
                    </div>
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

// --- MAIN APP COMPONENT ---

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [bookingService, setBookingService] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [theme, toggleTheme] = useTheme();
  const prevUser = usePrevious(user);

  useEffect(() => {
    if (auth) {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
            signInWithCustomToken(auth, __initial_auth_token).catch(error => {
                console.error("Custom token sign-in error:", error);
            });
        }

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            try {
                if (currentUser) {
                    const userDocRef = doc(db, "users", currentUser.uid);
                    const userDocSnap = await getDoc(userDocRef);
                    if (userDocSnap.exists()) {
                        setUser({ ...currentUser, role: userDocSnap.data().role });
                    } else {
                        setUser({ ...currentUser, role: 'client' });
                    }
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Error fetching user role:", error);
                setUser(null);
            } finally {
                setIsAuthReady(true);
            }
        });

        return () => unsubscribe();
    } else {
        setIsAuthReady(true);
    }
  }, []);
  
  useEffect(() => {
    if (!isAuthReady) return;

    if (!prevUser && user) {
        const targetPage = user.role === 'admin' ? 'admin' : (user.role === 'partner' ? 'partner-profile' : 'profile');
        setCurrentPage(targetPage);
        return;
    }

    if (prevUser && !user) {
        setCurrentPage('home');
        return;
    }

    if (!user) {
        const protectedPages = ['profile', 'admin', 'partner-profile'];
        if (protectedPages.includes(currentPage)) {
            setCurrentPage('login');
        }
    }
  }, [user, prevUser, isAuthReady, currentPage]);


  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    if(auth) {
        signOut(auth).catch((error) => {
          console.error('Sign out error', error);
        });
    }
  };
  
  const handleOrder = (service) => {
    if (!user) {
        handleNavigate('login');
        return;
    }
    setBookingService(service);
    setIsBookingOpen(true);
  };

  const PageWrapper = ({ children }) => (
    <motion.div key={currentPage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      {children}
    </motion.div>
  );

  const renderPage = () => {
    if (!isAuthReady) {
      return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-slate-800 dark:text-white">Загрузка...</div>;
    }

    switch (currentPage) {
      case 'home': return <PageWrapper><HomePage onNavigate={handleNavigate} /></PageWrapper>;
      case 'catalog': return <PageWrapper><CatalogPage onOrder={handleOrder} /></PageWrapper>;
      case 'login': 
        if (user) { handleNavigate('profile'); return null; }
        return <PageWrapper><AuthPage onNavigate={handleNavigate} /></PageWrapper>;
      case 'partner-signup':
        if (user) { handleNavigate('partner-profile'); return null; }
        return <PageWrapper><PartnerSignUpPage onNavigate={handleNavigate} /></PageWrapper>;
      case 'about': return <PageWrapper><AboutPage /></PageWrapper>;
      case 'profile':
        if (!user) { handleNavigate('login'); return null; }
        if (user.role !== 'client') { handleNavigate('home'); return null; }
        return <PageWrapper><ProfilePage user={user} onLogout={handleLogout} /></PageWrapper>;
      case 'partner-profile':
        if (!user) { handleNavigate('login'); return null; }
        if (user.role !== 'partner') { handleNavigate('home'); return null; }
        return <PageWrapper><PartnerProfilePage user={user} onLogout={handleLogout} /></PageWrapper>;
      case 'admin':
        if (!user) { handleNavigate('login'); return null; }
        if (user.role !== 'admin') { handleNavigate('home'); return null; }
        return <PageWrapper><AdminPage user={user} onLogout={handleLogout} /></PageWrapper>;
      default: return <PageWrapper><HomePage onNavigate={handleNavigate} /></PageWrapper>;
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-300">
      <Header onNavigate={handleNavigate} user={user} theme={theme} toggleTheme={toggleTheme} onLogout={handleLogout} />
      <AnimatePresence mode="wait">
        {renderPage()}
      </AnimatePresence>
      <Footer onNavigate={handleNavigate} />
      <BackToTopButton />
      <AnimatePresence>
        {isBookingOpen && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.9, opacity:0}} className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-xl max-w-sm w-full">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Бронирование услуги</h2>
                  <p className="text-slate-600 dark:text-gray-300 mb-6">Этот функционал находится в разработке и будет доступен в ближайшее время.</p>
                  <button onClick={() => setIsBookingOpen(false)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-8 rounded-lg w-full cursor-pointer">Понятно</button>
              </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}

// ❗ ВАЖНО: ЧТОБЫ ПЕРЕКЛЮЧАТЕЛЬ ТЕМЫ ЗАРАБОТАЛ:
// 1. Убедитесь, что в файле `tailwind.config.js` есть строка `darkMode: 'class'`.
// 2. ПОЛНОСТЬЮ ПЕРЕЗАПУСТИТЕ ваш сервер разработки (остановите его командой Ctrl+C и запустите снова).
//    Tailwind применяет такие изменения только после перезапуска.
//
// module.exports = {
//   darkMode: 'class', // <--- ЭТА СТРОКА ОБЯЗАТЕЛЬНА
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }
