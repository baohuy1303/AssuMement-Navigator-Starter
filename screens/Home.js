import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import StopItem from '../components/StopItem';

const SAMPLE_POIS = [
  { id: 'ride_wheel', name: 'The Wheel', type: 'ride' },
  { id: 'ride_train', name: 'Little Train', type: 'ride' },
  { id: 'food_pizza', name: 'Pizza Place', type: 'food' },
  { id: 'rest_a', name: 'Restroom A', type: 'restroom' },
  { id: 'exit_main', name: 'Main Exit', type: 'exit' },
];

const TYPES = [
  { id: 'ride', name: 'Rides' },
  { id: 'food', name: 'Food' },
  { id: 'restroom', name: 'Restrooms' },
  { id: 'exit', name: 'Exits' },
];

export default function Home({ navigation }) {
  const [query, setQuery] = useState('');
  const [stops, setStops] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedPOIs, setSelectedPOIs] = useState([]);

  const filtered = SAMPLE_POIS.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));

  function addStop(poi) {
    setStops(prev => [...prev, poi]);
    setQuery('');
  }

  function removeStop(index) {
    setStops(prev => prev.filter((_, i) => i !== index));
  }

  function onStart() {
    if (stops.length < 1) {
      Alert.alert('Add at least one stop to continue.');
      return;
    }
    navigation.navigate('Results', { stops });
  }

  function toggleType(type) {
    setSelectedTypes(
      selectedTypes.some(t => t.label === type && t.pressed) ? // check if type is already selected
      selectedTypes.filter(t => t.label !== type) : //remove selection
      [...selectedTypes, {label: type, pressed: !selectedTypes.some(t => t.label === type && t.pressed)}] // add selection
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Where to?</Text>
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={setQuery}
        placeholder="Find a ride, food, restroom…"
      />

      <View style={styles.row}>
        {TYPES.map(label => (
          <View key={label.id} style={[styles.chip, selectedTypes.some(t => t.label === label.id && t.pressed) && styles.selectedChip]}>
            <Text onPress={() => toggleType(label.id)}
              style={selectedTypes.some(t => t.label === label.id && t.pressed) && styles.selectedTxt}>{label.name}</Text></View>
        ))}
      </View>

      <View style={styles.row}>
        {SAMPLE_POIS.filter(p => selectedTypes.some(t => t.label === p.type && t.pressed)).map(p => (
          <View key={p.id} style={styles.chip}><Text>{p.name}</Text></View>
        ))}
      </View>

      <TouchableOpacity style={styles.addBtn} onPress={() => {
        if (filtered[0]) addStop(filtered[0]);
        else Alert.alert('Type to search, then tap Start to see a demo.');
      }}>
        <Text style={styles.addTxt}>Add stop</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>Your stops</Text>
      <FlatList
        data={stops}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item, index }) => (
          <StopItem
            name={`${index + 1}. ${item.name}`}
            onRemove={() => removeStop(index)}
          />
        )}
        ListEmptyComponent={<Text style={{color:'#777'}}>No stops yet. Search above and tap "Add stop".</Text>}
      />

      <TouchableOpacity style={styles.startBtn} onPress={onStart}>
        <Text style={styles.startTxt}>See route</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: 'white' },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 8 },
  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 12, marginBottom: 8
  },
  row: { flexDirection: 'row', gap: 8, marginBottom: 12, flexWrap: 'wrap' },
  chip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 16, backgroundColor: '#f2f2f2' },
  addBtn: { backgroundColor: '#111', padding: 14, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  addTxt: { color: 'white', fontSize: 16, fontWeight: '600' },
  subtitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  startBtn: { backgroundColor: '#0d6efd', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 12 },
  startTxt: { color: 'white', fontSize: 16, fontWeight: '600' },
  selectedChip: { backgroundColor: '#0d6efd' },
  selectedTxt: { color: 'white' },
});
