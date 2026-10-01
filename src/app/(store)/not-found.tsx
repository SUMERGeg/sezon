import Link from "next/link";
import { PageIntro } from "@/components/ui/page-intro";

export default function StoreNotFound() {
  return (
    <PageIntro eyebrow="404" title="Страница не найдена" description="Возможно, ссылка изменилась. Вернитесь на главную или загляните в каталог.">
      <Link className="button" href="/">На главную</Link>
    </PageIntro>
  );
}
