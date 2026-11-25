import Container from "./Container";

export default function PageBanner({ title }: { title: string }) {
  return (
    <div className="flex h-16 w-full items-center bg-brand-navy text-white">
      <Container>
        <p className="text-xl leading-none font-normal sm:text-2xl">{title}</p>
      </Container>
    </div>
  );
}
