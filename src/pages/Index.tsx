import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const LEADS_URL = "https://functions.poehali.dev/5dc917cb-1c96-4cfd-b6c8-adb0aec19f31";
const IMG_BUILDING = "https://cdn.poehali.dev/projects/fb115b39-8c84-40f6-9584-70685d6c64c1/files/8abbde57-a635-4434-9464-8719a6294457.jpg";
const IMG_TEAM = "https://cdn.poehali.dev/projects/fb115b39-8c84-40f6-9584-70685d6c64c1/files/c9fcb170-4888-4668-8d23-59110f32c444.jpg";
const IMG_INTERIOR = "https://cdn.poehali.dev/projects/fb115b39-8c84-40f6-9584-70685d6c64c1/files/4b0be3c2-5eb0-40b1-81dc-b7b79b812fa2.jpg";


// ─── Попап с формой ───
function LeadModal({ source, onClose }: { source: string; onClose: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) { setError("Введите номер телефона"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(LEADS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, address, comment, source }),
      });
      if (res.ok) { setSuccess(true); }
      else { setError("Ошибка отправки. Попробуйте ещё раз."); }
    } catch {
      setError("Нет соединения. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md relative" style={{ background: "var(--coal-2)", border: "1px solid rgba(201,168,76,0.3)" }}>
        <button onClick={onClose} className="absolute top-4 right-4 transition-opacity hover:opacity-70" style={{ color: "var(--smoke)" }}>
          <Icon name="X" size={20} />
        </button>

        {success ? (
          <div className="p-10 text-center">
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center" style={{ background: "var(--gold)" }}>
              <Icon name="Check" size={28} style={{ color: "var(--coal)" }} />
            </div>
            <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Oswald', sans-serif" }}>Заявка принята!</h3>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--smoke)" }}>
              Свяжемся с вами в течение 15 минут и согласуем удобное время осмотра.
            </p>
            <button onClick={onClose} className="w-full py-3 text-sm uppercase tracking-widest"
              style={{ fontFamily: "'Oswald', sans-serif", background: "var(--gold)", color: "var(--coal)" }}>
              Закрыть
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="p-8 space-y-4">
            <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Oswald', sans-serif" }}>
              Оставить <span className="gradient-gold">заявку</span>
            </h3>
            <p className="text-xs mb-4" style={{ color: "var(--smoke)" }}>Свяжемся в течение 15 минут</p>

            <div>
              <label className="text-xs uppercase tracking-[0.2em] block mb-2" style={{ color: "var(--smoke)" }}>Ваше имя</label>
              <input value={name} onChange={e => setName(e.target.value)}
                placeholder="Иван Иванов" className="input-dark w-full px-4 py-3 text-sm" style={{ borderRadius: 0 }} />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] block mb-2" style={{ color: "var(--smoke)" }}>
                Телефон <span style={{ color: "var(--gold)" }}>*</span>
              </label>
              <input
                type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="+375 29 123 45 67"
                className="input-dark w-full px-4 py-3 text-sm" style={{ borderRadius: 0 }}
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] block mb-2" style={{ color: "var(--smoke)" }}>Адрес квартиры</label>
              <input value={address} onChange={e => setAddress(e.target.value)}
                placeholder="ул. Ленина, 10, кв. 5" className="input-dark w-full px-4 py-3 text-sm" style={{ borderRadius: 0 }} />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] block mb-2" style={{ color: "var(--smoke)" }}>Комментарий</label>
              <textarea value={comment} onChange={e => setComment(e.target.value)}
                placeholder="Опишите вашу ситуацию..." rows={3}
                className="input-dark w-full px-4 py-3 text-sm resize-none" style={{ borderRadius: 0 }} />
            </div>

            {error && <p className="text-xs py-2 px-3" style={{ color: "#e05252", background: "rgba(224,82,82,0.1)" }}>{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full py-4 text-sm uppercase tracking-[0.2em] transition-colors duration-200 disabled:opacity-60"
              style={{ fontFamily: "'Oswald', sans-serif", background: "var(--gold)", color: "var(--coal)" }}>
              {loading ? "Отправляем..." : "Отправить заявку"}
            </button>
            <p className="text-xs text-center" style={{ color: "var(--smoke)" }}>
              Нажимая кнопку, вы соглашаетесь на обработку персональных данных
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Хелперы ───
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function RevealBlock({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(36px)",
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

// ─── Данные ───
const ADVANTAGES = [
  { icon: "Zap", title: "За 24 часа", desc: "Оценка и предложение в течение суток после обращения" },
  { icon: "ShieldCheck", title: "Без риелторов", desc: "Работаем напрямую — никаких посредников и лишних комиссий" },
  { icon: "Banknote", title: "Деньги сразу", desc: "Наличные или перевод в день подписания договора" },
  { icon: "FileText", title: "Все документы", desc: "Берём на себя полное юридическое сопровождение сделки" },
  { icon: "Home", title: "Любое состояние", desc: "Выкупаем квартиры даже с долгами, обременением и в плохом состоянии" },
  { icon: "MapPin", title: "Весь Брест", desc: "Работаем во всех районах города и Брестском районе" },
];

const STEPS = [
  { num: "01", title: "Оставьте заявку", desc: "Позвоните или заполните форму — ответим в течение 15 минут" },
  { num: "02", title: "Бесплатная оценка", desc: "Наш эксперт осмотрит квартиру и озвучит честную цену" },
  { num: "03", title: "Договор и аванс", desc: "Подписываем договор и при необходимости выдаём аванс" },
  { num: "04", title: "Деньги на руках", desc: "Регистрация сделки и полный расчёт в удобное для вас время" },
];

const CASES = [
  { area: "54 м²", district: "Московский р-н", price: "62 000 $", days: "3 дня", tag: "Долг по ЖКХ" },
  { area: "76 м²", district: "Ленинский р-н", price: "89 000 $", days: "5 дней", tag: "Срочно нужны деньги" },
  { area: "38 м²", district: "Октябрьский р-н", price: "41 500 $", days: "2 дня", tag: "Наследство" },
  { area: "92 м²", district: "Советский р-н", price: "115 000 $", days: "7 дней", tag: "Переезд за границу" },
];

const GALLERY = [
  { img: IMG_BUILDING, label: "Объект на ул. Ленина" },
  { img: IMG_INTERIOR, label: "3-комнатная квартира" },
  { img: IMG_BUILDING, label: "Новостройка Московский р-н" },
  { img: IMG_INTERIOR, label: "Однокомнатная Советский р-н" },
];

const TEAM = [
  { name: "Александр Ковалёв", role: "Директор", exp: "12 лет в недвижимости", img: IMG_TEAM },
  { name: "Марина Соколова", role: "Ведущий юрист", exp: "8 лет в сделках с недвижимостью", img: IMG_TEAM },
  { name: "Игорь Петров", role: "Оценщик", exp: "10 лет опыта оценки", img: IMG_TEAM },
];

const REVIEWS = [
  { name: "Ольга Т.", text: "Продала квартиру за 4 дня. Никакой суеты, всё чётко и честно. Деньги получила в день подписания.", stars: 5 },
  { name: "Виктор К.", text: "Думал, что долги по ЖКХ станут проблемой — взяли всё на себя. Очень благодарен команде!", stars: 5 },
  { name: "Светлана М.", text: "Переезжали в Минск, квартиру нужно было продать срочно. Ребята помогли буквально за 3 дня.", stars: 5 },
  { name: "Андрей Р.", text: "Профессионалы! Оценили честно, без занижения. Рекомендую всем, кто хочет продать быстро.", stars: 5 },
];

// ─── Калькулятор ───
function Calculator({ onOpenModal }: { onOpenModal: () => void }) {
  const [area, setArea] = useState(55);
  const [floor, setFloor] = useState<"low" | "mid" | "high">("mid");
  const [condition, setCondition] = useState<"bad" | "normal" | "good">("normal");
  const [rooms, setRooms] = useState<1 | 2 | 3>(2);
  const [district, setDistrict] = useState<"center" | "near" | "far">("near");

  const total = Math.round((area * 900
    * (floor === "low" ? 0.92 : floor === "high" ? 0.96 : 1)
    * (condition === "bad" ? 0.82 : condition === "good" ? 1.1 : 1)
    * (rooms === 1 ? 0.97 : rooms === 3 ? 1.04 : 1)
    * (district === "center" ? 1.12 : district === "far" ? 0.9 : 1)
  ) / 100) * 100;

  const groups = [
    { label: "Комнат", state: rooms, set: (v: unknown) => setRooms(v as 1|2|3), opts: [{ v: 1, l: "1-комн" }, { v: 2, l: "2-комн" }, { v: 3, l: "3+ комн" }] },
    { label: "Состояние", state: condition, set: (v: unknown) => setCondition(v as "bad"|"normal"|"good"), opts: [{ v: "bad", l: "Плохое" }, { v: "normal", l: "Среднее" }, { v: "good", l: "Хорошее" }] },
    { label: "Этаж", state: floor, set: (v: unknown) => setFloor(v as "low"|"mid"|"high"), opts: [{ v: "low", l: "1–2 этаж" }, { v: "mid", l: "Средний" }, { v: "high", l: "Последний" }] },
    { label: "Район", state: district, set: (v: unknown) => setDistrict(v as "center"|"near"|"far"), opts: [{ v: "center", l: "Центр" }, { v: "near", l: "Близко" }, { v: "far", l: "Окраина" }] },
  ];

  return (
    <div className="border p-8 md:p-12" style={{ background: "var(--coal-2)", borderColor: "rgba(201,168,76,0.2)" }}>
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <div className="flex justify-between mb-3">
              <span className="text-sm uppercase tracking-widest" style={{ color: "var(--smoke)" }}>Площадь</span>
              <span className="text-xl font-bold" style={{ color: "var(--gold)", fontFamily: "'Oswald', sans-serif" }}>{area} м²</span>
            </div>
            <input type="range" min={20} max={200} value={area} onChange={e => setArea(Number(e.target.value))}
              className="w-full cursor-pointer" style={{ accentColor: "var(--gold)" }} />
            <div className="flex justify-between text-xs mt-1" style={{ color: "var(--smoke)" }}>
              <span>20 м²</span><span>200 м²</span>
            </div>
          </div>
          {groups.map(g => (
            <div key={g.label}>
              <span className="text-sm uppercase tracking-widest block mb-3" style={{ color: "var(--smoke)" }}>{g.label}</span>
              <div className="flex gap-2">
                {g.opts.map(opt => {
                  const active = g.state === opt.v;
                  return (
                    <button key={String(opt.v)} onClick={() => g.set(opt.v)}
                      className="flex-1 py-2.5 text-xs uppercase tracking-wide border transition-all duration-200"
                      style={{
                        fontFamily: "'Oswald', sans-serif",
                        background: active ? "var(--gold)" : "transparent",
                        color: active ? "var(--coal)" : "var(--smoke)",
                        borderColor: active ? "var(--gold)" : "rgba(201,168,76,0.3)",
                      }}>
                      {opt.l}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col justify-center items-center text-center border p-8 relative overflow-hidden"
          style={{ borderColor: "rgba(201,168,76,0.15)" }}>
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.05) 0%, transparent 100%)" }} />
          <p className="text-xs uppercase tracking-[0.3em] mb-4 relative" style={{ color: "var(--smoke)" }}>Ориентировочная стоимость</p>
          <div className="font-bold relative mb-2 gradient-gold"
            style={{ fontFamily: "'Oswald', sans-serif", fontSize: "clamp(2.5rem, 5vw, 3.5rem)" }}>
            {total.toLocaleString("ru-RU")} $
          </div>
          <p className="text-xs mt-3 relative max-w-[220px] leading-relaxed" style={{ color: "var(--smoke)" }}>
            Точная цена — после бесплатного осмотра нашим экспертом
          </p>
          <div className="mt-8 relative w-full space-y-3 text-left">
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--smoke)" }}>Площадь:</span>
              <span style={{ color: "var(--cream)" }}>{area} м²</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--smoke)" }}>Цена за м²:</span>
              <span style={{ color: "var(--cream)" }}>~{Math.round(total / area).toLocaleString("ru-RU")} $</span>
            </div>
            <div className="h-px" style={{ background: "rgba(201,168,76,0.15)" }} />
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--smoke)" }}>Срок сделки:</span>
              <span style={{ color: "var(--gold)" }}>1–5 дней</span>
            </div>
          </div>
          <button onClick={onOpenModal}
            className="mt-8 w-full py-4 text-sm uppercase tracking-widest transition-colors duration-200 animate-gold-pulse relative"
            style={{ fontFamily: "'Oswald', sans-serif", background: "var(--gold)", color: "var(--coal)" }}>
            Получить точную оценку
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Форма в секции контактов ───
function ContactSectionForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) { setError("Введите номер телефона"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(LEADS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, address, comment, source: "contact_section" }),
      });
      if (res.ok) { setSuccess(true); }
      else { setError("Ошибка отправки. Попробуйте ещё раз."); }
    } catch {
      setError("Нет соединения. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-10 text-center border" style={{ borderColor: "rgba(201,168,76,0.2)" }}>
        <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center" style={{ background: "var(--gold)" }}>
          <Icon name="Check" size={28} style={{ color: "var(--coal)" }} />
        </div>
        <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Oswald', sans-serif" }}>Заявка принята!</h3>
        <p className="text-sm leading-relaxed" style={{ color: "var(--smoke)" }}>
          Свяжемся с вами в течение 15 минут.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="text-xs uppercase tracking-[0.2em] block mb-2" style={{ color: "var(--smoke)" }}>Ваше имя</label>
        <input value={name} onChange={e => setName(e.target.value)}
          placeholder="Иван Иванов" className="input-dark w-full px-4 py-3 text-sm" style={{ borderRadius: 0 }} />
      </div>
      <div>
        <label className="text-xs uppercase tracking-[0.2em] block mb-2" style={{ color: "var(--smoke)" }}>
          Телефон <span style={{ color: "var(--gold)" }}>*</span>
        </label>
        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
          placeholder="+375 29 123 45 67"
          className="input-dark w-full px-4 py-3 text-sm" style={{ borderRadius: 0 }} />
      </div>
      <div>
        <label className="text-xs uppercase tracking-[0.2em] block mb-2" style={{ color: "var(--smoke)" }}>Адрес квартиры</label>
        <input value={address} onChange={e => setAddress(e.target.value)}
          placeholder="ул. Ленина, 10, кв. 5" className="input-dark w-full px-4 py-3 text-sm" style={{ borderRadius: 0 }} />
      </div>
      <div>
        <label className="text-xs uppercase tracking-[0.2em] block mb-2" style={{ color: "var(--smoke)" }}>Комментарий</label>
        <textarea value={comment} onChange={e => setComment(e.target.value)}
          placeholder="Опишите вашу ситуацию..." rows={3}
          className="input-dark w-full px-4 py-3 text-sm resize-none" style={{ borderRadius: 0 }} />
      </div>
      {error && <p className="text-xs py-2 px-3" style={{ color: "#e05252", background: "rgba(224,82,82,0.1)" }}>{error}</p>}
      <button type="submit" disabled={loading}
        className="w-full py-4 text-sm uppercase tracking-[0.2em] transition-colors duration-200 disabled:opacity-60 mt-2"
        style={{ fontFamily: "'Oswald', sans-serif", background: "var(--gold)", color: "var(--coal)" }}>
        {loading ? "Отправляем..." : "Отправить заявку"}
      </button>
      <p className="text-xs text-center" style={{ color: "var(--smoke)" }}>
        Нажимая кнопку, вы соглашаетесь на обработку персональных данных
      </p>
    </form>
  );
}

// ─── Главная страница ───
export default function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState<string | null>(null);
  const openModal = (source: string) => setModal(source);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--coal)", color: "var(--cream)" }}>
      {modal && <LeadModal source={modal} onClose={() => setModal(null)} />}

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 backdrop-blur-md"
        style={{ background: "rgba(13,13,13,0.92)", borderBottom: "1px solid rgba(201,168,76,0.12)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 flex items-center justify-center" style={{ background: "var(--gold)" }}>
            <Icon name="House" size={18} style={{ color: "var(--coal)" }} />
          </div>
          <span className="text-xl uppercase tracking-[0.15em] font-bold" style={{ fontFamily: "'Oswald', sans-serif", color: "var(--cream)" }}>Срочно</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.15em]" style={{ color: "var(--smoke)" }}>
          {["Преимущества", "Процесс", "Кейсы", "Команда", "Контакты"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} className="hover-gold-line transition-colors hover:text-[var(--cream)]">{l}</a>
          ))}
        </div>
        <button onClick={() => openModal("nav")}
          className="hidden md:flex items-center gap-2 px-5 py-2.5 text-sm uppercase tracking-widest transition-colors"
          style={{ fontFamily: "'Oswald', sans-serif", background: "var(--gold)", color: "var(--coal)" }}>
          <Icon name="Phone" size={14} />
          Оставить заявку
        </button>
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} style={{ color: "var(--cream)" }}>
          <Icon name={menuOpen ? "X" : "Menu"} size={22} />
        </button>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 text-xl uppercase tracking-[0.15em]"
          style={{ background: "var(--coal)" }}>
          {["Преимущества", "Процесс", "Кейсы", "Команда", "Контакты"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} className="transition-colors hover:text-[var(--gold)]"
              style={{ color: "var(--cream)" }} onClick={() => setMenuOpen(false)}>{l}</a>
          ))}
          <button onClick={() => { setMenuOpen(false); openModal("mobile_nav"); }}
            className="px-8 py-3 text-sm uppercase tracking-widest mt-4"
            style={{ fontFamily: "'Oswald', sans-serif", background: "var(--gold)", color: "var(--coal)" }}>
            Оставить заявку
          </button>
        </div>
      )}

      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${IMG_BUILDING})` }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(13,13,13,0.95) 0%, rgba(13,13,13,0.75) 50%, rgba(13,13,13,0.3) 100%)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-32" style={{ background: "linear-gradient(to top, var(--coal), transparent)" }} />
        <div className="relative z-10 px-6 md:px-16 lg:px-24 max-w-5xl pt-24">
          <div className="text-xs uppercase tracking-[0.4em] mb-6 flex items-center gap-3" style={{ color: "var(--gold)" }}>
            <span className="w-8 h-px" style={{ background: "var(--gold)" }} />
            Брест · Срочный выкуп
          </div>
          <h1 className="font-bold leading-none mb-6" style={{ fontFamily: "'Oswald', sans-serif", fontSize: "clamp(3rem, 8vw, 7rem)" }}>
            Продайте<br />
            <span className="gradient-gold">квартиру</span><br />
            за 24 часа
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-xl leading-relaxed font-light" style={{ color: "var(--smoke)" }}>
            Честная оценка без скрытых вычетов. Деньги в день сделки. Работаем по всему Бресту уже 7 лет.
          </p>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => openModal("hero")}
              className="text-sm uppercase tracking-[0.2em] px-8 py-4 transition-all duration-200 animate-gold-pulse"
              style={{ fontFamily: "'Oswald', sans-serif", background: "var(--gold)", color: "var(--coal)" }}>
              Получить оценку бесплатно
            </button>
            <button onClick={() => document.getElementById("процесс")?.scrollIntoView({ behavior: "smooth" })}
              className="text-sm uppercase tracking-[0.2em] px-8 py-4 border transition-all duration-200"
              style={{ fontFamily: "'Oswald', sans-serif", borderColor: "rgba(201,168,76,0.5)", color: "var(--cream)" }}>
              Как это работает
            </button>
          </div>
          <div className="flex gap-10 mt-16">
            {[["7 лет", "на рынке"], ["500+", "сделок"], ["24 ч", "до оценки"]].map(([n, l]) => (
              <div key={n}>
                <div className="font-bold gradient-gold" style={{ fontFamily: "'Oswald', sans-serif", fontSize: "1.875rem" }}>{n}</div>
                <div className="text-xs uppercase tracking-wider mt-1" style={{ color: "var(--smoke)" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-32 right-8 md:right-16 hidden md:flex flex-col items-center justify-center w-28 h-28"
          style={{ border: "1px solid var(--gold)", background: "rgba(13,13,13,0.8)", animation: "gold-pulse 3s ease-in-out infinite" }}>
          <div className="font-bold" style={{ fontFamily: "'Oswald', sans-serif", fontSize: "1.5rem", color: "var(--gold)" }}>–15%</div>
          <div className="text-center mt-1" style={{ color: "var(--smoke)", fontSize: "10px", letterSpacing: "0.1em" }}>ниже рынка</div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="overflow-hidden py-4" style={{ borderTop: "1px solid rgba(201,168,76,0.15)", borderBottom: "1px solid rgba(201,168,76,0.15)", background: "var(--coal-2)" }}>
        <div className="marquee-track flex gap-16 whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-16 items-center">
              {["Срочный выкуп", "Без посредников", "Деньги сразу", "Юридическая чистота", "Любое состояние", "Весь Брест"].map(t => (
                <span key={t} className="text-sm uppercase tracking-[0.3em] flex items-center gap-4" style={{ color: "var(--smoke)" }}>
                  <span className="w-1.5 h-1.5 rotate-45 inline-block" style={{ background: "var(--gold)" }} />
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ADVANTAGES */}
      <section id="преимущества" className="py-24 px-6 md:px-16 lg:px-24">
        <RevealBlock>
          <div className="text-xs uppercase tracking-[0.4em] mb-4 flex items-center gap-3" style={{ color: "var(--gold)" }}>
            <span className="w-8 h-px" style={{ background: "var(--gold)" }} />
            Почему выбирают нас
          </div>
          <h2 className="font-bold mb-16" style={{ fontFamily: "'Oswald', sans-serif", fontSize: "clamp(2.5rem, 5vw, 3.75rem)" }}>
            Наши<br /><span className="gradient-gold">преимущества</span>
          </h2>
        </RevealBlock>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border" style={{ borderColor: "rgba(201,168,76,0.15)" }}>
          {ADVANTAGES.map((a, i) => (
            <RevealBlock key={a.title} delay={i * 0.08} className="border p-8 group transition-colors duration-300 hover:bg-[var(--coal-2)]"
              style={{ borderColor: "rgba(201,168,76,0.08)" }}>
              <div className="w-12 h-12 flex items-center justify-center mb-5 border transition-colors group-hover:border-[var(--gold)]"
                style={{ borderColor: "rgba(201,168,76,0.3)" }}>
                <Icon name={a.icon} size={20} style={{ color: "var(--gold)" }} />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: "'Oswald', sans-serif", color: "var(--cream)" }}>{a.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--smoke)" }}>{a.desc}</p>
            </RevealBlock>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section id="процесс" className="py-24 px-6 md:px-16 lg:px-24" style={{ background: "var(--coal-2)" }}>
        <RevealBlock>
          <div className="text-xs uppercase tracking-[0.4em] mb-4 flex items-center gap-3" style={{ color: "var(--gold)" }}>
            <span className="w-8 h-px" style={{ background: "var(--gold)" }} />
            Как мы работаем
          </div>
          <h2 className="font-bold mb-16" style={{ fontFamily: "'Oswald', sans-serif", fontSize: "clamp(2.5rem, 5vw, 3.75rem)" }}>
            Процесс<br /><span className="gradient-gold">выкупа</span>
          </h2>
        </RevealBlock>
        <div className="grid md:grid-cols-4 gap-0 relative">
          <div className="hidden md:block absolute top-10 h-px z-0" style={{ left: "12.5%", right: "12.5%", background: "rgba(201,168,76,0.2)" }} />
          {STEPS.map((s, i) => (
            <RevealBlock key={s.num} delay={i * 0.1} className="relative z-10 p-6 md:p-8 text-center md:text-left">
              <div className="w-10 h-10 flex items-center justify-center font-bold text-sm mb-5 mx-auto md:mx-0"
                style={{ fontFamily: "'Oswald', sans-serif", background: "var(--gold)", color: "var(--coal)" }}>
                {s.num}
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: "'Oswald', sans-serif" }}>{s.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--smoke)" }}>{s.desc}</p>
            </RevealBlock>
          ))}
        </div>
        <div className="mt-12 text-center">
          <button onClick={() => openModal("process")}
            className="px-10 py-4 text-sm uppercase tracking-widest transition-colors duration-200"
            style={{ fontFamily: "'Oswald', sans-serif", background: "var(--gold)", color: "var(--coal)" }}>
            Начать прямо сейчас
          </button>
        </div>
      </section>

      {/* CASES */}
      <section id="кейсы" className="py-24 px-6 md:px-16 lg:px-24">
        <RevealBlock>
          <div className="text-xs uppercase tracking-[0.4em] mb-4 flex items-center gap-3" style={{ color: "var(--gold)" }}>
            <span className="w-8 h-px" style={{ background: "var(--gold)" }} />
            Реальные сделки
          </div>
          <h2 className="font-bold mb-16" style={{ fontFamily: "'Oswald', sans-serif", fontSize: "clamp(2.5rem, 5vw, 3.75rem)" }}>
            Наши<br /><span className="gradient-gold">кейсы</span>
          </h2>
        </RevealBlock>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 border" style={{ borderColor: "rgba(201,168,76,0.15)" }}>
          {CASES.map((c, i) => (
            <RevealBlock key={i} delay={i * 0.1} className="border p-8 transition-colors hover:bg-[var(--coal-2)]"
              style={{ borderColor: "rgba(201,168,76,0.08)" }}>
              <div className="text-xs uppercase tracking-[0.3em] px-3 py-1.5 inline-block mb-6"
                style={{ color: "var(--gold)", background: "rgba(201,168,76,0.1)" }}>{c.tag}</div>
              <div className="font-bold gradient-gold mb-2" style={{ fontFamily: "'Oswald', sans-serif", fontSize: "2.25rem" }}>{c.price}</div>
              <div className="text-base mb-1" style={{ color: "var(--cream)" }}>{c.area} · {c.district}</div>
              <div className="text-xs uppercase tracking-widest mt-4 flex items-center gap-2" style={{ color: "var(--smoke)" }}>
                <Icon name="Clock" size={12} style={{ color: "var(--gold)" }} />
                Закрыто за {c.days}
              </div>
            </RevealBlock>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section id="галерея" className="py-24 px-6 md:px-16 lg:px-24" style={{ background: "var(--coal-2)" }}>
        <RevealBlock>
          <div className="text-xs uppercase tracking-[0.4em] mb-4 flex items-center gap-3" style={{ color: "var(--gold)" }}>
            <span className="w-8 h-px" style={{ background: "var(--gold)" }} />
            Объекты
          </div>
          <h2 className="font-bold mb-16" style={{ fontFamily: "'Oswald', sans-serif", fontSize: "clamp(2.5rem, 5vw, 3.75rem)" }}>
            Галерея<br /><span className="gradient-gold">объектов</span>
          </h2>
        </RevealBlock>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {GALLERY.map((g, i) => (
            <RevealBlock key={i} delay={i * 0.1} className="relative overflow-hidden group" style={{ aspectRatio: "1/1" }}>
              <img src={g.img} alt={g.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "linear-gradient(to top, rgba(13,13,13,0.85), transparent)" }}>
                <span className="text-xs uppercase tracking-wider" style={{ color: "var(--cream)" }}>{g.label}</span>
              </div>
            </RevealBlock>
          ))}
        </div>
      </section>

      {/* CALCULATOR */}
      <section id="калькулятор" className="py-24 px-6 md:px-16 lg:px-24">
        <RevealBlock>
          <div className="text-xs uppercase tracking-[0.4em] mb-4 flex items-center gap-3" style={{ color: "var(--gold)" }}>
            <span className="w-8 h-px" style={{ background: "var(--gold)" }} />
            Инструмент оценки
          </div>
          <h2 className="font-bold mb-16" style={{ fontFamily: "'Oswald', sans-serif", fontSize: "clamp(2.5rem, 5vw, 3.75rem)" }}>
            Калькулятор<br /><span className="gradient-gold">стоимости</span>
          </h2>
        </RevealBlock>
        <Calculator onOpenModal={() => openModal("calculator")} />
      </section>

      {/* TEAM */}
      <section id="команда" className="py-24 px-6 md:px-16 lg:px-24" style={{ background: "var(--coal-2)" }}>
        <RevealBlock>
          <div className="text-xs uppercase tracking-[0.4em] mb-4 flex items-center gap-3" style={{ color: "var(--gold)" }}>
            <span className="w-8 h-px" style={{ background: "var(--gold)" }} />
            Люди за сделками
          </div>
          <h2 className="font-bold mb-16" style={{ fontFamily: "'Oswald', sans-serif", fontSize: "clamp(2.5rem, 5vw, 3.75rem)" }}>
            Наша<br /><span className="gradient-gold">команда</span>
          </h2>
        </RevealBlock>
        <div className="grid md:grid-cols-3 border" style={{ borderColor: "rgba(201,168,76,0.15)" }}>
          {TEAM.map((t, i) => (
            <RevealBlock key={t.name} delay={i * 0.1} className="border overflow-hidden group" style={{ borderColor: "rgba(201,168,76,0.08)" }}>
              <div className="overflow-hidden" style={{ aspectRatio: "4/3" }}>
                <img src={t.img} alt={t.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold" style={{ fontFamily: "'Oswald', sans-serif" }}>{t.name}</h3>
                <p className="text-xs uppercase tracking-[0.2em] mt-1 mb-2" style={{ color: "var(--gold)" }}>{t.role}</p>
                <p className="text-sm" style={{ color: "var(--smoke)" }}>{t.exp}</p>
              </div>
            </RevealBlock>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section id="отзывы" className="py-24 px-6 md:px-16 lg:px-24">
        <RevealBlock>
          <div className="text-xs uppercase tracking-[0.4em] mb-4 flex items-center gap-3" style={{ color: "var(--gold)" }}>
            <span className="w-8 h-px" style={{ background: "var(--gold)" }} />
            Что говорят клиенты
          </div>
          <h2 className="font-bold mb-16" style={{ fontFamily: "'Oswald', sans-serif", fontSize: "clamp(2.5rem, 5vw, 3.75rem)" }}>
            Отзывы<br /><span className="gradient-gold">клиентов</span>
          </h2>
        </RevealBlock>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 border" style={{ borderColor: "rgba(201,168,76,0.15)" }}>
          {REVIEWS.map((r, i) => (
            <RevealBlock key={i} delay={i * 0.1} className="border p-8 flex flex-col gap-4 transition-colors hover:bg-[var(--coal-2)]"
              style={{ borderColor: "rgba(201,168,76,0.08)" }}>
              <div className="flex gap-1">
                {[...Array(r.stars)].map((_, s) => <span key={s} style={{ color: "var(--gold)", fontSize: "1rem" }}>★</span>)}
              </div>
              <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--smoke)" }}>«{r.text}»</p>
              <div className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--cream)" }}>{r.name}</div>
            </RevealBlock>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="контакты" className="py-24 px-6 md:px-16 lg:px-24" style={{ background: "var(--coal-2)" }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <RevealBlock>
            <div className="text-xs uppercase tracking-[0.4em] mb-4 flex items-center gap-3" style={{ color: "var(--gold)" }}>
              <span className="w-8 h-px" style={{ background: "var(--gold)" }} />
              Напишите нам
            </div>
            <h2 className="font-bold mb-6" style={{ fontFamily: "'Oswald', sans-serif", fontSize: "clamp(2.5rem, 5vw, 3.75rem)" }}>
              Оставьте<br /><span className="gradient-gold">заявку</span>
            </h2>
            <p className="text-base leading-relaxed mb-8" style={{ color: "var(--smoke)" }}>
              Заполните форму — свяжемся в течение 15 минут и назначим бесплатный осмотр.
            </p>
            <div className="space-y-4 text-sm">
              {[
                { icon: "Phone", text: "+375 (29) 123-45-67" },
                { icon: "MapPin", text: "г. Брест, ул. Советская, 82" },
                { icon: "Clock", text: "Пн–Вс: 9:00–21:00" },
              ].map(item => (
                <div key={item.text} className="flex items-center gap-3" style={{ color: "var(--smoke)" }}>
                  <Icon name={item.icon} size={14} style={{ color: "var(--gold)" }} />
                  {item.text}
                </div>
              ))}
            </div>
          </RevealBlock>

          <RevealBlock delay={0.2}>
            <ContactSectionForm />
          </RevealBlock>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 md:px-16 lg:px-24" style={{ borderTop: "1px solid rgba(201,168,76,0.15)" }}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 flex items-center justify-center" style={{ background: "var(--gold)" }}>
              <Icon name="House" size={15} style={{ color: "var(--coal)" }} />
            </div>
            <span className="text-lg uppercase tracking-[0.15em] font-bold" style={{ fontFamily: "'Oswald', sans-serif", color: "var(--cream)" }}>Срочно</span>
          </div>
          <p className="text-xs uppercase tracking-wider" style={{ color: "var(--smoke)" }}>© 2024 · Брест · Срочный выкуп квартир</p>
          <div className="text-xs uppercase tracking-wider" style={{ color: "var(--smoke)" }}>ООО "Срочно" · УНП 123456789</div>
        </div>
      </footer>
    </div>
  );
}