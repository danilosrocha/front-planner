import { Input } from "@/components/input"
import { View, Text, Image, Keyboard } from "react-native"
import { MapPin, Calendar as IconCalendar, Settings2, UserRoundPlus, ArrowRight, AtSign } from "lucide-react-native"
import { colors } from "@/styles/colors"
import { Button } from "@/components/button"
import useIndex, { LOADING, MODAL, StepForm } from "./index/useIndex"
import { Modal } from "@/components/modal"
import { Calendar } from "@/components/calendar"
import { GuestEmail } from "@/components/email"
import { Loading } from "@/components/loading"
import { useEffect } from "react"

export default function Index() {
    const {
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
    } = useIndex()

    const stepTripDetails = stepForm === StepForm.TRIP_DETAILS

    const loadingCreateTrip = loading === LOADING.CREATING_TRIP

    useEffect(() => {
        getTrip()
    }, [])

    if (loading === LOADING.GETTING_TRIP) {
        return <Loading />
    }

    return (
        <View className="flex-1 items-center justify-center px-5">
            <Image
                source={require("@/assets/logo.png")}
                className="h-8"
                resizeMode="contain"
            />

            <Image source={require('@/assets/bg.png')} className="absolute" />

            <Text className="text-zinc-400 font-regular text-center text-lg mt-3">Convide seus amigos e planeje sua  {"\n"} próxima viagem</Text>

            <View className="w-full bg-zinc-900 p-4 rounded-xl my-8 border border-zinc-800">
                <Input>
                    <MapPin color={colors.zinc[400]} size={20} />
                    <Input.Field placeholder="Para onde?" editable={stepTripDetails} value={destination} onChangeText={setDestination} />
                </Input>

                <Input>
                    <IconCalendar color={colors.zinc[400]} size={20} />
                    <Input.Field
                        placeholder="Quando?"
                        editable={stepTripDetails}
                        onFocus={() => Keyboard.dismiss()}
                        showSoftInputOnFocus={false}
                        onPressIn={() => handleModal(MODAL.CALENDAR)}
                        value={selectedDates.formatDatesInText}
                    />
                </Input>

                {!stepTripDetails && (
                    <>
                        <View className="border-b py-3 border-zinc-700 gap-4">
                            <Button variant="secondary" onPress={() => handleNextStepForm(StepForm.TRIP_DETAILS)}>
                                <Button.Title>Alterar local/data</Button.Title>
                                <Settings2 color={colors.zinc[200]} size={20} />
                            </Button>
                        </View>

                        <Input>
                            <UserRoundPlus color={colors.zinc[400]} size={20} />
                            <Input.Field
                                placeholder="Quem estará na viagem"
                                onFocus={() => Keyboard.dismiss()}
                                showSoftInputOnFocus={false}
                                onPressIn={() => handleModal(MODAL.GUESTS)}
                                autoCorrect={false}
                                value={
                                    emailsToInvite.length > 0
                                        ? `${emailsToInvite.length} pessoa(s) convidada(s)`
                                        : ""
                                }
                            />
                        </Input>
                    </>
                )}

                <Button onPress={() => handleNextStepForm(StepForm.ADD_EMAIL)} isLoading={loadingCreateTrip}>
                    <Button.Title>
                        {
                            stepTripDetails ? "Continuar" : "Confirmar viagem"
                        }
                    </Button.Title>
                    <ArrowRight color={colors.lime[950]} size={20} />
                </Button>
            </View>

            <Text className="text-zinc-500 font-regular text-center text-base">
                Ao planejar sua viagem pela plann.er, você concorda automaticamente com os nossos {""}
                <Text className="text-zinc-300 underline">termos de uso</Text> e
                <Text className="text-zinc-300 underline"> políticas de privacidade</Text>
            </Text>

            <Modal
                title="Selecionar datas"
                subtitle="Selcione a data de ida e volta da viagem"
                visible={showModal === MODAL.CALENDAR}
                onClose={() => handleModal(MODAL.NONE)}
            >
                <View className="gap-4 mt-4">
                    <Calendar
                        onDayPress={handleSelectDate}
                        markedDates={selectedDates.dates}
                    />

                    <Button onPress={() => handleModal(MODAL.NONE)}>
                        <Button.Title>Confirmar</Button.Title>
                    </Button>
                </View>
            </Modal>

            <Modal
                title="Selecionar convidados"
                subtitle="Os convidados receberão e-mails para confirma a participação na viagem."
                visible={showModal === MODAL.GUESTS}
                onClose={() => handleModal(MODAL.NONE)}
            >
                <View className="my-2 flex-wrap gap-2 border-b border-zinc-800 py-5 items-start">
                    {emailsToInvite.length > 0 ? (
                        emailsToInvite.map((email, index) =>
                            <GuestEmail key={index} email={email} onRemove={() => handleRemoveEmail(email)} />
                        )
                    ) : (
                        <Text className="text-zinc-600 text-base font-regular">Nenhum e-mail adicionado</Text>
                    )}
                </View>

                <View className="gap-4 mt-4">
                    <Input variant="secondary">
                        <AtSign color={colors.zinc[400]} size={20} />
                        <Input.Field
                            placeholder="Digite o e-mail do convidado"
                            keyboardType="email-address"
                            onChangeText={(text) => setEmailToInvite(text.toLowerCase())}
                            value={emailToInvite}
                            returnKeyType="send"
                            onSubmitEditing={handleAddEmail}
                        />
                    </Input>

                    <Button onPress={handleAddEmail}>
                        <Button.Title>Convidar</Button.Title>
                    </Button>
                </View>
            </Modal>
        </View >
    )
}

