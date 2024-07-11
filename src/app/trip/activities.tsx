import { TripDetails } from "@/server/trip-server";
import { Text, View } from "react-native";

export function TripActivities({ tripDetails }: { tripDetails: TripDetails }) {
    return <View className="flex-1">
        <Text className="text-white">{tripDetails.destination}</Text>
    </View>
}