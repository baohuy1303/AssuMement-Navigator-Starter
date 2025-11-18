import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Guide({ route, navigation }) {
  const { stops = [] } = route.params || {};
  const [legIndex, setLegIndex] = useState(0);

  const maxLeg = Math.max(0, stops.length - 1);

  function next() { setLegIndex(i => Math.min(i + 1, maxLeg - 1)); }
  function prev() { setLegIndex(i => Math.max(i - 1, 0)); }

  const currentFrom = stops[legIndex];
  const currentTo = stops[legIndex + 1];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Guidance</Text>
      <Text style={styles.step}>Leg {Math.min(legIndex + 1, maxLeg)}/{maxLeg}</Text>

      <View style={styles.bigArrow}>
        <Text style={styles.arrow}>⇨</Text>
      </View>
      <Text style={styles.instruction}>
        Walk towards: {currentTo ? currentTo.name : '—'}
      </Text>

      <View style={styles.row}>
        <TouchableOpacity style={styles.btn} onPress={prev}><Text>Previous</Text></TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={next}><Text>Next</Text></TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.endBtn} onPress={() => navigation.popToTop()}>
        <Text style={styles.endTxt}>End</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: 'white' },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 8 },
  step: { fontSize: 16, marginBottom: 16 },
  bigArrow: { height: 160, borderRadius: 16, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  arrow: { fontSize: 64 },
  instruction: { fontSize: 18, textAlign: 'center', marginVertical: 16 },
  row: { flexDirection: 'row', justifyContent: 'center', gap: 12 },
  btn: { padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#ddd', marginHorizontal: 8, minWidth: 100, alignItems: 'center' },
  endBtn: { backgroundColor: '#ef4444', padding: 12, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  endTxt: { color: 'white', fontWeight: '600' }
});
