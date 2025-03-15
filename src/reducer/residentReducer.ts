export interface Resident {
    id: string;
    name: string;
    specialty: string;
    email: string;
    phone: string;
}

export interface ResidentState {
    residents: Resident[];
    loading: boolean;
    error: string | null;
}

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firestore';
import { AppDispatch } from '@/store/store';

const initialState: ResidentState = {
    residents: [],
    loading: false,
    error: null,
};

const residentSlice = createSlice({
    name: 'resident',
    initialState,
    reducers: {
        setResidents: (state, action: PayloadAction<Resident[]>) => {
            state.residents = action.payload;
        },
        addResident: (state, action: PayloadAction<Resident>) => {
            state.residents.push(action.payload);
        },
        editResident: (state, action: PayloadAction<Resident>) => {
            const index = state.residents.findIndex((resident) => resident.id === action.payload.id);
            if (index !== -1) {
                state.residents[index] = action.payload;
            }
        },
        removeResident: (state, action: PayloadAction<string>) => {
            state.residents = state.residents.filter((resident) => resident.id !== action.payload);
        },
    },
});

export const { setResidents, addResident, editResident, removeResident } = residentSlice.actions;

export default residentSlice.reducer;

export const fetchResidents = () => async (dispatch: AppDispatch) => {
    try {
        const querySnapshot = await getDocs(collection(db, 'residents'));
        const residentsList: Resident[] = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as Resident[];
        dispatch(setResidents(residentsList));
    } catch (error) {
        console.error('Error fetching residents: ', error);
    }
};

export const createResident = (resident: Omit<Resident, 'id'>) => async (dispatch: AppDispatch) => {
    try {
        const residentRef = await addDoc(collection(db, 'residents'), resident);
        const newResident = { ...resident, id: residentRef.id };
        dispatch(addResident(newResident));
    } catch (error) {
        console.error('Error creating resident: ', error);
    }
};

export const updateResident = (resident: Resident) => async (dispatch: AppDispatch) => {
    try {
        if (!resident.id || !resident.name || !resident.specialty || !resident.email || !resident.phone) {
            console.error('Missing resident fields, cannot update resident.');
            return;
        }

        const residentRef = doc(db, 'residents', resident.id);
        await updateDoc(residentRef, {
            name: resident.name,
            specialty: resident.specialty,
            email: resident.email,
            phone: resident.phone,
        });

        dispatch(editResident(resident));
    } catch (error) {
        console.error('Error updating resident: ', error);
    }
};

export const deleteResident = (id: string) => async (dispatch: AppDispatch) => {
    try {
        const residentRef = doc(db, 'residents', id);
        await deleteDoc(residentRef);
        dispatch(removeResident(id));
    } catch (error) {
        console.error('Error deleting resident: ', error);
    }
};
