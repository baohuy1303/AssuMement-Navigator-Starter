import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Alert
} from 'react-native';
import StopItem from '../components/StopItem';
import MapView from 'react-native-maps';
import { PROVIDER_GOOGLE } from 'react-native-maps';

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

export default function OverlapMap({ navigation }) {
  const [query, setQuery] = useState('');
  const [stops, setStops] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedPOI, setSelectedPOI] = useState(null);

  function addStop(poi) {
    setStops(prev => [...prev, poi]);
    setQuery('');
    setSelectedPOI(null);
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

  function toggleType(typeID) {
    const isSelected = selectedTypes.some(t => t === typeID);
    if(isSelected){
      setSelectedTypes(prev => prev.filter(t => t !== typeID));
      setSelectedPOI(null);
    }else{
      setSelectedTypes(prev => [...prev, typeID])
    }
  }

  function togglePOI(poi) {
    if (selectedPOI?.name === poi.name) setSelectedPOI(null);
    else setSelectedPOI(poi);
  }

  return (
      <View className="flex-1">
          <MapView 
              style={{ width: '100%', height: '100%' }} 
              showsUserLocation
              showsMyLocationButton
              showsPointsOfInterest
              followsUserLocation={true}
              showsCompass
              showsScale
          />
          
          {/* Top Section - Search and Filters */}
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, paddingTop: 48, paddingHorizontal: 16, paddingBottom: 16 }}>
              <View className="bg-white/95 rounded-2xl p-4 mb-3 shadow-lg border border-gray-200/50">
                  <Text className="text-2xl font-semibold mb-3 text-gray-900">Where to?</Text>
                  <TextInput
                      className="bg-white border border-gray-300 rounded-xl p-3 mb-3 text-base"
                      value={query}
                      onChangeText={setQuery}
                      placeholder="Find a ride, food, restroom…"
                      placeholderTextColor="#9CA3AF"
                  />

                  {/* Type Filters */}
                  <View className="flex-row gap-2 mb-3 flex-wrap">
                      {TYPES.map((label) => (
                          <TouchableOpacity
                              key={label.id}
                              onPress={() => toggleType(label.id)}
                              className={`py-2 px-4 rounded-2xl shadow-md border ${
                                  selectedTypes?.some((t) => t === label.id)
                                      ? 'bg-blue-600 border-blue-700 shadow-blue-600/30'
                                      : 'bg-white border-gray-300 shadow-gray-100/20'
                              }`}
                          >
                              <Text
                                  className={`font-medium text-sm ${
                                      selectedTypes?.some((t) => t === label.id)
                                          ? 'text-white'
                                          : 'text-gray-700'
                                  }`}
                              >
                                  {label.name}
                              </Text>
                          </TouchableOpacity>
                      ))}
                  </View>

                  {/* POI Selection */}
                  {selectedTypes.length > 0 && (
                      <View className="flex-row gap-2 mb-3 flex-wrap">
                          {SAMPLE_POIS.filter((p) =>
                              selectedTypes?.some((t) => t === p.type)
                          ).map((p) => (
                              <TouchableOpacity
                                  key={p.id}
                                  onPress={() => togglePOI(p)}
                                  className={`py-2 px-4 rounded-2xl border shadow-md ${
                                      selectedPOI?.name === p.name
                                          ? 'bg-blue-600 border-blue-700 shadow-blue-600/30'
                                          : 'bg-white border-gray-300 shadow-gray-100/20'
                                  }`}
                              >
                                  <Text
                                      className={`font-medium text-sm ${
                                          selectedPOI?.name === p.name ? 'text-white' : 'text-gray-700'
                                      }`}
                                  >
                                      {p.name}
                                  </Text>
                              </TouchableOpacity>
                          ))}
                      </View>
                  )}

                  {/* Add Stop Button */}
                  <TouchableOpacity
                      className={`py-3.5 rounded-xl items-center shadow-md ${
                          !selectedPOI 
                              ? 'bg-gray-300 border border-gray-400' 
                              : 'bg-black border border-gray-800'
                      }`}
                      onPress={() => selectedPOI && addStop(selectedPOI)}
                      disabled={!selectedPOI}
                  >
                      <Text className={`text-base font-semibold ${
                          !selectedPOI ? 'text-gray-500' : 'text-white'
                      }`}>
                          {selectedPOI ? 'Add stop' : 'Select a POI to add'}
                      </Text>
                  </TouchableOpacity>
              </View>
          </View>

          {/* Bottom Section - Stops List and Action */}
          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingBottom: 32, paddingHorizontal: 16, paddingTop: 16 }}>
              <View className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200/50" >
                  <Text className="text-lg font-semibold mb-3 text-gray-900">Your stops</Text>
                  
                  <FlatList
                      data={stops}
                      keyExtractor={(_, i) => String(i)}
                      renderItem={({ item, index }) => (
                          <StopItem
                              name={`${index + 1}. ${item.name}`}
                              onRemove={() => removeStop(index)}
                          />
                      )}
                      ListEmptyComponent={
                          <Text className="text-gray-500 text-sm py-4">
                              No stops yet. Search above and tap "Add stop".
                          </Text>
                      }
                      showsVerticalScrollIndicator={true}
                      style={{ maxHeight: 180 }}
                  />

                  <TouchableOpacity
                      className="bg-blue-600 py-3.5 rounded-xl items-center mt-3 shadow-2xl shadow-blue-600/20 border border-blue-700"
                      onPress={onStart}
                  >
                      <Text className="text-white text-base font-semibold">
                          See route
                      </Text>
                  </TouchableOpacity>
              </View>
          </View>
      </View>
  );
}
