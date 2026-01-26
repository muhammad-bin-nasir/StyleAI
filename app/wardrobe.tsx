import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { AppContext } from '../context/AppContext';
import { styles, COLORS } from '../constants/styles';

export default function WardrobeScreen() {
  const router = useRouter();
  const { wardrobe, setWardrobe } = useContext(AppContext);

  const handleAddPhoto = () => {
    const newMockItem = `https://via.placeholder.com/150?text=Item+${wardrobe.length + 1}`;
    setWardrobe([...wardrobe, newMockItem]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.screenTitle}>My Wardrobe</Text>
        <TouchableOpacity onPress={() => router.push('/context-input')}>
          <Text style={styles.linkText}>Skip</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.bodyText}>Upload your clothes for better AI matches.</Text>

      <ScrollView contentContainerStyle={styles.grid}>
        <TouchableOpacity style={styles.addCard} onPress={handleAddPhoto}>
          <Text style={{fontSize: 40, color: COLORS.textLight}}>+</Text>
        </TouchableOpacity>
        
        {wardrobe.map((uri, index) => (
          <Image key={index} source={{ uri }} style={styles.wardrobeImg} />
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.mainButton} onPress={() => router.push('/context-input')}>
        <Text style={styles.mainButtonText}>Next Step</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}