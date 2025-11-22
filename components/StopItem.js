import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function StopItem({ name, onRemove }) {
    return (
        <View className="flex-row items-center justify-between p-2 my-1 bg-gray-50 rounded-xl border border-gray-300">
            <Text className="text-base">{name}</Text>
            <TouchableOpacity
                onPress={onRemove}
                className="w-8 h-8 rounded-full items-center justify-center border border-gray-300"
            >
                <Text className="text-base">✕</Text>
            </TouchableOpacity>
        </View>
    );
}
