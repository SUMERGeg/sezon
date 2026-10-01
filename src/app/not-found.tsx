import Link from "next/link";
import { StoreShell } from "@/components/layout/store-shell";
import { PageIntro } from "@/components/ui/page-intro";

export default function NotFound() {
  return (
    <StoreShell>
      <PageIntro eyebrow="404" title="Страница не найдена" description="Возможно, ссылка изменилась. Вернитесь на главную или загляните в каталог.">
        <Link className="button" href="/">На главную</Link>
      </PageIntro>
    </StoreShell>
  );
}
