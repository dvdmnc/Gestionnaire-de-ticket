"use client";

import { Card, CardContent } from "@/components/ui/card";
import {Dialog, DialogContent, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface MovieDetailsProps {
    id: number;
    title: string;
    poster: string;
    year: number;
    genre: string;
    open:boolean;
    setOpen: (open: boolean) => void;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({setOpen, open, id, title, poster, year, genre }) => {
    return (
        <Dialog onOpenChange={(isOpen) => setOpen(isOpen)}>


        <DialogTrigger asChild>
            <Button className={"bg-amber-50 text-black"}>View Details</Button>
        </DialogTrigger>


            <DialogContent className="bg-gray-900 text-white p-6 rounded-lg w-3/4 max-w-none h-[90%] max-h-none">
            <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
        <Card className="w-full bg-gray-800 ">
        <CardContent className="flex flex-col items-center text-center">
        <Image
            src={poster}
        alt={title}
        width={300}
        height={450}
        className="rounded-lg shadow-md"
        />
        <h1 className="text-2xl font-bold mt-4">{title}</h1>
            <p className="text-gray-400 text-sm mt-1">{year} • {genre}</p>
        <Button className="mt-4" variant="secondary">
            Watch Trailer
        </Button>
        </CardContent>
        </Card>
        </DialogContent>
    </Dialog>
);
};

export default MovieDetails;
