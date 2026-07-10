import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Vår historia",
  description:
    "Historien bakom Vintageskatten — oanvända smycken räddade ur ett tömt lager efter en varumärkeskonkurs.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
        Vår historia
      </h1>
      <div className="mt-6 space-y-5 leading-relaxed text-plum-soft">
        <p>
          Allt började med ett lager. När ett svenskt smyckesmärke gick i konkurs
          blev hela deras osålda sortiment över — lådvis med örhängen, halsband,
          armband och små skatter som aldrig hann ut i butik.
        </p>
        <p>
          Smyckena var helt oanvända. Aldrig burna, ofta kvar i sina
          originalförpackningar. Istället för att låta dem försvinna bestämde vi
          oss för att rädda dem och ge dem ett nytt liv.
        </p>
        <p>
          Det är därför du hittar riktig vintage här — till priser långt under
          vad de en gång kostade. Varje pjäs är unik i den meningen att när den
          är slut, är den slut. Lagret fylls inte på.
        </p>
        <p className="font-semibold text-ink">
          Det är ingen vanlig outlet. Det är en skattjakt. Och du är inbjuden.
        </p>
      </div>
      <Link
        href="/kategori/orhangen"
        className="mt-8 inline-block rounded-pill bg-fuchsia-brand px-6 py-3 font-bold text-white transition hover:bg-fuchsia-deep"
      >
        Börja fynda
      </Link>
    </div>
  );
}
