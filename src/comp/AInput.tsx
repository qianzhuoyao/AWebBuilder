import { extendVariants, Input } from "@nextui-org/react";

export const AInput = extendVariants(Input, {
  variants: {
    // <- modify/add variants
    color: {
      stone: {
        // <- add a new color variant
        inputWrapper: [
          // <- Input wrapper slot
          "bg-zinc-100",
          "border",
          "shadow",
          "transition-colors",
          "focus-within:bg-zinc-100",
          "data-[hover=true]:border-zinc-600",
          "data-[hover=true]:bg-zinc-100",
          "group-data-[focus=true]:border-zinc-600",
          // dark theme
          "dark:bg-zinc-900",
          "dark:border-zinc-800",
          "dark:data-[hover=true]:bg-zinc-900",
          "dark:focus-within:bg-zinc-900",
        ],
        input: [
          // <- Input element slot
          "text-zinc-800",
          "placeholder:text-zinc-600",
          // dark theme
          "dark:text-zinc-400",
          "dark:placeholder:text-zinc-600",
        ],
      },
    },
    size: {
      xxs: {
        inputWrapper: "h-unit-7 min-h-unit-7 px-1",
        input: "text-tiny",
      },
    
      xs: {
        inputWrapper: "h-unit-8 min-h-unit-8 px-1",
        input: "text-tiny",
      },
      sml: {
        inputWrapper: "h-unit-9 min-h-unit-9 px-1",
        input: "text-tiny",
      },
      md: {
        inputWrapper: "h-unit-10 min-h-unit-10",
        input: "text-small",
      },
      xl: {
        inputWrapper: "h-unit-14 min-h-unit-14",
        input: "text-medium",
      },
    },
    radius: {
      //   xs: {
      //     inputWrapper: "rounded-[1px]",
      //   },
      sm: {
        inputWrapper: "rounded-[4px]",
      },
    },
    textSize: {
      base: {
        input: "text-base",
      },
    },
    removeLabel: {
      true: {
        label: "hidden",
      },
      false: {},
    },
  },
  defaultVariants: {
    textSize: "base",
    removeLabel: true,
  },
});
