import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { ALL_STOPS } from "@/lib/route-finder";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

type Props = {
  label: string;
  placeholder: string;
  value: string | undefined;
  onChange: (stop: string) => void;
  tone: "cyan" | "pink";
};

export function StopPicker({ label, placeholder, value, onChange, tone }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-label={label}
          className={cn(
            "group flex w-full items-center gap-4 rounded-xl border border-border bg-background/60 px-4 py-3 text-left transition-all",
            "focus-visible:outline-none",
            tone === "cyan"
              ? "hover:border-neon-cyan focus-visible:glow-cyan data-[state=open]:glow-cyan"
              : "hover:border-neon-pink focus-visible:glow-pink data-[state=open]:glow-pink",
          )}
        >
          <span
            className={cn(
              "size-3 shrink-0 rounded-full",
              tone === "cyan" ? "bg-neon-cyan glow-cyan" : "bg-neon-pink glow-pink",
            )}
          />
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {label}
            </span>
            <span
              className={cn(
                "truncate text-lg font-semibold",
                value ? "text-foreground" : "text-muted-foreground/70",
              )}
            >
              {value ?? placeholder}
            </span>
          </span>
          <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) min-w-72 border-border p-0 glow-soft"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Type an area, e.g. Farmgate" className="h-12 text-base" />
          <CommandList className="max-h-72">
            <CommandEmpty>No stop with that name.</CommandEmpty>
            <CommandGroup>
              {ALL_STOPS.map((stop) => (
                <CommandItem
                  key={stop}
                  value={stop}
                  onSelect={() => {
                    onChange(stop);
                    setOpen(false);
                  }}
                  className="py-2.5"
                >
                  <Check className={cn("text-primary", value === stop ? "opacity-100" : "opacity-0")} />
                  {stop}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
