import { api } from './api';

export type TripDetails = {
    id: string
    destination: string
    starts_at: string
    ends_at: string
    is_confirmed: string
}

export type TripData = TripDetails & { when: string }

export type TripCreate = Omit<TripDetails, "id" | "is_confirmed"> & {
    emails_to_invite: string[]
}

const BASE = "trips"

async function getById(id: string) {
    try {
        // const { data } = await api.get<{ trip: TripDetails }>(`${BASE}/${id}`)
        let ends_at = new Date();
        ends_at.setDate(ends_at.getDate() + 10);

        const data = {
            id: "a2ffb871-5c96-41a0-9ed1-d49f758beb99",
            destination: "Sampa Lugar Bom De Se Morar",
            starts_at: new Date().toDateString(),
            ends_at: ends_at.toDateString(),
            emails_to_invite: ["danilo@gmail.com"],
            owner_name: "Danilo Rocha",
            owner_email: "danilosilvasrocha@gmail.com",
            when: "",
            is_confirmed: "true"
        } as TripData
        return data
    } catch (error) {
        throw error
    }
}

async function create({ destination, ends_at, starts_at, emails_to_invite }: TripCreate) {
    try {
        // const { data } = await api.post<{ tripId: string }>(`${BASE}`, {

        // })
        const data = {
            id: "a2ffb871-5c96-41a0-9ed1-d49f758beb99",
            destination,
            starts_at,
            ends_at,
            emails_to_invite,
            owner_name: "Danilo Rocha",
            owner_email: "danilosilvasrocha@gmail.com"
        }

        return data
    } catch (error) {
        return
    }
}

async function update({ destination, ends_at, starts_at, id }: Omit<TripDetails, "is_confirmed">) {
    try {
        // const { data } = await api.post<{ tripId: string }>(`${BASE}`, {

        // })
        const data = {
            id: "a2ffb871-5c96-41a0-9ed1-d49f758beb99",
            destination,
            starts_at,
            ends_at,
            owner_name: "Danilo Rocha",
            owner_email: "danilosilvasrocha@gmail.com"
        }

        return data
    } catch (error) {
        return
    }
}

export const tripServer = { getById, create, update }