"use client";
import { API_URL } from "./apiConfig";
import { authenticatedFetch, handleAuthError } from "./authHelper";

export type PlantedCrop = {
  name: string;
};

export type CropSeason = {
  year: number;
  plantedCrops: PlantedCrop[];
};

export type CreateFarmPayload = {
  name: string;
  city: string;
  state: string;
  totalArea: number;
  arableArea: number;
  vegetationArea: number;
  cropSeasons: CropSeason[];
};

export const createFarm = async (farmData: CreateFarmPayload) => {
  const response = await authenticatedFetch(`${API_URL}/farm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(farmData),
  });

  if (handleAuthError(response)) {
    throw new Error("Sessão expirada");
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erro ao cadastrar fazenda");
  }

  return await response.json();
};

export const updateFarm = async (
  id: number,
  farmData: Partial<CreateFarmPayload>
) => {
  const response = await authenticatedFetch(`${API_URL}/farm/${id}`, {  
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(farmData),
  });

  if (handleAuthError(response)) {
    throw new Error("Sessão expirada");
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erro ao atualizar fazenda");
  }

  return await response.json();
};

export const deleteFarm = async (farmId: number) => {
  const res = await authenticatedFetch(`${API_URL}/farm/${farmId}`, { 
    method: "DELETE",
  });

  if (handleAuthError(res)) {
    throw new Error("Sessão expirada");
  }

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Erro ao deletar fazenda");
  }

  return true;
};
