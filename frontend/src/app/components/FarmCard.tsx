"use client";
import { MapPin, Pencil, Wheat, X, Check } from "lucide-react";
import { useState } from "react";
import { updateFarm, deleteFarm } from "../services/farmService";

export type Farm = {
  id: number;
  name: string;
  city: string;
  state: string;
  totalArea: number;
  arableArea: number;
  vegetationArea: number;
  cropSeasons: {
    id: number;
    year: number;
    plantedCrops: {
      id: number;
      name: string;
    }[];
  }[];
};

export const FarmCard = ({
  farm,
  onUpdate,
  onDelete,
}: {
  farm: Farm;
  onUpdate?: (updatedFarm: Farm) => void;
  onDelete: (id: number) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedFarm, setEditedFarm] = useState<Farm>(farm);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (field: keyof Farm, value: any) => {
    setEditedFarm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");

      const updatedFarm = await updateFarm(
        editedFarm.id,
        {
          name: editedFarm.name,
          city: editedFarm.city,
          state: editedFarm.state,
          totalArea: editedFarm.totalArea,
          arableArea: editedFarm.arableArea,
          vegetationArea: editedFarm.vegetationArea,
        },
        token
      );
      onUpdate?.(updatedFarm);
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao salvar fazenda: ", error);
    }
  };

  const handleCancel = () => {
    setEditedFarm(farm); // volta aos valores originais
    setIsEditing(false);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Tem certeza que deseja deletar essa propriedade?");
    if(!confirmed) return;
    
  try {
     
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token não encontrado");

    await deleteFarm(farm.id, token); 
    onDelete?.(farm.id); 
  } catch (error) {
    console.error("Erro ao deletar fazenda: ", error);
  }
};


  return (
    <div className="p-6 max-w-2xl mx-auto bg-gray-100 rounded-2xl mb-5">
      <div className="bg-white p-5 rounded-2xl w-full mb-4">
        <div className="flex justify-between">
          <div className="flex items-center gap-1 mb-1">
            <Wheat className="text-green-700" />
            {isEditing ? (
              <input
                value={editedFarm.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="text-xl font-semibold border px-2 rounded-md"
              />
            ) : (
              <h3 className="text-xl font-semibold">{farm.name}</h3>
            )}
          </div>

          <div className="flex justify-items-end w-auto gap-3 items-center">
            {isEditing ? (
              <>
                <button onClick={handleSave}>
                  <Check className="text-green-600" />
                </button>
                <button onClick={handleCancel}>
                  <X />
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setIsEditing(true)}>
                  <Pencil size={20} />
                </button>
                <button onClick={handleDelete}>
                  <X  />
                </button>
              </>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <MapPin size={15} className="text-gray-500" />
          {isEditing ? (
            <>
              <input
                value={editedFarm.city}
                onChange={(e) => handleChange("city", e.target.value)}
                className="text-sm border w-[40%] px-2 rounded-md"
              />
              <input
                value={editedFarm.state}
                onChange={(e) => handleChange("state", e.target.value)}
                className="text-sm border w-[40%] px-2 rounded-md py-1"
              />
            </>
          ) : (
            <p className="text-sm text-gray-500 mb-2">
              {farm.city} - {farm.state}
            </p>
          )}
        </div>

        <div className="text-sm text-gray-700 mb-2">
          {["totalArea", "arableArea", "vegetationArea"].map((field) => (
            <p key={field}>
              <strong>
                {field === "totalArea"
                  ? "Área Total:"
                  : field === "arableArea"
                  ? "Área Agricultável:"
                  : "Área de Vegetação:"}
              </strong>{" "}
              {isEditing ? (
                <input
                  type="number"
                  value={editedFarm[field as keyof Farm]?.toString() || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d*\.?\d*$/.test(val)) {
                      handleChange(
                        field as keyof Farm,
                        val === "" ? "" : Number(val)
                      );
                    }
                  }}
                  className="border px-2 rounded-md w-24"
                />
              ) : (
                `${farm[field as keyof Farm]} ha`
              )}
            </p>
          ))}
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-1">Safras:</h4>
          {farm.cropSeasons?.map((season) => (
            <div key={season.id} className="mb-2">
              <p className="text-sm font-medium text-green-600">
                {season.year}
              </p>
              <ul className="flex flex-wrap gap-2 mt-1">
                {season.plantedCrops?.map((crop) => (
                  <li
                    key={crop.id}
                    className="bg-green-100 text-green-800 px-2 py-1 text-xs rounded-full"
                  >
                    {crop.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
