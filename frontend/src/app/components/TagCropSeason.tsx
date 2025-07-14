import { X } from "lucide-react";

export type CropSeasonProps = {
  year: string;
  crops: string[];
};

export const TagCropSeason = ({year}:{ year: string}) => {
  return (
    <div className="text-black text-sm flex justify-center gap-8 items-center bg-green-400/20 w-26  mt-2  rounded-2xl ">
      <p>{year}</p>
      <button className="">
        <X size={14} />
      </button>
    </div>
  );
};
