import { useState } from "react"
import { calendarUtils, DatesSelected } from "@/utils/calendarUtils";
import { DateData } from "react-native-calendars";
import { Alert } from "react-native";
import { validateInput } from "@/utils/validateInput";
import { tripStorage } from "@/storage/trip";
import { router } from "expo-router";
import { TripCreate, tripServer } from "@/server/trip-server";
import dayjs from 'dayjs'

export enum StepForm {
    TRIP_DETAILS = 1,
    ADD_EMAIL = 2
}

export enum MODAL {
    NONE = 0,
    CALENDAR = 1,
    GUESTS = 2
}

export enum LOADING {
    NONE = 0,
    CREATING_TRIP = 1,
    GETTING_TRIP = 2
}

export default function useIndex() {
    const [stepForm, setStepForm] = useState(StepForm.TRIP_DETAILS)
    const [showModal, setShowModal] = useState(MODAL.NONE)
    const [loading, setLoading] = useState(LOADING.GETTING_TRIP)

    const [selectedDates, setSelectedDates] = useState({} as DatesSelected)
    const [destination, setDestination] = useState("")
    const [emailToInvite, setEmailToInvite] = useState("")
    const [emailsToInvite, setEmailsToInvite] = useState<string[]>([])

    function handleNextStepForm(step: StepForm) {
        if (destination.trim().length === 0 || !selectedDates.startsAt || !selectedDates.endsAt) {
            return Alert.alert("Detalhes da viagem", "Preencha todas as informações para seguir")
        }

        if (destination.length < 4) {
            return Alert.alert("Detalhes da viagem", "Destino deve conter pelo menos 4 caracteres")
        }

        if (stepForm === StepForm.ADD_EMAIL && step !== StepForm.TRIP_DETAILS) {
            Alert.alert("Nova viagem", "Confirmar viagem?", [
                {
                    text: "Não",
                    style: "cancel"
                },
                {
                    text: "Sim",
                    onPress: createTrip
                }
            ])
        }


        return setStepForm(step)
    }

    function handleModal(modal: MODAL) {
        return setShowModal(modal)
    }

    function handleSelectDate(selectedDay: DateData) {
        const dates = calendarUtils.orderStartsAtAndEndsAt({
            startsAt: selectedDates.startsAt,
            endsAt: selectedDates.endsAt,
            selectedDay
        })

        setSelectedDates(dates)
    }

    function handleRemoveEmail(emailToRemove: string) {
        setEmailsToInvite((prevState) =>
            prevState.filter(email => email !== emailToRemove)
        )
    }

    function handleAddEmail() {
        if (!validateInput.email(emailToInvite)) {
            return Alert.alert("Convidado", "E-mail inválido")
        }

        const emailAlreadyExists = emailsToInvite.find((email) => email === emailToInvite)

        if (emailAlreadyExists) {
            return Alert.alert("Convidado", "E-mail já foi adicionado")
        }

        setEmailsToInvite([...emailsToInvite, emailToInvite])
        setEmailToInvite("")
    }

    async function createTrip() {
        try {
            setLoading(LOADING.CREATING_TRIP)

            const trip = {
                destination,
                emails_to_invite: emailsToInvite,
                ends_at: dayjs(selectedDates.startsAt?.dateString).toString(),
                starts_at: dayjs(selectedDates.endsAt?.dateString).toString()
            } as TripCreate

            const newTrip = await tripServer.create(trip)

            if (newTrip) {
                Alert.alert("Nova viagem", "Viagem criada com sucesso!", [
                    {
                        text: "Ok. Continuar!",
                        onPress: () => saveTrip(newTrip.id)
                    }
                ])
            }

        } catch (error) {
            console.log(error);
            setLoading(LOADING.NONE)
        }
    }

    async function saveTrip(tripId: string) {
        try {
            await tripStorage.save(tripId)

            router.navigate(`trip/${tripId}`)
        } catch (error) {
            Alert.alert("Salvar viagem", "Não foi possível salvar o id da viagem no dispositivo")

            console.log(error);
        }
    }

    async function getTrip() {
        try {
            const tripId = await tripStorage.get()

            if (!tripId) {
                setLoading(LOADING.NONE)
            }

            const trip = await tripServer.getById(tripId ?? "")

            if (trip) {
                return router.navigate("trip/" + trip.id)
            }
        } catch (error) {
            setLoading(LOADING.NONE)
            console.log(error);
        }
    }

    return {
        stepForm,
        showModal,
        selectedDates,
        destination,
        emailToInvite,
        emailsToInvite,
        loading,
        setDestination,
        setEmailToInvite,
        handleNextStepForm,
        handleModal,
        handleSelectDate,
        handleRemoveEmail,
        handleAddEmail,
        getTrip
    }
}