import { Keyboard, Text, TouchableOpacity, View } from "react-native";
import useTrip, { LOADING, MODAL } from "./useTrip";
import { Loading } from "@/components/loading";
import { useEffect } from "react";
import { Input } from "@/components/input";
import { CalendarRange, Info, MapPin, Settings2, Calendar as IconCalendar } from "lucide-react-native";
import { colors } from "@/styles/colors";
import { Button } from "@/components/button";
import { TripActivities } from "./activities";
import { TripDetails } from "./details";
import { Modal } from "@/components/modal";
import { Calendar } from "@/components/calendar";

export default function Trip() {
    const {
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
        handleUpdateTrip,
    } = useTrip()

    useEffect(() => {
        getTripDetails()
    }, [])

    if (loading === LOADING.GETTING_TRIP) {
        return <Loading />
    }

    const optionView = () => {
        return option === "activity"
            ? <TripActivities tripDetails={tripDetails} />
            : <TripDetails tripId={tripParams.id ?? ""} />
    }

    return (
        <View className="flex-1 px-5 pt-16">
            <Input variant="tertiary">
                <MapPin color={colors.zinc[400]} size={20} />
                <Input.Field value={tripDetails.when} readOnly />

                <TouchableOpacity activeOpacity={0.7}
                    onPress={() => setShowModal(MODAL.UPDATE_TRIP)}
                >
                    <View
                        className="w-9 h-9 bg-zinc-800 items-center justify-center rounded-lg"
                    >
                        <Settings2 color={colors.zinc[400]} size={20} />
                    </View>
                </TouchableOpacity>
            </Input>

            {optionView()}

            <View className="w-full absolute -bottom-1 self-center justify-end pb-5 z-10 bg-zinc-950">
                <View className="w-full absolute flex-row bg-zinc-900 p-4 rounded-lg border border-zinc-800 gap-2 justify-center items-center">
                    <Button
                        className="flex-1 px-10"
                        onPress={() => setOption("activity")}
                        variant={option === "activity" ? "primary" : "secondary"}
                    >
                        <CalendarRange
                            color={option === "activity" ? colors.lime[950] : colors.zinc[200]}
                            size={20}
                        />

                        <Button.Title>Atividades</Button.Title>
                    </Button>

                    <Button
                        className="flex-1 px-10"
                        onPress={() => setOption("details")}
                        variant={option === "details" ? "primary" : "secondary"}
                    >
                        <Info
                            color={option === "details" ? colors.lime[950] : colors.zinc[200]}
                            size={20}
                        />

                        <Button.Title>Detalhes</Button.Title>
                    </Button>
                </View>
            </View>

            <Modal
                title="Atualizar viagem"
                subtitle="Somente quem criou a viagem pode editar"
                visible={showModal === MODAL.UPDATE_TRIP}
                onClose={() => setShowModal(MODAL.NONE)}
            >
                <View className="gap-2 my-4">
                    <Input variant="secondary">
                        <MapPin color={colors.zinc[400]} size={20} />
                        <Input.Field
                            placeholder="Para onde?"
                            onChangeText={setDestination}
                            value={destination} />
                    </Input>

                    <Input variant="secondary">
                        <IconCalendar color={colors.zinc[400]} size={20} />
                        <Input.Field
                            placeholder="Quando?"
                            onFocus={() => Keyboard.dismiss()}
                            showSoftInputOnFocus={false}
                            onPressIn={() => setShowModal(MODAL.CALENDAR)}
                            value={selectedDates.formatDatesInText}
                            autoCorrect={false}
                        />
                    </Input>

                    <Button onPress={handleUpdateTrip} isLoading={loading === LOADING.UPDATED_TRIP}>
                        <Button.Title>Atualizar</Button.Title>
                    </Button>
                </View>
            </Modal>

            <Modal
                title="Selecionar datas"
                subtitle="Selcione a data de ida e volta da viagem"
                visible={showModal === MODAL.CALENDAR}
                onClose={() => setShowModal(MODAL.NONE)}
            >
                <View className="gap-4 mt-4">
                    <Calendar
                        onDayPress={handleSelectDate}
                        markedDates={selectedDates.dates}
                    />

                    <Button onPress={() => setShowModal(MODAL.UPDATE_TRIP)}>
                        <Button.Title>Confirmar</Button.Title>
                    </Button>
                </View>
            </Modal>
        </View>
    )
}