import { TripData, TripDetails, tripServer } from "@/server/trip-server"
import { calendarUtils, DatesSelected } from "@/utils/calendarUtils"
import dayjs from "dayjs"
import { router, useLocalSearchParams } from "expo-router"
import { useState } from "react"
import { Alert } from "react-native"
import { DateData } from "react-native-calendars"

export enum LOADING {
    NONE = 0,
    GETTING_TRIP = 1,
    UPDATED_TRIP = 2
}

export enum MODAL {
    NONE = 0,
    UPDATE_TRIP = 1,
    CALENDAR = 2,
}

export default function useTrip() {
    const [loading, setLoading] = useState(LOADING.NONE)
    const [showModal, setShowModal] = useState(MODAL.NONE)

    const [tripDetails, setTripDetails] = useState({} as TripData)
    const [destination, setDestination] = useState("")
    const [selectedDates, setSelectedDates] = useState({} as DatesSelected)


    const [option, setOption] = useState<"activity" | "details">("activity")

    const tripParams = useLocalSearchParams<{
        id: string
        participant?: string
    }>()

    async function getTripDetails() {
        try {
            console.log(selectedDates);

            setLoading(LOADING.GETTING_TRIP)

            if (!tripParams.id) {
                return router.back()
            }

            const trip = await tripServer.getById(tripParams.id)

            const maxLengthDestination = 14
            const destination =
                trip.destination.length > maxLengthDestination ?
                    trip.destination.slice(0, maxLengthDestination) + " ..."
                    : trip.destination

            const starts_at = dayjs(trip.starts_at)
            const ends_at = dayjs(trip.ends_at)
            // const month = dayjs(trip.starts_at).format("MMM")

            setTripDetails({
                ...trip,
                when: `${destination}`
            })

            const data = calendarUtils.formatDatesInText({ endsAt: ends_at, startsAt: starts_at })

            setSelectedDates({
                ...selectedDates,
                formatDatesInText: data,
            })


            setDestination(trip.destination)
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(LOADING.NONE)
        }
    }

    function handleSelectDate(selectedDay: DateData) {
        const dates = calendarUtils.orderStartsAtAndEndsAt({
            startsAt: selectedDates.startsAt,
            endsAt: selectedDates.endsAt,
            selectedDay
        })

        setSelectedDates(dates)
    }

    async function handleUpdateTrip() {
        try {
            setLoading(LOADING.UPDATED_TRIP)

            if (!tripParams.id) {
                return
            }

            if (!destination) {
                return Alert.alert(
                    "Atualizar viagem",
                    "Lembre-se de, além de preencher o destino, selecione a data de início e fim da viagem"
                )
            }

            await tripServer.update({
                id: tripParams.id,
                destination,
                starts_at: dayjs(selectedDates.startsAt?.dateString).toString(),
                ends_at: dayjs(selectedDates.endsAt?.dateString).toString()
            })

            setSelectedDates({} as DatesSelected)

            Alert.alert("Atualizar viagem", "Viagem atualizada com sucesso!", [{
                text: "Ok",
                onPress: () => getTripDetails()
            }])

            setShowModal(MODAL.NONE)
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(LOADING.NONE)
        }
    }

    return {
        loading,
        tripDetails,
        tripParams,
        option,
        showModal,
        destination,
        selectedDates,
        setDestination,
        setShowModal,
        setOption,
        getTripDetails,
        handleSelectDate,
        handleUpdateTrip
    }
}