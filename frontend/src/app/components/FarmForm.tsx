"use client";
import { MapPin, Plus, Wheat } from "lucide-react";
import { TagCropSeason } from "./TagCropSeason";
import { TagPlantedCrop } from "./TagPlantedCrop";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect } from "react";
import { Farm } from "./FarmCard";

const farmSchema = yup
  .object({
    name: yup.string().required("Nome da fazenda é obrigatório"),
    city: yup.string().required("Cidade é obrigatória"),
    state: yup.string().required("Estado é obrigatório"),
    totalArea: yup
      .number()
      .typeError("Área total deve ser um número")
      .positive("A área total deve ser positiva")
      .required("Área total é obrigatória"),
    arableArea: yup
      .number()
      .typeError("Área agricultável deve ser um número")
      .min(0, "Valor mínimo é 0")
      .required("Área agricultável é obrigatória"),
    vegetationArea: yup
      .number()
      .typeError("Área de vegetação deve ser um número")
      .min(0, "Valor mínimo é 0")
      .required("Área de vegetação é obrigatória"),
  })
  .test(
    "soma-das-areas",
    "A soma das áreas agricultável e de vegetação não pode exceder a área total",
    (values) => {
      if (!values) return true;
      const { totalArea = 0, arableArea = 0, vegetationArea = 0 } = values;
      return arableArea + vegetationArea <= totalArea;
    }
  );

type FormData = yup.InferType<typeof farmSchema>;

export type CropSeasonState = {
  year: string;
  crops: string[];
};



export const FarmForm = ({onSuccess}: {onSuccess?: (newFarm: Farm) => void }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<FormData>({
    resolver: yupResolver(farmSchema),
  });

  useEffect(() => {
  if (isSubmitSuccessful) {
    reset(); 
    setCropSeasons([]); 
    setNewSeason("");
    setNewPlantedCrop("");
    setSelectedSeason("");
  }
}, [isSubmitSuccessful, reset]);

  const [cropSeasons, setCropSeasons] = useState<CropSeasonState[]>([]);
  const [newSeason, setNewSeason] = useState("");
  const [newPlantedCrop, setNewPlantedCrop] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("");

  const handleAddSeason = () => {
    if (!newSeason || cropSeasons.find((s) => s.year === newSeason)) return;
    setCropSeasons((prev) => [...prev, { year: newSeason, crops: [] }]);
    setNewSeason("");
  };

  const handleAddPlantedCrop = () => {
    if (!selectedSeason || !newPlantedCrop) return;
    setCropSeasons((prev) =>
      prev.map((season) =>
        season.year === selectedSeason
          ? {
              ...season,
              crops: [...new Set([...season.crops, newPlantedCrop])],
            }
          : season
      )
    );
    setNewPlantedCrop("");
  };

  const handleSubmitFarm = async (data: FormData) => {
    if (cropSeasons.length === 0) {
      alert("Adicione pelo menos uma safra");
      return;
    }
    
    const finalData = {
      ...data,
      cropSeasons: cropSeasons.map((season) => ({
        year: Number(season.year),
        plantedCrops: season.crops.map((crop) => ({
          name: crop,
        })),
      })),
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3003/farm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(finalData),
      });

      const newFarm = await res.json();

      if (!res.ok) {
        throw new Error(newFarm.message || "Erro ao cadastrar fazenda");
      }

      console.log("Fazenda cadastrada com sucesso:", newFarm);
      onSuccess?.(newFarm);

     
      setCropSeasons([])

    } catch (error) {
      alert("Erro ao cadastrar fazenda");
      console.error(error);
    }
  };

  const handleRemoveSeason = (yearToRemove: string) => {
    setCropSeasons((prev) =>
      prev.filter((season) => season.year !== yearToRemove)
    );
  };


  const handleRemovePlantedCrop = (year: string, cropToRemove: string) => {
    setCropSeasons((prev) =>
      prev.map((season) =>
        season.year === year
          ? {
              ...season,
              crops: season.crops.filter((crop) => crop !== cropToRemove),
            }
          : season
      )
    );
  };

  return (
    //Dados da propriedade e localização
    <div className="p-6 max-w-2xl mx-auto bg-gray-100 rounded-2xl mb-5">
      <h1 className="text-3xl font-semibold mb-4 text-center">
        Cadastrar Fazenda
      </h1>
      <form onSubmit={handleSubmit(handleSubmitFarm)} className="">
        <div className="bg-white p-5 rounded-2xl">
          <div className="">
            <MapPin className="text-green-700" />
            <h2 className="text-2xl">Informações da propriedade</h2>
            <p className="pb-4 text-sm text-gray-500">
              Dados básicos da fazenda e localização
            </p>
          </div>

          <div className="flex justify-between">
            <div className="w-[48%]">
              <label className="text-sm font-medium">Nome da Fazenda</label>
              <input
                type="text"
                {...register("name")}
                placeholder="Digite o nome da propriedade"
                className="mt-1 w-full px-4 py-2 border rounded-xl shadow-sm"
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="w-[48%]">
              <label className="text-sm font-medium">Cidade</label>
              <input
                type="text"
                {...register("city")}
                placeholder="Digite a cidade"
                className="mt-1 w-full px-4 py-2 border rounded-xl shadow-sm"
              />
              {errors.city && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.city.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Estado</label>
            <select
              {...register("state")}
              className="w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring"
              defaultValue=""
            >
              <option disabled value="">
                Selecione o Estado
              </option>
              <option value="AC">Acre (AC)</option>
              <option value="AL">Alagoas (AL)</option>
              <option value="AP">Amapá (AP)</option>
              <option value="AM">Amazonas (AM)</option>
              <option value="BA">Bahia (BA)</option>
              <option value="CE">Ceará (CE)</option>
              <option value="DF">Distrito Federal (DF)</option>
              <option value="ES">Espírito Santo (ES)</option>
              <option value="GO">Goiás (GO)</option>
              <option value="MA">Maranhão (MA)</option>
              <option value="MT">Mato Grosso (MT)</option>
              <option value="MS">Mato Grosso do Sul (MS)</option>
              <option value="MG">Minas Gerais (MG)</option>
              <option value="PA">Pará (PA)</option>
              <option value="PB">Paraíba (PB)</option>
              <option value="PR">Paraná (PR)</option>
              <option value="PE">Pernambuco (PE)</option>
              <option value="PI">Piauí (PI)</option>
              <option value="RJ">Rio de Janeiro (RJ)</option>
              <option value="RN">Rio Grande do Norte (RN)</option>
              <option value="RS">Rio Grande do Sul (RS)</option>
              <option value="RO">Rondônia (RO)</option>
              <option value="RR">Roraima (RR)</option>
              <option value="SC">Santa Catarina (SC)</option>
              <option value="SP">São Paulo (SP)</option>
              <option value="SE">Sergipe (SE)</option>
              <option value="TO">Tocantins (TO)</option>
            </select>
          </div>
          {errors.state && (
            <p className="text-sm text-red-500 mt-1">{errors.state.message}</p>
          )}
        </div>

        {/* Áreas da fazenda */}
        <div className="bg-white p-5 rounded-2xl mt-3">
          <h2 className="text-2xl">Áreas da Propriedade</h2>
          <p className="pb-4 text-sm text-gray-500">
            Informe as áreas em hectares
          </p>
          <div className="md:flex gap-3">
            <div>
              <label className="text-sm font-medium">Área Total (ha)</label>
              <input
                type="number"
                {...register("totalArea")}
                placeholder="250000"
                className="mt-1 w-full px-4 py-2 border rounded-xl shadow-sm"
              />
              {errors.totalArea && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.totalArea.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">
                Área Agricultável (ha)
              </label>
              <input
                type="number"
                {...register("arableArea")}
                placeholder="150000"
                className="mt-1 w-full px-4 py-2 border rounded-xl shadow-sm"
              />
              {errors.arableArea && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.arableArea.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">
                Área de Vegetação (ha)
              </label>
              <input
                type="number"
                {...register("vegetationArea")}
                placeholder="50000"
                className="mt-1 w-full px-4 py-2 border rounded-xl shadow-sm"
              />
              {errors.vegetationArea && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.vegetationArea.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Safras */}

        <div className="bg-white rounded-2xl mt-3 p-5 pb-12">
          <Wheat className="text-green-700" />
          <h2 className="text-2xl">Safras</h2>
          <p className="pb-4 text-sm text-gray-500">
            Adicione as safras da sua propriedade
          </p>
          <div className="flex gap-3">
            <input
              type="number"
              value={newSeason}
              onChange={(e) => setNewSeason(e.target.value)}
              placeholder="Ex: 2024"
              className="mt-1 w-[95%] px-4 py-2 border rounded-xl shadow-sm"
            />
            <button
              type="button"
              onClick={handleAddSeason}
              className="bg-gray-300/40 px-3 rounded-xl"
            >
              <Plus />
            </button>
          </div>

          <div className="flex gap-3">
            {cropSeasons.map((season) => (
              <TagCropSeason
                key={season.year}
                year={season.year}
                onRemove={() => handleRemoveSeason(season.year)}
              />
            ))}
          </div>
        </div>

        {/* Culturas plantadas */}
        <div className="bg-white p-5 rounded-2xl mt-3 ">
          <h2 className="text-2xl">Culturas Plantadas</h2>
          <p className="pb-4 text-sm text-gray-500">
            Associe culturas às safras
          </p>
          <div className="flex flex-col lg:flex-row">
            {cropSeasons.length > 0 ? (
              <>
                <div className="w-full flex items-center gap-8">
                  <select
                    className="px-4 py-2 border rounded-xl shadow-sm w-[60%]"
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(e.target.value)}
                  >
                    <option value="" disabled>
                      Selecione a safra
                    </option>
                    {cropSeasons.map((s) => (
                      <option key={s.year} value={s.year}>
                        {s.year}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={newPlantedCrop}
                    onChange={(e) => setNewPlantedCrop(e.target.value)}
                    placeholder="Ex: Milho, Soja"
                    className="mt-1 px-4 py-2 border rounded-xl shadow-sm w-[60%]"
                  />
                </div>
                <div className="flex items-center mt-3 lg:ml-8">
                  <button
                    type="button"
                    onClick={handleAddPlantedCrop}
                    className="px-8  bg-gray-300/30 py-2 rounded-xl font-semibold"
                  >
                    Adicionar
                  </button>
                </div>
              </>
            ) : (
              <div className="my-4">
                <p className="text-sm text-gray-500 text-center ">
                  Adicione safras primeiro para poder cadastrar culturas
                </p>
              </div>
            )}
          </div>
          {cropSeasons.map((season) =>
            season.crops.map((crop) => (
              <TagPlantedCrop
                key={`${crop}-${season.year}`}
                crop={crop}
                year={season.year}
                onRemove={() => handleRemovePlantedCrop(season.year, crop)}
              />
            ))
          )}
        </div>
        <div className="mt-3 justify-self-end">
          <button className="font-semibold py-2 px-4 rounded-xl bg-gray-200 mx-5">
            {" "}
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl"
          >
            Cadastrar Fazenda
          </button>
        </div>
      </form>
    </div>
  );
};
