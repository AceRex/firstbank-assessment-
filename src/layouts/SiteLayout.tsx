import { Outlet } from "react-router";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ShareTab from "../components/ShareTab";
import PageBanner from "../components/PageBanner";
import Container from "../components/Container";
import { site } from "../config/site";

export default function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <PageBanner title={site.portalName} />
      <main id="main" className="flex-1 py-6 pb-16 lg:pb-24">
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
      <ShareTab />
    </div>
  );
}
