import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function Results({ navigation, route }) {
  const { stops = [] } = route.params || {};
  const [orderMode, setOrderMode] = useState('my'); // 'my' | 'best'
  const [accessibleOnly, setAccessibleOnly] = useState(false);

  const totalLegs = Math.max(0, stops.length - 1);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Route overview</Text>

      <View style={styles.card}>
        <Text style={styles.line}>Stops: {stops.length}</Text>
        <Text style={styles.line}>Legs: {totalLegs}</Text>
        <Text style={styles.line}>Order: {orderMode === 'my' ? 'My Order' : 'Best Order'}</Text>
        <Text style={styles.line}>Accessible only: {accessibleOnly ? 'Yes' : 'No'}</Text>
      </View>

      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapText}>Map placeholder (Week 3)</Text>
      </View>

      <View style={styles.row}>
        <TouchableOpacity style={styles.toggle} onPress={() => setOrderMode(orderMode === 'my' ? 'best' : 'my')}>
          <Text>Order: {orderMode === 'my' ? 'My Order' : 'Best Order'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toggle} onPress={() => setAccessibleOnly(!accessibleOnly)}>
          <Text>Accessible only: {accessibleOnly ? 'On' : 'Off'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.startBtn} onPress={() => navigation.navigate('Guide', { stops })}>
        <Text style={styles.startTxt}>Start</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>Legs</Text>
      {stops.map((s, i) => (
        i < stops.length - 1 ? (
          <View style={styles.leg} key={i}>
            <Text style={styles.legTxt}>
              {i + 1}. {s.name} → {stops[i + 1].name}
            </Text>
          </View>
        ) : null
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: 'white' },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 12 },
  card: { padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#eee', backgroundColor: '#fafafa', marginBottom: 12 },
  line: { fontSize: 16, marginBottom: 4 },
  mapPlaceholder: { height: 240, borderRadius: 16, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  mapText: { color: '#64748b' },
  row: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  toggle: { flex: 1, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#ddd', alignItems: 'center' },
  startBtn: { backgroundColor: '#0d6efd', padding: 14, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  startTxt: { color: 'white', fontSize: 16, fontWeight: '600' },
  subtitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  leg: { padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#eee', marginBottom: 8 },
  legTxt: { fontSize: 16 }
});
