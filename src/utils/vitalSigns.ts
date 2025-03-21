import { HealthFlow } from "@/reducer/healthflowReducer";

export type AgeGroup = 'bebê' | 'criança' | 'adulto' | 'idoso';

export const vitalSignsReference: {
    [key in AgeGroup]: {
        heartRate: number[];
        respiratoryRate: number[];
        bloodPressure: { minSystolic: number, maxSystolic: number, minDiastolic: number, maxDiastolic: number } | null;
        temperature: number[];
        saturation: number[];
    };
} = {
    bebê: { heartRate: [100, 160], respiratoryRate: [30, 60], bloodPressure: { minSystolic: 90, maxSystolic: 140, minDiastolic: 60, maxDiastolic: 99 }, temperature: [36.1, 37.2], saturation: [90, 100] },
    criança: { heartRate: [80, 120], respiratoryRate: [20, 30], bloodPressure: { minSystolic: 90, maxSystolic: 140, minDiastolic: 60, maxDiastolic: 99 }, temperature: [36.1, 37.2], saturation: [90, 100] },
    adulto: { heartRate: [60, 100], respiratoryRate: [14, 20], bloodPressure: { minSystolic: 90, maxSystolic: 140, minDiastolic: 60, maxDiastolic: 99 }, temperature: [35.6, 37.7], saturation: [90, 100] },
    idoso: { heartRate: [45, 90], respiratoryRate: [16, 25], bloodPressure: null, temperature: [36.1, 37.2], saturation: [90, 100] },
};

export function countAbnormalVitalSigns(flow: HealthFlow) {
    const patientAgeGroup = flow.patientAgeGroup;
    const patientGender = flow.patientGender;

    if (!patientAgeGroup || !vitalSignsReference.hasOwnProperty(patientAgeGroup)) {
        return 0;
    }

    const vitalSigns = vitalSignsReference[patientAgeGroup];

    let bloodPressureReference = vitalSigns.bloodPressure;
    if (patientAgeGroup === "idoso") {
        bloodPressureReference = patientGender === "mulher" ? { minSystolic: 90, maxSystolic: 140, minDiastolic: 60, maxDiastolic: 99 } : { minSystolic: 90, maxSystolic: 140, minDiastolic: 60, maxDiastolic: 99 };
    }

    if (!flow.vitalData || flow.vitalData.length === 0) {
        return 0;
    }

    const lastVitalData = flow.vitalData[flow.vitalData.length - 1];
    let bloodPressureArray: number[] = [];
    if (typeof lastVitalData.bloodPressure === "string") {
        const splitBP = lastVitalData.bloodPressure.split("/").map(bp => parseInt(bp.trim(), 10));
        if (splitBP.length === 2 && !isNaN(splitBP[0]) && !isNaN(splitBP[1])) {
            bloodPressureArray = splitBP;
        }
    }

    let abnormalCount = 0;

    if (lastVitalData.heartRate < vitalSigns.heartRate[0] || lastVitalData.heartRate > vitalSigns.heartRate[1]) {
        abnormalCount++;
    }

    if (lastVitalData.respiratoryRate < vitalSigns.respiratoryRate[0] || lastVitalData.respiratoryRate > vitalSigns.respiratoryRate[1]) {
        abnormalCount++;
    }

    if (lastVitalData.temperature < vitalSigns.temperature[0] || lastVitalData.temperature > vitalSigns.temperature[1]) {
        abnormalCount++;
    }

    if (lastVitalData.saturation < vitalSigns.saturation[0] || lastVitalData.saturation > vitalSigns.saturation[1]) {
        abnormalCount++;
    }

    if (bloodPressureArray.length === 2 && bloodPressureReference) {
        const [systolic, diastolic] = bloodPressureArray;
        const { minSystolic, maxSystolic, minDiastolic, maxDiastolic } = bloodPressureReference;

        let isAbnormal = false;

        if (systolic < minSystolic || systolic > maxSystolic) {
            isAbnormal = true;
        }

        if (diastolic < minDiastolic || diastolic > maxDiastolic) {
            isAbnormal = true;
        }

        if (isAbnormal) {
            abnormalCount++;
        }
    }

    return abnormalCount;
}
