import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Alert,
    Switch,
} from 'react-native';
import StopItem from '../components/StopItem';
import MapView, { Marker, Callout } from 'react-native-maps';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import { POIS, TYPES } from '../components/StopData';
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';
import {EXPO_PUBLIC_API_GOOGLE_MAPS} from '@env';

export default function OverlapMap({ navigation }) {
    const [query, setQuery] = useState('');
    const [stops, setStops] = useState([]);
    const [selectedPOI, setSelectedPOI] = useState(null);
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [customStop, setCustomStop] = useState([]);
    const [turnOnCustom, setTurnOnCustom] = useState(false);
    const [needsRecalculate, setNeedsRecalculate] = useState(false);
    const [loadingCustom, setLoadingCustom] = useState(false);


    const userLocation = async () => {
        setLoading(true);
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission to access location was denied');
            return;
        }
        let location = await Location.getCurrentPositionAsync({
            enableHighAccuracy: true,
        });
        setLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        });
        setLoading(false);
    };

    useEffect(() => {
        userLocation();
    }, []);

    function addStop(poi) {
        setLoading(true);
        setStops((prev) => [...prev, poi]);
        setQuery('');
        setSelectedPOI(null);
        setLoading(false);
    }

    function removeStop(index) {
        setLoading(true);
        setStops((prev) => prev.filter((_, i) => i !== index));
        if (index === customStop) {
            setCustomStop(null);
        }
        setLoading(false);
    }

    function removeCustomStop(stop) {
        setLoading(true);
        setCustomStop((prev) => prev.filter((s) => s.id !== stop.id));
        if (stops.some((s) => s.id === stop.id)) {
            setStops((prev) => prev.filter((s) => s.id !== stop.id));
        }
        setSelectedPOI(null);
        setLoading(false);
    }

    function onStart() {
        if (stops.length < 2) {
            Alert.alert('Add at least two stops to continue.');
            return;
        }
        setLoading(true);
        navigation.navigate('Results', { stops });
        setLoading(false);
    }

    /*   function toggleType(typeID) {
    const isSelected = selectedTypes.some(t => t === typeID);
    if(isSelected){
      setSelectedTypes(prev => prev.filter(t => t !== typeID));
      setSelectedPOI(null);
    }else{
      setSelectedTypes(prev => [...prev, typeID])
    }
  } */

    function togglePOI(poi) {
        setSelectedPOI(poi);
    }

    return (
        <View className="flex-1">
            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <Text>Loading...</Text>
                </View>
            ) : (
                <MapView

                    style={{ width: '100%', height: '100%' }}
                    initialRegion={location}
                    showsUserLocation
                    showsMyLocationButton
                    showsPointsOfInterest
                    showsScale
                    provider={PROVIDER_GOOGLE}
                    userInterfaceStyle='dark'
                    onPanDrag={() => {}}
                    onPress={(e) => {
                        const { latitude, longitude } = e.nativeEvent.coordinate;
                        if (turnOnCustom) {

                            let customStopID = customStop.length;
                            if (customStop.length > 0) {
                                customStopID =
                                    parseInt(customStop[customStop.length - 1].id.replace('custom', '')) + 1;
                            } else {
                                customStopID = 0;
                            }

                            setCustomStop((prev) => [
                                ...prev,
                                {
                                    id: 'custom' + customStopID,
                                    name: 'Custom' + customStopID,
                                    latitude,
                                    longitude,
                                    type: 'custom',
                                },
                            ]);

                            setTurnOnCustom(false);
                        } else {
                            setSelectedPOI(null);
                        }
                        }}
                    onPoiClick={
                        (e) => {
                            console.log(e.nativeEvent.coordinate)
                        }
                    }
                >
                    {
                        POIS.map((poi) => (
                            <Marker
                                key={poi.id}
                                coordinate={{
                                    latitude: poi.latitude,
                                    longitude: poi.longitude,
                                }}
                                title={poi.name}
                                onPress={(e) => {
                                    e.stopPropagation();
                                    togglePOI(poi)
                                }}
                            ></Marker>
                        ))}
                    {
                        customStop.map((stop) => (
                            <Marker
                                draggable
                                key={stop.id}
                                coordinate={{
                                    latitude: stop.latitude,
                                    longitude: stop.longitude,
                                }}
                                title={stop.name}
                                onPress={(e) => {
                                    togglePOI(stop);
                                    e.stopPropagation();
                                }}
                                onDragStart={() => {
                                    setNeedsRecalculate(true);
                                }}
                                onDragEnd={(e) => {
                                    const { latitude, longitude } = e.nativeEvent.coordinate;

                                    setCustomStop((prev) =>
                                        prev.map((s) =>
                                            s.id === stop.id
                                                ? {
                                                    ...s,
                                                    latitude,
                                                    longitude,
                                                }
                                                : s
                                        )
                                    );

                                    setStops((prev) =>
                                        prev.map((s) =>
                                            s.id === stop.id
                                                ? {
                                                    ...s,
                                                    latitude,
                                                    longitude,
                                                }
                                                : s
                                        )
                                    );

                                    e.stopPropagation();
                                    setNeedsRecalculate(false);
                                }}
                            />
                        ))}


{/*                         {
                            stops.length >= 2 && !needsRecalculate && (
                                 <MapViewDirections
                                origin={stops[0]}
                                waypoints={stops.slice(1, stops.length - 1)}
                                strokeColor="blue"
                                strokeWidth={6}
                                destination={stops[stops.length - 1]}
                                apikey={EXPO_PUBLIC_API_GOOGLE_MAPS}
                                mode='WALKING'
                                resetOnChange={true}
                            />
                            )
                        } */}
                </MapView>
            )}
            {/* Top Section - Search and Filters */}
            <View
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    paddingTop: 16,
                    paddingHorizontal: 16,
                    paddingBottom: 16,
                }}
            >
                <View className="bg-gray-400/80 rounded-2xl p-4 mb-3 shadow-lg border border-gray-200/50">
                    <View className="flex-row items-center justify-between mb-3">
                        <Text className="text-2xl font-semibold mb-3 text-white">
                            Where to?
                        </Text>
                        <View className="flex-row items-center gap-2">
                            <Text className="text-sm text-white">Custom Stop</Text>
                            <Switch
                                trackColor={{
                                    false: '#767577',
                                    true: '#81b0ff',
                                }}
                                thumbColor={
                                    turnOnCustom ? '#f5dd4b' : '#f4f3f4'
                                }
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={setTurnOnCustom}
                                value={turnOnCustom}
                            />
                        </View>
                    </View>
                    {/* <TextInput
                      className="bg-white border border-gray-300 rounded-xl p-3 mb-3 text-base"
                      value={query}
                      onChangeText={setQuery}
                      placeholder="Find a ride, food, restroom…"
                      placeholderTextColor="#9CA3AF"
                  /> */}

                    {/* Type Filters */}
                    {/*  <View className="flex-row gap-2 mb-3 flex-wrap">
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
                  </View> */}

                    {/* POI Selection */}
                    {/* 
                  {selectedTypes.length > 0 && (
                      <View className="flex-row gap-2 mb-3 flex-wrap">
                          {POIS.filter((p) =>
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
                  )} */}

                    {/* Custom Stop Switch */}

                    {/* Add Stop Button */}
                    <View className="flex-row w-full gap-3 mb-3">
                        <TouchableOpacity
                            className={`flex-2 py-3.5 rounded-xl items-center justify-center shadow-md ${
                                !selectedPOI
                                    ? 'bg-gray-200 border border-gray-300'
                                    : 'bg-blue-600 border border-blue-700'
                            }`}
                            onPress={() => selectedPOI && addStop(selectedPOI)}
                            disabled={!selectedPOI}
                        >
                            <Text
                                className={`text-base font-semibold ${
                                    !selectedPOI
                                        ? 'text-gray-500'
                                        : 'text-white'
                                }`}
                            >
                                {selectedPOI
                                    ? 'Add Stop'
                                    : 'Select a POI to Add'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className={`flex-1 py-3.5 rounded-xl items-center justify-center shadow-md ${
                                selectedPOI?.type !== 'custom'
                                    ? 'bg-gray-100 border border-gray-200'
                                    : 'bg-red-500 border border-red-600'
                            }`}
                            onPress={() =>
                                selectedPOI?.type === 'custom' &&
                                removeCustomStop(selectedPOI)
                            }
                            disabled={selectedPOI?.type !== 'custom'}
                        >
                            <Text
                                className={`text-sm font-medium text-center ${
                                    selectedPOI?.type !== 'custom'
                                        ? 'text-gray-400'
                                        : 'text-white'
                                }`}
                            >
                                {selectedPOI?.type === 'custom'
                                    ? 'Remove'
                                    : 'Remove'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Bottom Section - Stops List and Action */}
            <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    paddingBottom: 32,
                    paddingHorizontal: 16,
                    paddingTop: 16,
                }}
            >
                <View className="bg-white/70 rounded-2xl p-4 shadow-lg border border-gray-200/50">
                    <Text className="text-lg font-semibold mb-3 text-gray-900">
                        Your stops
                    </Text>

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
                                No stops yet. Pick a marker and add a stop.
                            </Text>
                        }
                        showsVerticalScrollIndicator={true}
                        style={{ maxHeight: 130 }}
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
