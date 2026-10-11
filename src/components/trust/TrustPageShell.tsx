import Link from "next/link";

export type TrustSection = {
  title: string;
  body?: string;
  items?: string[];
};

interface TrustPageShellProps {
  eyebrow: string;
  title: string;
  description: string;
  updatedLabel?: string;
  sections: TrustSection[];
  highlight?: string;
}

export default function TrustPageShell({
  eyebrow,
  title,
  description,
  updatedLabel = "Diperbarui untuk soft-launch toko online.",
  sections,
  highlight,
}: TrustPageShellProps) {
  return (
    <div className="min-h-screen bg-transparent px-4 py-5 pb-[calc(7rem+env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-md space-y-4">
        <section className="rounded-[2rem] bg-white/95 p-5 shadow-[0_8px_22px_rgba(15,23,42,0.08)] ring-1 ring-emerald-50">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-2xl font-extrabold leading-tight text-[#0D0E09]">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#52645B]">{description}</p>
          <p className="mt-4 rounded-2xl bg-emerald-50 px-3 py-2 text-xs font-medium leading-relaxed text-emerald-800">
            {updatedLabel}
          </p>
        </section>

        {highlight && (
          <section className="rounded-3xl border border-amber-100 bg-amber-50/95 p-4 text-sm leading-6 text-amber-900 shadow-[0_8px_22px_rgba(15,23,42,0.06)]">
            <p className="font-bold">Catatan penting</p>
            <p className="mt-1">{highlight}</p>
          </section>
        )}

        <div className="space-y-3">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-3xl bg-white/95 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)] ring-1 ring-emerald-50"
            >
              <h2 className="text-base font-bold text-[#0D0E09]">{section.title}</h2>
              {section.body && (
                <p className="mt-2 text-sm leading-6 text-[#52645B]">{section.body}</p>
              )}
              {section.items && section.items.length > 0 && (
                <ul className="mt-3 space-y-2 text-sm leading-6 text-[#52645B]">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <section className="rounded-3xl bg-emerald-950 p-4 text-white shadow-[0_8px_22px_rgba(15,23,42,0.12)]">
          <h2 className="text-base font-bold">Butuh bantuan?</h2>
          <p className="mt-2 text-sm leading-6 text-emerald-50/90">
            Jika ada informasi yang belum jelas, simpan nomor pesanan lalu hubungi admin toko melalui WhatsApp resmi.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <Link
              href="/"
              className="rounded-2xl bg-white px-4 py-3 text-center text-sm font-bold text-emerald-950 transition hover:bg-emerald-50"
            >
              Kembali Belanja
            </Link>
            <a
              href="https://wa.me/6281298742102"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-white/30 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-white/10"
            >
              Hubungi Admin
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
