import { api } from "./api";
import { DoctorPackage } from "@/types";

// GET /api/packages/doctor/:doctorId
export const getDoctorPacages = async (
  doctorId: string,
): Promise<DoctorPackage[]> => {
  const response = await api.get(`/packages/doctor/${doctorId}`);
  return response.data.data.packages ?? [];
};
