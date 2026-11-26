import ServiceCard from "../features/services/ServiceCard";
import { accountServices } from "../features/services/services";

export default function ServicesPage() {
  return (
    <section aria-labelledby="services-heading">
      <title>Account Management Portal | FirstBank</title>
      <h1 id="services-heading" className="text-lg leading-none font-extralight text-gray-900">
        Kindly select an account management service
      </h1>

      <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[repeat(3,minmax(0,400px))] xl:justify-between xl:gap-y-14">
        {accountServices.map((service) => (
          <li key={service.slug}>
            <ServiceCard service={service} />
          </li>
        ))}
      </ul>
    </section>
  );
}
