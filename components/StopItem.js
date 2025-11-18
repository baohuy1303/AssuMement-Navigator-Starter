import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function StopItem({ name, onRemove }) {
  return (
    <View style={styles.row}>
      <Text style={styles.name}>{name}</Text>
      <TouchableOpacity onPress={onRemove} style={styles.deleteBtn}>
        <Text style={styles.deleteTxt}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    marginVertical: 6,
    backgroundColor: '#fafafa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  name: { fontSize: 16 },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  deleteTxt: { fontSize: 16 }
});
