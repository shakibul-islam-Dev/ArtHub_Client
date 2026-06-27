import FeatureArtWorks from "@/components/FeatureArtWorks";
import HeroSection from "@/components/HeroSection";
import TopArtist from "@/components/topartist/TopArtist";
import TopCategories from "@/components/TopCategories";

export default function Home() {
  return (
    <div className="">
      <HeroSection></HeroSection>
      <FeatureArtWorks></FeatureArtWorks>
      <TopArtist></TopArtist>

      <TopCategories></TopCategories>
    </div>
  );
}
