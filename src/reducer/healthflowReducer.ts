import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firestore';
import { AppDispatch } from '@/store/store';

export type AgeGroup = 'bebê' | 'criança' | 'adulto' | 'idoso';
export type PatientGender = 'homem' | 'mulher';

export interface VitalData {
    timestamp: string;
    temperature: number;
    heartRate: number;
    bloodPressure: string;
    respiratoryRate: number;
}

export interface HealthFlow {
    id: string;
    patientId: string;
    patientName?: string;
    patientAgeGroup?: AgeGroup;
    patientDisease?: string;
    patientGender?: PatientGender;
    bedId: string;
    bedNumber?: string;
    bedWard?: string;
    bedRoom?: string;
    doctorId: string;
    doctorName?: string;
    nurseId: string;
    nurseName?: string;
    createdAt: string;
    vitalData?: VitalData[];
    abnormalDetails?: string[];
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

export const fetchHealthFlows = () => async (dispatch: AppDispatch) => {
    try {
        const querySnapshot = await getDocs(collection(db, 'healthflow'));

        const healthFlows: HealthFlow[] = await Promise.all(
            querySnapshot.docs.map(async (docSnap) => {
                const data = docSnap.data();

                const healthFlow: HealthFlow = {
                    id: docSnap.id,
                    patientId: data.patientId,
                    bedId: data.bedId,
                    doctorId: data.doctorId,
                    nurseId: data.nurseId,
                    createdAt: data.createdAt,
                    vitalData: data.vitalData || [],
                };

                // Buscar os dados do paciente, médico e enfermeiro em paralelo
                const [patientDoc, doctorDoc, nurseDoc, bedDoc] = await Promise.all([
                    getDoc(doc(db, 'patients', healthFlow.patientId)),
                    getDoc(doc(db, 'doctors', healthFlow.doctorId)),
                    getDoc(doc(db, 'nurses', healthFlow.nurseId)),
                    getDoc(doc(db, 'beds', healthFlow.bedId)),
                ]);

                if (patientDoc.exists()) healthFlow.patientName = patientDoc.data()?.name;
                if (patientDoc.exists()) healthFlow.patientAgeGroup = patientDoc.data()?.ageGroup;
                if (patientDoc.exists()) healthFlow.patientGender = patientDoc.data()?.patientGender;
                if (patientDoc.exists()) healthFlow.patientDisease = patientDoc.data()?.disease;
                if (doctorDoc.exists()) healthFlow.doctorName = doctorDoc.data()?.name;
                if (nurseDoc.exists()) healthFlow.nurseName = nurseDoc.data()?.name;
                if (bedDoc.exists()) healthFlow.bedNumber = bedDoc.data()?.number;
                if (bedDoc.exists()) healthFlow.bedWard = bedDoc.data()?.ward;
                if (bedDoc.exists()) healthFlow.bedRoom = bedDoc.data()?.room;

                return healthFlow;
            })
        );

        dispatch(setHealthFlows(healthFlows));
    } catch (error) {
        console.error('Error fetching health flows: ', error);
    }
};

// Função para criar um novo fluxo de saúde no Firebase
export const createHealthFlow = (newHealthFlowData: Omit<HealthFlow, 'id'>) => async (dispatch: AppDispatch) => {
    try {
        // Adicionar timestamp aos dados vitais
        const updatedVitalData = newHealthFlowData.vitalData?.map(data => ({
            ...data,
            timestamp: new Date().toISOString(),
        })) || [];

        // Criar o objeto com timestamp
        const healthFlowWithTimestamp = {
            ...newHealthFlowData,
            createdAt: new Date().toISOString(),
            vitalData: updatedVitalData
        };

        // Salvar no Firestore
        const healthFlowRef = await addDoc(collection(db, 'healthflow'), healthFlowWithTimestamp);

        // Criar objeto final com ID
        const newHealthFlow = { ...healthFlowWithTimestamp, id: healthFlowRef.id };

        // Atualizar o Redux
        dispatch(addHealthFlow(newHealthFlow));
    } catch (error) {
        console.error('Error creating health flow: ', error);
    }
};

// Função para atualizar um fluxo de saúde no Firebase
export const updateHealthFlowFirebase = (updatedFlow: HealthFlow) => async (dispatch: AppDispatch) => {
    try {
        const healthFlowRef = doc(db, 'healthflow', updatedFlow.id);
        await updateDoc(healthFlowRef, {
            vitalData: updatedFlow.vitalData, // Apenas atualiza os dados vitais
        });
        dispatch(updateHealthFlow(updatedFlow)); // Atualiza no Redux também
    } catch (error) {
        console.error('Erro ao atualizar dados vitais: ', error);
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
