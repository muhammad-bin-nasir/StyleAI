import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { AppContext } from '../context/AppContext';
import { COLORS } from '../constants/styles'; // Ensure this matches your file structure

// --- CONFIG ---
const API_URL = 'http://192.168.10.6:5000/api/recommend'; 

// --- SMART IMAGE GENERATOR ---
// This uses Pollinations.ai to generate REAL AI images based on the outfit text.
const getSmartImage = (title, items) => {
  // 1. Create a descriptive prompt from the outfit data
  // Example: "Men Fashion Navy Blazer Linen Shirt"
  const itemsText = Array.isArray(items) ? items.join(' ') : items;
  const prompt = `fashion photography, ${title}, ${itemsText}, realistic, 8k, professional lighting`;
  
  // 2. Encode it for the URL (replaces spaces with %20)
  const encodedPrompt = encodeURIComponent(prompt);
  
  // 3. Return the Magic URL
  // "nologo=true" removes the watermarks
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=400&height=500&nologo=true&seed=${Math.random()}`;
};

export default function ResultScreen() {
  const router = useRouter();
  const { userProfile, contextData } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [weatherInfo, setWeatherInfo] = useState('');

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      console.log("Sending data...", { userProfile, contextData });
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile: userProfile,
          contextData: contextData
        }),
      });

      const data = await response.json();
      
      if (data.recommendations) setResults(data.recommendations);
      if (data.weather_summary) setWeatherInfo(data.weather_summary);
      setLoading(false);

    } catch (error) {
      console.error("Server Error:", error);
      alert("Connection failed.");
      setLoading(false);
    }
  };

  if (loading) return (
    <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
      <ActivityIndicator size="large" color="#1A1A1A" />
      <Text style={{marginTop: 20, color: '#888'}}>Consulting AI Stylist...</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{paddingBottom: 40}}>
        
        {/* HEADER */}
        <View style={styles.headerPadding}>
          <Text style={styles.subHeader}>Recommendations for</Text>
          <Text style={styles.screenTitle}>{contextData.occasion}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.locationTag}>📍 {contextData.location}</Text>
            <Text style={styles.weatherTag}>🌤 {weatherInfo}</Text>
          </View>
        </View>

        {/* CARDS */}
        {results.map((outfit, index) => (
          <View key={index} style={styles.outfitCard}>
            
            {/* DYNAMIC AI IMAGE */}
            <Image 
              source={{ uri: getSmartImage(outfit.title, outfit.items) }} 
              style={styles.outfitImage} 
            />
            
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{outfit.title}</Text>
              <Text style={styles.cardDesc}>{outfit.description}</Text>
              
              <View style={styles.divider} />
              
              <Text style={styles.labelSmall}>YOU SHOULD WEAR:</Text>
              
              <View style={styles.listContainer}>
                {Array.isArray(outfit.items) ? outfit.items.map((item, i) => (
                   <View key={i} style={styles.listItem}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={styles.itemText}>{item}</Text>
                   </View>
                )) : (
                  <Text style={styles.itemText}>{outfit.items}</Text>
                )}
              </View>
            </View>
          </View>
        ))}
        
        <TouchableOpacity style={styles.outlineButton} onPress={() => router.push('/context-input')}>
          <Text style={styles.outlineButtonText}>Try Again</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  headerPadding: { padding: 24, paddingBottom: 10 },
  subHeader: { fontSize: 16, color: '#888888' },
  screenTitle: { fontSize: 32, fontWeight: '800', color: '#1A1A1A', marginBottom: 5 },
  metaRow: { marginTop: 5 },
  locationTag: { fontSize: 14, fontWeight: '700', color: '#D4AF37', textTransform: 'uppercase', marginBottom: 4 },
  weatherTag: { fontSize: 14, fontWeight: '500', color: '#555' },
  outfitCard: {
    marginHorizontal: 24,
    marginBottom: 30,
    backgroundColor: '#FFF',
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },
  outfitImage: {
    width: '100%',
    height: 350, // Made it taller to show off the AI Image
    resizeMode: 'cover',
    backgroundColor: '#EEE'
  },
  cardContent: { padding: 20 },
  cardTitle: { fontSize: 22, fontWeight: '700', color: '#1A1A1A', marginBottom: 8 },
  cardDesc: { fontSize: 15, color: '#666', lineHeight: 22 },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 15 },
  labelSmall: { fontSize: 12, fontWeight: '700', color: '#999', marginBottom: 10, letterSpacing: 1 },
  listContainer: { flexDirection: 'column' },
  listItem: { flexDirection: 'row', marginBottom: 6, alignItems: 'flex-start' },
  bullet: { fontSize: 16, color: '#D4AF37', marginRight: 8, lineHeight: 22 },
  itemText: { fontSize: 16, color: '#333', lineHeight: 22, flex: 1 },
  outlineButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#1A1A1A',
  },
  outlineButtonText: { color: '#1A1A1A', fontSize: 16, fontWeight: '600' },
});