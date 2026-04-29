import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

export default function BlogSection() {
  const { t } = useTranslation();

  const posts = [
    {
      title: t('HOME_PAGE.BLOG_SECTION.POST_1_TITLE'),
      description: t('HOME_PAGE.BLOG_SECTION.POST_1_DESC'),
      imageSrc: "/assets/landing/pc_dark.png"
    },
    {
      title: t('HOME_PAGE.BLOG_SECTION.POST_2_TITLE'),
      description: t('HOME_PAGE.BLOG_SECTION.POST_2_DESC'),
      imageSrc: "/assets/landing/mobile.png"
    },
    {
      title: t('HOME_PAGE.BLOG_SECTION.POST_3_TITLE'),
      description: t('HOME_PAGE.BLOG_SECTION.POST_3_DESC'),
      imageSrc: "/assets/landing/pc_light.png"
    }
  ];

  return (
    <section className="py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <header className="mx-auto max-w-2xl space-y-2">
            <h2 className="font-heading text-4xl sm:text-5xl">{t('HOME_PAGE.BLOG_SECTION.HEADER_TITLE')}</h2>
            <p className="text-muted-foreground text-balance lg:text-lg">
              {t('HOME_PAGE.BLOG_SECTION.HEADER_DESCRIPTION')}
            </p>
          </header>
        </div>
        <div className="mx-auto grid gap-6 py-12 lg:grid-cols-3">
          {posts.map((post, i) => (
            <Card key={i} className="group hover:bg-muted/50 pt-0 shadow-none overflow-hidden">
              <figure className="relative aspect-video overflow-hidden rounded-t-lg">
                <img
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src={post.imageSrc}
                />
              </figure>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">{post.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground text-sm">{post.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
