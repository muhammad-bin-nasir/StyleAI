import { useState } from 'react';

export interface OutfitRecommendation {
  id: number;
  title: string;
  description: string;
  items: string[];
  image: string;
}

export const useMockAI = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<OutfitRecommendation[]>([]);

  const fetchRecommendations = async (location: string, occasion: string) => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock Data based on inputs
    const mockData: OutfitRecommendation[] = [
      {
        id: 1,
        title: "The Modern Professional",
        description: `Perfect for your ${occasion} in ${location}. A balanced look for the current weather.`,
        items: ["Navy Slim Blazer", "White Linen Shirt", "Chino Trousers", "Leather Loafers"],
        image: "https://via.placeholder.com/300x400/1A1A1A/FFFFFF?text=OUTFIT+1" 
      },
      {
        id: 2,
        title: "Smart Casual Alternative",
        description: "A more relaxed approach while maintaining elegance.",
        items: ["Beige Knit Polo", "Dark Denim", "Minimalist Sneakers"],
        image: "https://via.placeholder.com/300x400/D4AF37/FFFFFF?text=OUTFIT+2"
      }
    ];

    setResults(mockData);
    setLoading(false);
  };

  return { loading, results, fetchRecommendations };
};