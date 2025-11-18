import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function Guide({ route, navigation }) {
    const { stops = [] } = route.params || {};
    const [legIndex, setLegIndex] = useState(0);

    const maxLeg = Math.max(0, stops.length - 1);

    function next() {
        setLegIndex((i) => Math.min(i + 1, maxLeg - 1));
    }
    function prev() {
        setLegIndex((i) => Math.max(i - 1, 0));
    }

    const currentFrom = stops[legIndex];
    const currentTo = stops[legIndex + 1];

    return (
        <View className="flex-1 p-4 bg-white">
            <Text className="text-xl font-semibold mb-2">Guidance</Text>
            <Text className="text-base mb-4">
                Leg {Math.min(legIndex + 1, maxLeg)}/{maxLeg}
            </Text>

            <View className="h-40 rounded-2xl bg-slate-50 items-center justify-center border border-slate-200">
                <Text className="text-6xl">⇨</Text>
            </View>
            <Text className="text-lg text-center my-4">
                Walk towards: {currentTo ? currentTo.name : '—'}
            </Text>

            <View className="flex-row justify-center gap-3">
                <TouchableOpacity
                    className="p-3 rounded-lg border border-gray-300 mx-2 min-w-[100px] items-center"
                    onPress={prev}
                >
                    <Text>Previous</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="p-3 rounded-lg border border-gray-300 mx-2 min-w-[100px] items-center"
                    onPress={next}
                >
                    <Text>Next</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                className="bg-red-500 p-3 rounded-xl items-center mt-5"
                onPress={() => navigation.popToTop()}
            >
                <Text className="text-white font-semibold">End</Text>
            </TouchableOpacity>
        </View>
    );
}

