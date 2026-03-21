import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 px-6 py-16 text-stone-950">
      <div className="w-full max-w-xl rounded-3xl border border-stone-200 bg-white p-10 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">404</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">La página no está disponible.</h1>
        <p className="mt-4 text-base leading-7 text-stone-600">
          Regresa al cotizador principal o consulta la lista de precios desde las rutas públicas del sitio.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
          >
            Ir al cotizador
          </Link>
          <Link
            href="/lista-de-precios"
            className="rounded-full border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
          >
            Ver lista de precios
          </Link>
        </div>
      </div>
    </main>
  );
}
