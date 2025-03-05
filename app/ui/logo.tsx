import { ZenLogoProps } from "../lib/definitions";
import Image from "next/image";

export default function ZenLogo({ width, height }: ZenLogoProps) {
    return (
        <Image
            src="/Zen-LMS_Logo.svg"
            width={width}
            height={height}
            alt="Zen LMS Logo"
        />
    );
}