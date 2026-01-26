import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { AppContext } from '../context/AppContext';
import { styles, COLORS } from '../constants/styles'; // We will make this styles file in Step 4

export default function OnboardingScreen() {
  const router = useRouter();
  const { userProfile, setUserProfile } = useContext(AppContext);
  const [gender, setGender] = useState('Male');
  const [style, setStyle] = useState('Minimalist');

  const handleNext = () => {
    setUserProfile({ ...userProfile, gender, style });
    router.push('/wardrobe'); 
  };

  const SelectionBtn = ({ label, selected, onPress }) => (
    <TouchableOpacity style={[styles.chip, selected && styles.chipSelected]} onPress={onPress}>
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.headerTitle}>STYLISH AI</Text>
        <Text style={styles.subHeader}>Let's refine your style.</Text>

        <View style={styles.section}>
          <Text style={styles.label}>I identify as</Text>
          <View style={styles.row}>
            <SelectionBtn label="Male" selected={gender === 'Male'} onPress={() => setGender('Male')} />
            <SelectionBtn label="Female" selected={gender === 'Female'} onPress={() => setGender('Female')} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Style Preference</Text>
          <View style={styles.wrapRow}>
            {['Minimalist', 'Bold', 'Classic', 'Streetwear', 'Business'].map((s) => (
              <SelectionBtn key={s} label={s} selected={style === s} onPress={() => setStyle(s)} />
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.mainButton} onPress={handleNext}>
          <Text style={styles.mainButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}