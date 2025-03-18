"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface MovieDetailsProps {
    id: number;
    title: string;
    poster: string;
    year: number;
    genre: string;
    open: boolean;
    setOpen: (open: boolean) => void;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ setOpen, open, id, title, poster, year, genre }) => {
    return (
        <Dialog onOpenChange={(isOpen) => setOpen(isOpen)}>
            <DialogTrigger asChild>
                <Button className="bg-amber-500 text-black hover:bg-amber-600 transition-all duration-300 px-4 py-2 rounded-lg shadow-md font-semibold">
                    View Details
                </Button>
            </DialogTrigger>

            <DialogContent className="bg-gray-900 text-white p-8 rounded-xl w-full max-w-2xl h-auto max-h-[90vh] overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <DialogTitle className="text-3xl font-bold text-amber-400 text-center mb-4">
                        {title}
                    </DialogTitle>
                    <Card className="w-full bg-gray-800 rounded-lg shadow-lg p-4">
                        <CardContent className="flex flex-col items-center text-center">
                            <Image
                                src={poster}
                                alt={title}
                                width={320}
                                height={480}
                                className="rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                            />
                            <h1 className="text-2xl font-bold mt-4 text-white">{title}</h1>
                            <p className="text-gray-400 text-sm mt-1">{year} • {genre}</p>
                            <Button className="mt-5 bg-amber-500 hover:bg-amber-600 transition-all duration-300 text-black font-semibold px-6 py-2 rounded-lg shadow-md">
                                Watch Trailer
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
};

export default MovieDetails;
