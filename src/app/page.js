import HeroSection from "@/components/HeroSection";
import FeatureArtWorks from "@/components/FeatureArtWorks";
import TopArtist from "@/components/topartist/TopArtist";
import ArtCategories from "@/components/artcategories/ArtCategories";

export default function Home() {
  return (
    <div className="">
      {/*Heroscecion */}
      <HeroSection>{/* Discover & Buy Original Art */}</HeroSection>
      {/* Feature Art Works */}
      <FeatureArtWorks>
        {/* Featured Art Works 6 artworks dynamically if page reloads it will be auto refreshed */}
      </FeatureArtWorks>
      {/* Top Artist */}
      <TopArtist>{/* Most Sell 3 artist and profile picture */}</TopArtist>
      {/* ArtCategories */}
      <ArtCategories>
        {/* Top Categories Painting Digital Sculpture */}
      </ArtCategories>
    </div>
  );
}
