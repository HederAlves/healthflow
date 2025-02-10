import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firestore';

// Interface do Nurse
export interface Nurse {
    id: string;
    name: string;
    specialty: string;
    email: string;
    phone: string;
}

// Estado inicial do slice de enfermeiros
export interface NurseState {
    nurses: Nurse[];
    loading: boolean;
    error: string | null;
}

const initialState: NurseState = {
    nurses: [],
    loading: false,
    error: null,
};

// Slice de enfermeiros
const nurseSlice = createSlice({
    name: 'nurse',
    initialState,
    reducers: {
        setNurses: (state, action: PayloadAction<Nurse[]>) => {
            state.nurses = action.payload;
        },
        addNurse: (state, action: PayloadAction<Nurse>) => {
            state.nurses.push(action.payload);
        },
        editNurse: (state, action: PayloadAction<Nurse>) => {
            const index = state.nurses.findIndex((nurse) => nurse.id === action.payload.id);
            if (index !== -1) {
                state.nurses[index] = action.payload;
            }
        },
        removeNurse: (state, action: PayloadAction<string>) => {
            state.nurses = state.nurses.filter((nurse) => nurse.id !== action.payload);
        },
    },
});

export const { setNurses, addNurse, editNurse, removeNurse } = nurseSlice.actions;

export default nurseSlice.reducer;

// Thunks para interagir com o Firestore
// Função para buscar enfermeiros
export const fetchNurses = () => async (dispatch: any) => {
    try {
        const querySnapshot = await getDocs(collection(db, 'nurses'));
        const nurses: Nurse[] = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id, // O Firestore já gera o id para o novo documento
                name: data.name,
                specialty: data.specialty,
                email: data.email,
                phone: data.phone,
            };
        });
        dispatch(setNurses(nurses));
    } catch (error) {
        console.error('Error fetching nurses: ', error);
    }
};

// Função para criar um novo enfermeiro
export const createNurse = (nurse: Omit<Nurse, 'id'>) => async (dispatch: any) => {
    try {
        const nurseRef = await addDoc(collection(db, 'nurses'), nurse); // O Firestore gera automaticamente o id
        const newNurse = { ...nurse, id: nurseRef.id }; // Obtendo o id gerado pelo Firestore
        dispatch(addNurse(newNurse));
    } catch (error) {
        console.error('Error creating nurse: ', error);
    }
};

// Função para atualizar os dados de um enfermeiro
export const updateNurse = (nurse: Nurse) => async (dispatch: any) => {
    try {
        if (!nurse.id || !nurse.name || !nurse.specialty || !nurse.email || !nurse.phone) {
            console.error('Missing nurse fields, cannot update nurse.');
            return;
        }

        const nurseRef = doc(db, 'nurses', nurse.id);
        await updateDoc(nurseRef, {
            name: nurse.name,
            specialty: nurse.specialty,
            email: nurse.email,
            phone: nurse.phone,
        });
        dispatch(editNurse(nurse));
    } catch (error) {
        console.error('Error updating nurse: ', error);
    }
};

// Função para excluir um enfermeiro
export const deleteNurse = (id: string) => async (dispatch: any) => {
    try {
        const nurseRef = doc(db, 'nurses', id);
        await deleteDoc(nurseRef);
        dispatch(removeNurse(id));
    } catch (error) {
        console.error('Error deleting nurse: ', error);
    }
};
