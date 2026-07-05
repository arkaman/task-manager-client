import { Outlet } from "react-router-dom";
import PixelBlast from "@/components/PixelBlast";

export default function AuthLayout() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <Outlet />
                    </div>
                </div>
            </div>

            <div className="relative hidden overflow-hidden bg-muted lg:block">
                <div className="absolute inset-0">
                    <PixelBlast
                        variant="square"
                        pixelSize={4}
                        color="#1447e6"
                        patternScale={2}
                        patternDensity={1}
                        enableRipples
                        rippleSpeed={0.3}
                        rippleThickness={0.1}
                        rippleIntensityScale={1}
                        speed={0.5}
                        transparent = {false}
                        edgeFade={0}
                    />
                </div>
            </div>
        </div>
    );
}