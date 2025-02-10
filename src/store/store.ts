import bedReducer from '@/reducer/bedReducer';
import doctorReducer from '@/reducer/doctorReducer';
import nurseReducer from '@/reducer/nurseReducer';
import patientReducer from '@/reducer/patientReducer';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
    reducer: {
        doctor: doctorReducer,
        nurse: nurseReducer,
        patient: patientReducer,
        bed: bedReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
