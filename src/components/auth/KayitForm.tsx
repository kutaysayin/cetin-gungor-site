/* Uyelik basvuru formu — cok adimli wizard, client component */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, AlertCircle, CheckCircle2, ChevronRight, ChevronLeft, User, Building2, ClipboardList } from "lucide-react";
import Button from "@/components/ui/Button";
import Link from "next/link";

// ---- Tipler ----
interface FormData {
  // Adim 1
  name: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirm: string;
  // Adim 2
  companyName: string;
  sector: string;
  address: string;
  companyPhone: string;
  website: string;
  // Adim 3
  kvkk: boolean;
}

const SEKTORLER = [
  "Seramik & Fayans",
  "Boya & Yalitim",
  "Tesisat & Isitma",
  "Elektrik & Aydinlatma",
  "Hirdavat & Nalburiye",
  "Diger",
];

const STEP_LABELS = ["Kisisel Bilgiler", "Firma Bilgileri", "Onay"];
const STEP_ICONS = [User, Building2, ClipboardList];

// ---- Step indicator ----
function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center mb-8 gap-0">
      {STEP_LABELS.map((label, i) => {
        const StepIcon = STEP_ICONS[i];
        const isDone = i < current;
        const isActive = i === current;
        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={[
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                  isDone
                    ? "bg-green-500 border-green-500 text-white"
                    : isActive
                    ? "bg-secondary-500 border-secondary-500 text-white"
                    : "bg-neutral-100 border-neutral-200 text-neutral-400",
                ].join(" ")}
              >
                {isDone ? <CheckCircle2 size={18} /> : <StepIcon size={18} />}
              </div>
              <span
                className={[
                  "text-xs font-medium hidden sm:block",
                  isActive ? "text-secondary-600" : isDone ? "text-green-600" : "text-neutral-400",
                ].join(" ")}
              >
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div
                className={[
                  "h-0.5 w-12 sm:w-20 mx-1 mb-5 transition-all duration-300",
                  i < current ? "bg-green-400" : "bg-neutral-200",
                ].join(" ")}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---- Input bileşeni ----
function FormInput({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-primary-800 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
}

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-primary-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-secondary-400 focus:border-transparent transition-all duration-200 text-sm";

// ---- Adim 1 ----
function Step1({
  data,
  onChange,
  errors,
  showPass,
  showConfirm,
  onTogglePass,
  onToggleConfirm,
}: {
  data: FormData;
  onChange: (field: keyof FormData, value: string | boolean) => void;
  errors: Partial<Record<keyof FormData, string>>;
  showPass: boolean;
  showConfirm: boolean;
  onTogglePass: () => void;
  onToggleConfirm: () => void;
}) {
  return (
    <div className="space-y-5">
      <FormInput id="name" label="Ad Soyad" required error={errors.name}>
        <input
          id="name"
          type="text"
          autoComplete="name"
          value={data.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="Ahmet Yilmaz"
          className={inputClass}
        />
      </FormInput>

      <FormInput id="email" label="Email Adresi" required error={errors.email}>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={data.email}
          onChange={(e) => onChange("email", e.target.value)}
          placeholder="ornek@firma.com"
          className={inputClass}
        />
      </FormInput>

      <FormInput id="phone" label="Telefon" required error={errors.phone}>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          value={data.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          placeholder="0532 000 00 00"
          className={inputClass}
        />
      </FormInput>

      <FormInput id="password" label="Sifre" required error={errors.password}>
        <div className="relative">
          <input
            id="password"
            type={showPass ? "text" : "password"}
            autoComplete="new-password"
            value={data.password}
            onChange={(e) => onChange("password", e.target.value)}
            placeholder="En az 8 karakter"
            className={`${inputClass} pr-11`}
          />
          <button
            type="button"
            onClick={onTogglePass}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-primary-700 transition-colors"
            aria-label={showPass ? "Sifreyi gizle" : "Sifreyi goster"}
          >
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </FormInput>

      <FormInput id="passwordConfirm" label="Sifre Tekrar" required error={errors.passwordConfirm}>
        <div className="relative">
          <input
            id="passwordConfirm"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            value={data.passwordConfirm}
            onChange={(e) => onChange("passwordConfirm", e.target.value)}
            placeholder="Sifreyi tekrar girin"
            className={`${inputClass} pr-11`}
          />
          <button
            type="button"
            onClick={onToggleConfirm}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-primary-700 transition-colors"
            aria-label={showConfirm ? "Sifreyi gizle" : "Sifreyi goster"}
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </FormInput>
    </div>
  );
}

// ---- Adim 2 ----
function Step2({
  data,
  onChange,
  errors,
}: {
  data: FormData;
  onChange: (field: keyof FormData, value: string | boolean) => void;
  errors: Partial<Record<keyof FormData, string>>;
}) {
  return (
    <div className="space-y-5">
      <FormInput id="companyName" label="Firma Adi" required error={errors.companyName}>
        <input
          id="companyName"
          type="text"
          value={data.companyName}
          onChange={(e) => onChange("companyName", e.target.value)}
          placeholder="Yilmaz Insaat Malzemeleri Ltd."
          className={inputClass}
        />
      </FormInput>

      <FormInput id="sector" label="Sektor" required error={errors.sector}>
        <select
          id="sector"
          value={data.sector}
          onChange={(e) => onChange("sector", e.target.value)}
          className={inputClass}
        >
          <option value="">Sektor secin...</option>
          {SEKTORLER.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </FormInput>

      <FormInput id="address" label="Adres" error={errors.address}>
        <textarea
          id="address"
          rows={3}
          value={data.address}
          onChange={(e) => onChange("address", e.target.value)}
          placeholder="Firma adresi"
          className={`${inputClass} resize-none`}
        />
      </FormInput>

      <FormInput id="companyPhone" label="Firma Telefonu" error={errors.companyPhone}>
        <input
          id="companyPhone"
          type="tel"
          value={data.companyPhone}
          onChange={(e) => onChange("companyPhone", e.target.value)}
          placeholder="0236 000 00 00"
          className={inputClass}
        />
      </FormInput>

      <FormInput id="website" label="Firma Web Sitesi" error={errors.website}>
        <input
          id="website"
          type="url"
          value={data.website}
          onChange={(e) => onChange("website", e.target.value)}
          placeholder="https://www.firma.com"
          className={inputClass}
        />
      </FormInput>
    </div>
  );
}

// ---- Adim 3 ----
function Step3({
  data,
  onChange,
  errors,
}: {
  data: FormData;
  onChange: (field: keyof FormData, value: string | boolean) => void;
  errors: Partial<Record<keyof FormData, string>>;
}) {
  const rows: { label: string; value: string }[] = [
    { label: "Ad Soyad", value: data.name },
    { label: "Email", value: data.email },
    { label: "Telefon", value: data.phone },
    { label: "Firma Adi", value: data.companyName },
    { label: "Sektor", value: data.sector },
    { label: "Adres", value: data.address || "-" },
    { label: "Firma Telefonu", value: data.companyPhone || "-" },
    { label: "Web Sitesi", value: data.website || "-" },
  ];

  return (
    <div className="space-y-6">
      {/* Ozet tablosu */}
      <div className="bg-neutral-50 rounded-xl border border-neutral-200 overflow-hidden">
        <div className="px-4 py-3 bg-primary-50 border-b border-neutral-200">
          <p className="text-sm font-semibold text-primary-800">Basvuru Ozeti</p>
        </div>
        <dl className="divide-y divide-neutral-100">
          {rows.map(({ label, value }) => (
            <div key={label} className="px-4 py-2.5 flex gap-3 text-sm">
              <dt className="w-36 shrink-0 text-neutral-500 font-medium">{label}</dt>
              <dd className="text-primary-900 break-all">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* KVKK onayı */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={data.kvkk}
            onChange={(e) => onChange("kvkk", e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-neutral-300 text-secondary-500 focus:ring-secondary-400 cursor-pointer shrink-0"
          />
          <span className="text-sm text-neutral-600 leading-relaxed group-hover:text-neutral-800 transition-colors">
            Kisisel verilerimin islenmesine iliskin{" "}
            <Link href="/kvkk" className="text-secondary-600 hover:underline font-medium">
              aydinlatma metnini
            </Link>{" "}
            okudum, kabul ediyorum.
          </span>
        </label>
        {errors.kvkk && (
          <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1 ml-7">
            <AlertCircle size={12} /> {errors.kvkk}
          </p>
        )}
      </div>
    </div>
  );
}

// ---- Ana bileşen ----
export default function KayitForm() {
  const [step, setStep] = useState(0);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirm: "",
    companyName: "",
    sector: "",
    address: "",
    companyPhone: "",
    website: "",
    kvkk: false,
  });

  function handleChange(field: keyof FormData, value: string | boolean) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validateStep(s: number): boolean {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (s === 0) {
      if (!formData.name.trim() || formData.name.trim().length < 2)
        newErrors.name = "Ad Soyad en az 2 karakter olmalidir";
      if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        newErrors.email = "Gecerli bir email adresi giriniz";
      if (!formData.phone.trim())
        newErrors.phone = "Telefon numarasi gereklidir";
      if (formData.password.length < 8)
        newErrors.password = "Sifre en az 8 karakter olmalidir";
      if (formData.password !== formData.passwordConfirm)
        newErrors.passwordConfirm = "Sifreler eslesmiyor";
    }

    if (s === 1) {
      if (!formData.companyName.trim())
        newErrors.companyName = "Firma adi gereklidir";
      if (!formData.sector)
        newErrors.sector = "Sektor secimi gereklidir";
    }

    if (s === 2) {
      if (!formData.kvkk)
        newErrors.kvkk = "Devam edebilmek icin KVKK metnini onaylamaniz gereklidir";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleNext() {
    if (validateStep(step)) setStep((s) => s + 1);
  }

  function handleBack() {
    setStep((s) => s - 1);
    setGlobalError(null);
  }

  async function handleSubmit() {
    if (!validateStep(2)) return;
    setLoading(true);
    setGlobalError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          companyName: formData.companyName,
          sector: formData.sector,
          address: formData.address || undefined,
          website: formData.website || undefined,
        }),
      });

      const data = (await response.json()) as { success: boolean; message: string };

      if (data.success) {
        setSuccess(true);
      } else {
        setGlobalError(data.message);
      }
    } catch {
      setGlobalError("Bir hata olustu, lutfen tekrar deneyin");
    } finally {
      setLoading(false);
    }
  }

  // Basari durumu
  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md mx-auto bg-white rounded-2xl shadow-elevated p-10 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 size={32} className="text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-primary-900 mb-3">
          Basvurunuz Alindi!
        </h2>
        <p className="text-neutral-600 text-sm leading-relaxed mb-6">
          Uyelik basvurunuz incelendikten sonra email adresinize bilgilendirme
          yapilacaktir.
        </p>
        <Button href="/" variant="primary" size="md">
          Anasayfaya Don
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-2xl shadow-elevated p-8">
        {/* Baslik */}
        <div className="text-center mb-2">
          <h2 className="text-2xl font-bold text-primary-900">Uyelik Basvurusu</h2>
          <p className="text-neutral-500 text-sm mt-1">
            Lutfen bilgilerinizi eksiksiz doldurun
          </p>
        </div>

        {/* Step indicator */}
        <StepIndicator current={step} />

        {/* Global hata */}
        {globalError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm"
          >
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{globalError}</span>
          </motion.div>
        )}

        {/* Adim icerigi */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {step === 0 && (
              <Step1
                data={formData}
                onChange={handleChange}
                errors={errors}
                showPass={showPass}
                showConfirm={showConfirm}
                onTogglePass={() => setShowPass((v) => !v)}
                onToggleConfirm={() => setShowConfirm((v) => !v)}
              />
            )}
            {step === 1 && (
              <Step2 data={formData} onChange={handleChange} errors={errors} />
            )}
            {step === 2 && (
              <Step3 data={formData} onChange={handleChange} errors={errors} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigasyon butonlari */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-neutral-100">
          {step > 0 ? (
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleBack}
            >
              <ChevronLeft size={16} />
              Geri
            </Button>
          ) : (
            <div />
          )}

          {step < 2 ? (
            <Button type="button" variant="primary" size="md" onClick={handleNext}>
              Ileri
              <ChevronRight size={16} />
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="md"
              loading={loading}
              onClick={handleSubmit}
            >
              Basvuruyu Gonder
            </Button>
          )}
        </div>

        {/* Giris linki */}
        <p className="text-center text-sm text-neutral-500 mt-5">
          Zaten hesabiniz var mi?{" "}
          <Link
            href="/giris"
            className="text-secondary-600 font-medium hover:text-secondary-700 transition-colors"
          >
            Giris Yapin
          </Link>
        </p>
      </div>
    </div>
  );
}
