import { ComponentType } from "react"

type CardsProps = {
    icon: ComponentType<{size?: number, className: string}>;
    title: string;
    text: string;
}

export const Card = ({icon: Icon, title, text}: CardsProps) => {
    return(
        <div className="w-md bg-white p-4 rounded-md">
         <div className="flex flex-col justify-center items-center">
            <div className="bg-gray-300/50 p-3 rounded-full mb-3">
        <Icon size={30} className="text-green-700" />
            </div>
            <h2 className="font-bold text-xl mb-2">{title}</h2>
            <p className="text-center">{text}</p>
         </div>
        </div>
    )
}