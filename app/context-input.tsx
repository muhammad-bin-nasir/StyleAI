import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { AppContext } from '../context/AppContext';
import { styles } from '../constants/styles';

export default function ContextInputScreen() {
  const router = useRouter();
  const { contextData, setContextData } = useContext(AppContext);
  
  const [loc, setLoc] = useState('');
  const [occ, setOcc] = useState('Office');
  const [time, setTime] = useState('Morning'); // New State

  const handleSubmit = () => {
    if (!loc) { alert("Please enter a location!"); return; }
    
    // Save all 3 data points
    setContextData({ ...contextData, location: loc, occasion: occ, time: time });
    router.push('/results');
  };

  const OptionBtn = ({ label, selected, onPress }) => (
    <TouchableOpacity style={[styles.chip, selected && styles.chipSelected]} onPress={onPress}>
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.screenTitle}>Plan Your Outfit</Text>
        
        {/* 1. LOCATION */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Where are you going?</Text>
          <TextInput 
            style={styles.input} 
            placeholder="e.g. Dubai, UAE" 
            placeholderTextColor="#999"
            value={loc} onChangeText={setLoc}
          />
        </View>

        {/* 2. TIME OF DAY (NEW) */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Time of Day</Text>
          <View style={styles.wrapRow}>
            {['Morning', 'Afternoon', 'Evening', 'Night'].map((t) => (
               <OptionBtn key={t} label={t} selected={time === t} onPress={() => setTime(t)} />
            ))}
          </View>
        </View>

        {/* 3. OCCASION */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Occasion</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['Office', 'Date Night', 'Gym', 'Wedding', 'Travel', 'Casual'].map((o) => (
              <OptionBtn key={o} label={o} selected={occ === o} onPress={() => setOcc(o)} />
            ))}
          </ScrollView>
        </View>

        <TouchableOpacity style={styles.mainButton} onPress={handleSubmit}>
          <Text style={styles.mainButtonText}>Generate Outfits</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}