import { SVGProps, forwardRef, CSSProperties } from "react";

// The docs say frameColor/bezelColor accept "any valid CSS color", but the
// stock component interpolates them into Tailwind classes (fill-${color}) that
// the compiler never generates. Resolve both forms to a paintable value:
// Tailwind tokens like "neutral-100" map to Tailwind v4 theme CSS variables,
// anything else ("white", "#1c1c1e", "rgb(...)") passes through as-is.
function svgColor(value: string): string {
  // Fallback: Tailwind v4 only emits theme vars referenced by compiled
  // classes, so an unused token's var() resolves to nothing — paint a light
  // neutral instead of an invisible frame.
  return /^[a-z]+-\d{2,3}$/.test(value) ? `var(--color-${value}, #e5e5e5)` : value;
}

export interface Iphone16ProProps extends SVGProps<SVGSVGElement> {
    /** Frame width */
    width?: number;
    /** Frame height */
    height?: number;
    /** Image source for screen */
    src?: string;
    /** Video source for screen */
    videoSrc?: string;
    /** Show dynamic island */
    showIsland?: boolean;
    /** Island width */
    islandWidth?: number;
    /** Island height */
    islandHeight?: number;
    /** Frame color (light mode) */
    frameColor?: string;
    /** Frame color (dark mode) */
    frameDarkColor?: string;
    /** Bezel color */
    bezelColor?: string;
    /** Screen border radius */
    screenRadius?: number;
    /** Shadow toggle */
    shadow?: boolean;
    /** Rounded corners toggle */
    rounded?: boolean;
    /** Class for inner content (video/image) */
    contentClassName?: string;
    /** Custom styles for video/image */
    contentStyle?: CSSProperties;
    /** Toggle camera dot */
    showCamera?: boolean;
    /** Background gradient for screen */
    screenGradient?: string;
    /** Enable animation on hover */
    hoverAnimation?: boolean;
    /** Push the screen image down (SVG units) — for screenshots whose content
     * starts at the very top and would hide under the dynamic island. */
    contentInsetTop?: number;
    /** Screen fill behind the image; visible in the inset gap. */
    screenBackground?: string;
}

export const Iphone16Pro = forwardRef<SVGSVGElement, Iphone16ProProps>(
    (
        {
            width = 433,
            height = 882,
            src,
            videoSrc,
            showIsland = true,
            islandWidth = 125,
            islandHeight = 40,
            frameColor = "white",
            frameDarkColor = "black",
            bezelColor = "neutral-100",
            screenRadius = 55,
            shadow = true,
            rounded = true,
            contentClassName,
            contentStyle,
            showCamera = true,
            screenGradient,
            hoverAnimation = true,
            contentInsetTop = 0,
            screenBackground = "#ffffff",
            ...props
        }: Iphone16ProProps,
        ref
    ) => {
        return (
            <svg
                ref={ref}
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`
          ${shadow ? "drop-shadow-2xl" : ""}
          ${hoverAnimation ? "transition-transform duration-500 hover:scale-[1.02]" : ""}
        `}
                {...props}
            >
                {/* Outer frame */}
                <rect
                    x="2"
                    y="2"
                    width={width - 4}
                    height={height - 4}
                    rx={rounded ? 75 : 0}
                    fill={svgColor(frameColor)}
                    className="stroke-gray-200 dark:stroke-white/20"
                    strokeWidth="2"
                />

                {/* Inner bezel */}
                <rect
                    x="20"
                    y="20"
                    width={width - 40}
                    height={height - 40}
                    rx={rounded ? 56 : 0}
                    fill={svgColor(bezelColor)}
                    className="stroke-neutral-300/40 dark:stroke-neutral-700/50"
                />

                {/* Screen area */}
                <clipPath id="screen">
                    <rect
                        x="21"
                        y="21"
                        width={width - 42}
                        height={height - 42}
                        rx={screenRadius}
                        ry={screenRadius}
                    />
                </clipPath>

                {screenGradient && (
                    <rect
                        x="21"
                        y="21"
                        width={width - 42}
                        height={height - 42}
                        rx={screenRadius}
                        ry={screenRadius}
                        fill={`url(#gradient)`}
                        clipPath="url(#screen)"
                    />
                )}

                {src && (
                    <>
                        {/* Screen fill — shows through the contentInsetTop gap */}
                        <rect
                            x="21"
                            y="21"
                            width={width - 42}
                            height={height - 42}
                            rx={screenRadius}
                            ry={screenRadius}
                            fill={screenBackground}
                            clipPath="url(#screen)"
                        />
                        <image
                            href={src}
                            x="21"
                            y={21 + contentInsetTop}
                            width={width - 42}
                            height={height - 42 - contentInsetTop}
                            preserveAspectRatio="xMidYMid slice"
                            clipPath="url(#screen)"
                            className={contentClassName}
                            style={contentStyle}
                        />
                    </>
                )}

                {videoSrc && (
                    <foreignObject
                        x="21"
                        y="21"
                        width={width - 42}
                        height={height - 42}
                        clipPath="url(#screen)"
                    >
                        <video
                            className={`w-full h-full object-cover rounded-[${screenRadius}px] ${contentClassName}`}
                            src={videoSrc}
                            autoPlay
                            loop
                            muted
                            playsInline
                            style={contentStyle}
                        />
                    </foreignObject>
                )}

                {/* Dynamic island */}
                {showIsland && (
                    <rect
                        x={width / 2 - islandWidth / 2}
                        y="28"
                        width={islandWidth}
                        height={islandHeight}
                        rx={20}
                        fill="#0a0a0a"
                    />
                )}

                {/* Camera dot */}
                {showCamera && (
                    <circle
                        cx={width / 2 + islandWidth / 4}
                        cy="48"
                        r="6"
                        className="fill-neutral-400 dark:fill-neutral-600"
                    />
                )}

                {/* Optional gradient definition */}
                {screenGradient && (
                    <defs>
                        <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor={screenGradient.split(",")[0]} />
                            <stop offset="100%" stopColor={screenGradient.split(",")[1] || screenGradient.split(",")[0]} />
                        </linearGradient>
                    </defs>
                )}
            </svg>
        );
    }
);

Iphone16Pro.displayName = "Iphone16Pro";
