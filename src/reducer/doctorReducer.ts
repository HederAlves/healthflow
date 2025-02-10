import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firestore';
import { AppDispatch } from '@/store/store';

export interface Doctor {
    id: string;
    name: string;
    specialty: string;
    email: string;
    phone: string;
}

export interface DoctorState {
    doctors: Doctor[];
    loading: boolean;
    error: string | null;
}

const initialState: DoctorState = {
    doctors: [],
    loading: false,
    error: null,
};

const doctorSlice = createSlice({
    name: 'doctor',
    initialState,
    reducers: {
        setDoctors: (state, action: PayloadAction<Doctor[]>) => {
            state.doctors = action.payload;
        },
        addDoctor: (state, action: PayloadAction<Doctor>) => {
            state.doctors.push(action.payload);
        },
        editDoctor: (state, action: PayloadAction<Doctor>) => {
            const index = state.doctors.findIndex((doctor) => doctor.id === action.payload.id);
            if (index !== -1) {
                state.doctors[index] = action.payload;
            }
        },
        removeDoctor: (state, action: PayloadAction<string>) => {
            state.doctors = state.doctors.filter((doctor) => doctor.id !== action.payload);
        },
    },
});

export const { setDoctors, addDoctor, editDoctor, removeDoctor } = doctorSlice.actions;

export default doctorSlice.reducer;

// Função para buscar médicos do Firestore
export const fetchDoctors = () => async (dispatch: AppDispatch) => {
    try {
        const querySnapshot = await getDocs(collection(db, 'doctors'));
        const doctorsList: Doctor[] = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as Doctor[];
        dispatch(setDoctors(doctorsList));
    } catch (error) {
        console.error('Error fetching doctors: ', error);
    }
};

// Função para criar um novo médico
export const createDoctor = (doctor: Omit<Doctor, 'id'>) => async (dispatch: AppDispatch) => {
    try {
        const doctorRef = await addDoc(collection(db, 'doctors'), doctor);
        const newDoctor = { ...doctor, id: doctorRef.id };
        dispatch(addDoctor(newDoctor));
    } catch (error) {
        console.error('Error creating doctor: ', error);
    }
};

// Função para atualizar um médico
export const updateDoctor = (doctor: Doctor) => async (dispatch: AppDispatch) => {
    try {
        if (!doctor.id || !doctor.name || !doctor.specialty || !doctor.email || !doctor.phone) {
            console.error('Missing doctor fields, cannot update doctor.');
            return;
        }

        const doctorRef = doc(db, 'doctors', doctor.id);
        await updateDoc(doctorRef, {
            name: doctor.name,
            specialty: doctor.specialty,
            email: doctor.email,
            phone: doctor.phone,
        });

        dispatch(editDoctor(doctor));
    } catch (error) {
        console.error('Error updating doctor: ', error);
    }
};

// Função para deletar um médico
export const deleteDoctor = (id: string) => async (dispatch: AppDispatch) => {
    try {
        const doctorRef = doc(db, 'doctors', id);
        await deleteDoc(doctorRef);
        dispatch(removeDoctor(id));
    } catch (error) {
        console.error('Error deleting doctor: ', error);
    }
};
