import AnnouncementBar from "../components/home/AnnouncementBar";
import Navbar from "../components/home/Navbar";
import Hero from "../components/home/Hero";
import Footer from "../components/common/Footer";

import useHome from "../hooks/useHome";
import CategorySection from "../components/home/CategorySection";
import BrandInformation from "../components/home/BrandInformation";
import Newsletter from "../components/home/Newsletter";
import BrandStory from "../components/home/BrandStory";
export default function Home() {
  const { homeData, loading, error } = useHome();
console.log("FIRST CATEGORY:", homeData?.categories?.[0]);
//console.log("ESTELE HOME DATA:", homeData);
  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4" />

          <p className="text-sm tracking-wide text-gray-600">
            Loading Estele...
          </p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Unable to load Estele</h1>

          <p className="text-sm text-red-500 mb-4">{error}</p>

          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-black text-white text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#111]">
      {/* Announcement */}
      <AnnouncementBar />

      {/* Navbar */}
      <Navbar />

      <main>
        {/* Hero */}
        <Hero />

        {/* =========================================
            API DATA TEST / CATEGORY SECTION
        ========================================= */}
        <CategorySection categories={homeData?.categories || []} />

        {/* Brand Information */}
        <BrandInformation />
        <BrandStory />
        <Newsletter />

        {/* 
          NEXT SECTIONS WILL COME HERE:

          <CollectionSection />
          <NewArrivals />
          <BudgetSection />
          <Bestsellers />
          <CelebritySection />
          <BrandBenefits />
          <CustomerReviews />
          <BrandStory />
          <Newsletter />
        */}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
