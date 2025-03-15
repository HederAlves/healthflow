import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firestore';
import { AppDispatch } from '@/store/store';

export interface Patient {
    id: string;
    name: string;
    disease: string;
    ageGroup: string;
    patientGender: string;
}

export interface PatientState {
    patients: Patient[];
    loading: boolean;
    error: string | null;
}

const initialState: PatientState = {
    patients: [],
    loading: false,
    error: null,
};

const patientSlice = createSlice({
    name: 'patient',
    initialState,
    reducers: {
        setPatients: (state, action: PayloadAction<Patient[]>) => {
            state.patients = action.payload;
        },
        addPatient: (state, action: PayloadAction<Patient>) => {
            state.patients.push(action.payload);
        },
        editPatient: (state, action: PayloadAction<Patient>) => {
            const index = state.patients.findIndex((patient) => patient.id === action.payload.id);
            if (index !== -1) {
                state.patients[index] = action.payload;
            }
        },
        removePatient: (state, action: PayloadAction<string>) => {
            state.patients = state.patients.filter((patient) => patient.id !== action.payload);
        },
    },
});

export const { setPatients, addPatient, editPatient, removePatient } = patientSlice.actions;

export default patientSlice.reducer;

export const fetchPatients = () => async (dispatch: AppDispatch) => {
    try {
        const querySnapshot = await getDocs(collection(db, 'patients'));
        const patients: Patient[] = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name,
                disease: data.disease,
                ageGroup: data.ageGroup,
                patientGender: data.patientGender
            };
        });
        dispatch(setPatients(patients));
    } catch (error) {
        console.error('Error fetching patients: ', error);
    }
};

export const createPatient = (patient: Omit<Patient, 'id'>) => async (dispatch: any) => {
    try {
        if (!patient.name || !patient.disease || !patient.ageGroup || !patient.patientGender) {
            console.error('Missing required patient fields');
            return;
        }
        const patientRef = await addDoc(collection(db, 'patients'), patient);
        const newPatient = { ...patient, id: patientRef.id };
        dispatch(addPatient(newPatient));
    } catch (error) {
        console.error('Error creating patient: ', error);
    }
};

export const updatePatient = (patient: Patient) => async (dispatch: any) => {
    try {
        if (!patient.id || !patient.name || !patient.disease || !patient.ageGroup || !patient.patientGender) {
            console.error('Missing patient fields, cannot update patient.');
            return;
        }

        const patientRef = doc(db, 'patients', patient.id);
        await updateDoc(patientRef, {
            name: patient.name,
            disease: patient.disease,
            ageGroup: patient.ageGroup,
            patientGender: patient.patientGender,
        });
        dispatch(editPatient(patient));
    } catch (error) {
        console.error('Error updating patient: ', error);
    }
};

export const deletePatient = (id: string) => async (dispatch: any) => {
    try {
        const patientRef = doc(db, 'patients', id);
        await deleteDoc(patientRef);
        dispatch(removePatient(id));
    } catch (error) {
        console.error('Error deleting patient: ', error);
    }
};
