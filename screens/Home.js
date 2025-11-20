import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Alert,
    StyleSheet
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

export default function Home({ navigation }) {
  const [query, setQuery] = useState('');
  const [stops, setStops] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedPOI, setSelectedPOI] = useState(null);

  const filtered = SAMPLE_POIS.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));

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
      <View className="flex-1 p-4 bg-white">
          <Text className="text-2xl font-semibold mb-2">Where to?</Text>
          <TextInput
              className="border border-gray-300 rounded-xl p-3 mb-2"
              value={query}
              onChangeText={setQuery}
              placeholder="Find a ride, food, restroom…"
          />

          <View className="flex-row gap-4 mb-3 flex-wrap">
              {TYPES.map((label) => (
                  <View
                      key={label.id}
                      className={`py-2 px-3 rounded-2xl shadow-md border border-gray-400/50 
                       
                        ${
                          selectedTypes?.some((t) => t === label.id)
                              ? 'bg-blue-600 shadow-blue-600/30'
                              : 'bg-gray-100 shadow-gray-100/20'
                      }`}
                  >
                      <Text
                          onPress={() => toggleType(label.id)}
                          className={`will-change-variable
                              ${selectedTypes?.some(
                                  (t) => t === label.id
                              )
                                  ? 'text-white'
                                  : ''
                          }`}
                      >
                          {label.name}
                      </Text>
                  </View>
              ))}
          </View>
                

          <View className="flex-row gap-2 mb-3 flex-wrap">
              {SAMPLE_POIS.filter((p) =>
                  selectedTypes?.some((t) => t === p.type)
              ).map((p) => (
                  <View
                      key={p.id}
                      className={`will-change-variable py-2 px-3 rounded-2xl border border-gray-400/50 shadow-md
                        
                        ${
                          selectedPOI?.name === p.name
                              ? 'bg-blue-600 shadow-blue-600/30'
                              : 'bg-gray-100 shadow-gray-100/20'
                      }`}
                  >
                      <Text
                          onPress={() => togglePOI(p)}
                          className={`will-change-variable
                              ${selectedPOI?.name === p.name ? 'text-white' : ''}
                          `}
                      >
                          {p.name}
                      </Text>
                  </View>
              ))}
          </View>

          <TouchableOpacity
              className={`will-change-variable py-3.5 rounded-xl items-center mb-3 border border-gray-300 shadow-md ${
                  !selectedPOI ? 'bg-gray-400' : 'bg-black'
              }`}
              onPress={() => selectedPOI && addStop(selectedPOI)}
          >
              <Text className="text-white text-base font-semibold">
                  {selectedPOI ? 'Add stop' : 'Select a POI to add'}
              </Text>
          </TouchableOpacity>

          <View className="flex-1">
        <MapView style={{ width: '100%', height: '100%' }} 
        showsUserLocation
        />
        </View>

          <Text className="text-lg font-semibold mb-2">Your stops</Text>
          
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
                  <Text className="text-gray-500">
                      No stops yet. Search above and tap "Add stop".
                  </Text>
              }
          />
            
          

          <TouchableOpacity
              className="bg-blue-600 py-3.5 rounded-xl items-center mt-3 border border-gray-300 shadow-md
              shadow-blue-600/20"
              onPress={onStart}
          >
              <Text className="text-white text-base font-semibold">
                  See route
              </Text>
          </TouchableOpacity>
      </View>
  );
}
