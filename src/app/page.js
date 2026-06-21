import HeroSection from "@/components/HeroSection";
import FeatureArtWorks from "@/components/FeatureArtWorks";
import TOpArtist from "@/components/topartist/TopArtist";
import ArtCategories from "@/components/artcategories/ArtCategories";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      {/*Heroscecion */}
      <HeroSection>{/* Discover & Buy Original Art */}</HeroSection>
      {/* Feature Art Works */}
      <FeatureArtWorks>
        {/* Featured Art Works 6 artworks dynamically if page reloads it will be auto refreshed */}
      </FeatureArtWorks>
      {/* Top Artist */}
      <TOpArtist>{/* Most Sell 3 artist and profile picture */}</TOpArtist>
      {/* ArtCategories */}
      <ArtCategories>
        {/* Top Categories Painting Digital Sculpture */}
      </ArtCategories>
      <h1>Hello</h1>
    </div>
  );
}
