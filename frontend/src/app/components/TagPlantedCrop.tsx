import { X } from "lucide-react"

type PlantedCropProps = {
    crop: string;
    year: string;
}
export const TagPlantedCrop = ({crop, year}: PlantedCropProps) => {
    return(
        <div className="bg-green-400/20 py-2 rounded-xl flex mt-3 justify-between ">
            <p className="mx-3">{crop} (<span>{year}</span>)</p>
            <button className="mr-4">
                 <X size={18} />
            </button>
           
        </div>
    )
}