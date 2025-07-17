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

export const createFarm = async (farmData: CreateFarmPayload, token: string) => {
  const response = await fetch("http://localhost:3003/farm", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, 
    },
    body: JSON.stringify(farmData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erro ao cadastrar fazenda");
  }

  return await response.json();
};

export const updateFarm = async (
  id: number,
  farmData: Partial<CreateFarmPayload>,
  token: string
) => {
  const response = await fetch(`http://localhost:3003/farm/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(farmData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erro ao atualizar fazenda");
  }

  return await response.json();
};

export const deleteFarm = async (farmId: number, token: string) => {
  const res = await fetch(`http://localhost:3003/farm/${farmId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Erro ao deletar fazenda");
  }

  return true;
};
