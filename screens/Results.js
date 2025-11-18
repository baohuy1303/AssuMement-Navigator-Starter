import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

export default function Results({ navigation, route }) {
    const { stops = [] } = route.params || {};
    const [orderMode, setOrderMode] = useState('my'); // 'my' | 'best'
    const [accessibleOnly, setAccessibleOnly] = useState(false);

    const totalLegs = Math.max(0, stops.length - 1);

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

                <View className="h-60 rounded-2xl bg-slate-100 items-center justify-center mb-3 border border-slate-200">
                    <Text className="text-slate-500">
                        Map placeholder (Week 3)
                    </Text>
                </View>

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

