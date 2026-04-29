import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const posts = [
  {
    title: "Claridad financiera al instante",
    description: "Gestiona tus ingresos y gastos con una interfaz intuitiva. Navega fácilmente entre fechas y encuentra lo que buscas con filtros avanzados.",
    imageSrc: "/assets/landing/pc_dark.png"
  },
  {
    title: "Tu dinero, a tu manera",
    description: "Lleva MyPocket siempre contigo. Personaliza tu experiencia con temas claros u oscuros, múltiples idiomas y visualiza tus gráficos de gastos en cualquier lugar.",
    imageSrc: "/assets/landing/mobile.png"
  },
  {
    title: "Visualiza tus hábitos",
    description: "Analiza tus totales y porcentajes por categoría con gráficos detallados. Controla tu panel de usuario y ajusta tu presupuesto en una interfaz limpia y profesional.",
    imageSrc: "/assets/landing/pc_light.png"
  }
];

export default function BlogSection() {
  return (
    <section className="py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <header className="mx-auto max-w-2xl space-y-2">
            <h2 className="font-heading text-4xl sm:text-5xl">Tus finanzas, desde todos los ángulos</h2>
            <p className="text-muted-foreground text-balance lg:text-lg">
              Del análisis detallado en escritorio a la rapidez del móvil. Todo lo que necesitas para entender tus hábitos de gasto.
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
