import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import { EXPO_PUBLIC_API_GOOGLE_MAPS } from '@env';

export default function Results({ navigation, route }) {
    const { stops = [] } = route.params || {};
    const [orderMode, setOrderMode] = useState('my'); // 'my' | 'best'
    const [accessibleOnly, setAccessibleOnly] = useState(false);
    const [routeInfo, setRouteInfo] = useState(null);

    const totalLegs = Math.max(0, stops.length - 1);

    const initialRegion =
        stops.length > 0
            ? {
                  latitude: stops[0].latitude,
                  longitude: stops[0].longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
              }
            : {
                  latitude: 40.1878,
                  longitude: -92.581,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
              };

    return (
        <ScrollView className="bg-white">
            <View className="p-4">
                <Text className="text-xl font-semibold mb-3">
                    Route overview
                </Text>

                <View className="p-3 rounded-xl border border-gray-200 bg-gray-50 mb-3">
                    <Text className="text-base mb-1">
                        Stops: {stops.length}
                    </Text>
                    <Text className="text-base mb-1">Legs: {totalLegs}</Text>
                    <Text className="text-base mb-1">
                        Order: {orderMode === 'my' ? 'My Order' : 'Best Order'}
                    </Text>
                    <Text className="text-base mb-1">
                        Accessible only: {accessibleOnly ? 'Yes' : 'No'}
                    </Text>
                </View>

                <View className="h-60 rounded-2xl overflow-hidden mb-3 border border-slate-200 bg-slate-100">
                    <MapView
                        style={{ flex: 1 }}
                        initialRegion={initialRegion}
                        provider={PROVIDER_GOOGLE}
                        userInterfaceStyle="dark"
                        onPanDrag={() => {}}
                    >
                        {stops.map((stop) => (
                            <Marker
                                key={stop.id || stop.name}
                                coordinate={{
                                    latitude: stop.latitude,
                                    longitude: stop.longitude,
                                }}
                                title={stop.name}
                            />
                        ))}

                        {stops.length >= 2 && (
                            <MapViewDirections
                                origin={stops[0]}
                                waypoints={stops.slice(1, stops.length - 1)}
                                destination={stops[stops.length - 1]}
                                apikey={EXPO_PUBLIC_API_GOOGLE_MAPS}
                                strokeColor="blue"
                                strokeWidth={6}
                                mode="WALKING"
                                resetOnChange={true}
                                onReady={(res) => {
                                    setRouteInfo({
                                        distance: res.distance,
                                        duration: res.duration,
                                    });
                                }}
                            />
                        )}
                    </MapView>
                </View>

                {routeInfo && (
                    <View className="mb-3 p-3 rounded-xl border border-gray-200 bg-gray-50">
                        <Text className="text-base mb-1">
                            Distance: {routeInfo.distance.toFixed(2)} km
                        </Text>
                        <Text className="text-base mb-1">
                            Duration: {routeInfo.duration.toFixed(1)} min
                        </Text>
                    </View>
                )}

                <View className="flex-row gap-3 mb-3">
                    <TouchableOpacity
                        className="flex-1 p-3 rounded-xl border border-gray-300 items-center"
                        onPress={() =>
                            setOrderMode(orderMode === 'my' ? 'best' : 'my')
                        }
                    >
                        <Text>
                            Order:{' '}
                            {orderMode === 'my' ? 'My Order' : 'Best Order'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="flex-1 p-3 rounded-xl border border-gray-300 items-center"
                        onPress={() => setAccessibleOnly(!accessibleOnly)}
                    >
                        <Text>
                            Accessible only: {accessibleOnly ? 'On' : 'Off'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    className="bg-blue-600 py-3.5 rounded-xl items-center mb-3"
                    onPress={() => navigation.navigate('Guide', { stops })}
                >
                    <Text className="text-white text-base font-semibold">
                        Start
                    </Text>
                </TouchableOpacity>

                <Text className="text-lg font-semibold mb-2">Legs</Text>
                {stops.map((s, i) =>
                    i < stops.length - 1 ? (
                        <View
                            className="p-2.5 rounded-lg border border-gray-200 mb-2"
                            key={i}
                        >
                            <Text className="text-base">
                                {i + 1}. {s.name} → {stops[i + 1].name}
                            </Text>
                        </View>
                    ) : null
                )}
            </View>
        </ScrollView>
    );
}

