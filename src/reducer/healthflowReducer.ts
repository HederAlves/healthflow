import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firestore';
import { AppDispatch } from '@/store/store';

export interface HealthFlow {
    id: string;
    patientId: string;
    bedId: string;
    doctorId: string;
    nurseId: string;
    createdAt: string;
}

export interface HealthFlowState {
    healthFlows: HealthFlow[];
    loading: boolean;
    error: string | null;
}

const initialState: HealthFlowState = {
    healthFlows: [],
    loading: false,
    error: null,
};

const healthFlowSlice = createSlice({
    name: 'healthFlow',
    initialState,
    reducers: {
        setHealthFlows: (state, action: PayloadAction<HealthFlow[]>) => {
            state.healthFlows = action.payload;
        },
        addHealthFlow: (state, action: PayloadAction<HealthFlow>) => {
            state.healthFlows.push(action.payload);
        },
        updateHealthFlow: (state, action: PayloadAction<HealthFlow>) => {
            const index = state.healthFlows.findIndex(flow => flow.id === action.payload.id);
            if (index !== -1) {
                state.healthFlows[index] = action.payload;
            }
        },
        removeHealthFlow: (state, action: PayloadAction<string>) => {
            state.healthFlows = state.healthFlows.filter((healthFlow) => healthFlow.id !== action.payload);
        },
    },
});

export const { setHealthFlows, addHealthFlow, updateHealthFlow, removeHealthFlow } = healthFlowSlice.actions;

export default healthFlowSlice.reducer;

// Função para buscar os fluxos de saúde do Firebase
export const fetchHealthFlows = () => async (dispatch: AppDispatch) => {
    try {
        const querySnapshot = await getDocs(collection(db, 'healthflow'));
        const healthFlows: HealthFlow[] = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                patientId: data.patientId,
                bedId: data.bedId,
                doctorId: data.doctorId,
                nurseId: data.nurseId,
                createdAt: data.createdAt,
            };
        });
        dispatch(setHealthFlows(healthFlows));
    } catch (error) {
        console.error('Error fetching health flows: ', error);
    }
};

// Função para criar um novo fluxo de saúde no Firebase
export const createHealthFlow = (healthFlow: Omit<HealthFlow, 'id'>) => async (dispatch: AppDispatch) => {
    try {
        const healthFlowRef = await addDoc(collection(db, 'healthflow'), healthFlow);
        const newHealthFlow = { ...healthFlow, id: healthFlowRef.id };
        dispatch(addHealthFlow(newHealthFlow));
    } catch (error) {
        console.error('Error creating health flow: ', error);
    }
};

// Função para atualizar um fluxo de saúde no Firebase
export const updateHealthFlowFirebase = (healthFlow: HealthFlow) => async (dispatch: AppDispatch) => {
    try {
        const healthFlowDoc = doc(db, 'healthflow', healthFlow.id);
        // Converte healthFlow para um objeto simples, sem a chave `id`
        const { id, ...updatedFields } = healthFlow;
        await updateDoc(healthFlowDoc, updatedFields); // Passando apenas as propriedades atualizáveis
        dispatch(updateHealthFlow(healthFlow));
    } catch (error) {
        console.error('Error updating health flow: ', error);
    }
};

// Função para excluir um fluxo de saúde no Firebase
export const deleteHealthFlowFirebase = (id: string) => async (dispatch: AppDispatch) => {
    try {
        const healthFlowDoc = doc(db, 'healthflow', id);
        await deleteDoc(healthFlowDoc);
        dispatch(removeHealthFlow(id));
    } catch (error) {
        console.error('Error deleting health flow: ', error);
    }
};
