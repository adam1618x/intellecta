import { IconBook2, IconBriefcase2, IconCode, IconFlask, IconLanguage, IconMath } from "@tabler/icons-react";
import FeatureCard from "./FeatureCard";

const FEATURES = [
  { key: "courses", slug: "courses", Icon: IconBook2 },
  { key: "programming", slug: "programming", Icon: IconCode },
  { key: "mathematics", slug: "mathematics", Icon: IconMath },
  { key: "sciences", slug: "sciences", Icon: IconFlask },
  { key: "business", slug: "business", Icon: IconBriefcase2 },
  { key: "languages", slug: "languages", Icon: IconLanguage },
] as const;

interface Props { t: any; locale: string; }
export default function FeaturesSection({ t, locale }: Props) {
  return (
    <section className="section-pad section-muted">
      <div className="section-shell">
        <div className="section-heading-row">
          <div><span className="section-kicker">{t("areasEyebrow")}</span><h2 className="section-title">{t("areasTitle")}</h2></div>
          <p className="section-lead">{t("areasDescription")}</p>
        </div>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ key, slug, Icon }) => <FeatureCard key={key} href={`/${locale}/courses/${slug}`} title={t(`features.${key}.title`)} description={t(`features.${key}.desc`)} Icon={Icon} />)}
        </div>
      </div>
    </section>
  );
}
