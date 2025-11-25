'use client';

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import { UkFlagIcon } from "@/components/uk-flag";
import { VietnamFlagIcon } from "@/components/vietnam-flag";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";

type TranslateFn = (key: string) => string;
type Language = "en" | "vi";

interface ChatHeaderProps {
  department: string;
  language: Language;
  setLanguage: (language: Language) => void;
  t: TranslateFn;
  useInternalData: boolean;
  setUseInternalData: (value: boolean) => void;
  usePersonalData: boolean;
  setUsePersonalData: (value: boolean) => void;
  sidebarOpen: boolean;
}

export function ChatHeader({
  department,
  language,
  setLanguage,
  t,
  useInternalData,
  setUseInternalData,
  usePersonalData,
  setUsePersonalData,
  sidebarOpen,
}: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-card shadow-sm">
      <div className="flex items-center gap-2">
        <div className={cn(sidebarOpen && "md:hidden")}>
          <SidebarTrigger />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-10 w-10">
          <Logo />
        </div>
        <div>
          <h1 className="text-xl font-semibold">ChatSNP</h1>
          <p className="text-sm text-muted-foreground">{department}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-12 w-12">
              {language === "en" ? (
                <UkFlagIcon className="h-8 w-8" />
              ) : (
                <VietnamFlagIcon className="h-8 w-8" />
              )}
              <span className="sr-only">{t("languageSwitcherTooltip")}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setLanguage("en")} disabled={language === "en"}>
              <UkFlagIcon className="mr-2 h-5 w-5" />
              {t("english")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("vi")} disabled={language === "vi"}>
              <VietnamFlagIcon className="mr-2 h-5 w-5" />
              {t("vietnamese")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings />
              <span className="sr-only">{t("settings")}</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{t("settings")}</SheetTitle>
            </SheetHeader>
            <div className="py-4 space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="internal-data" className="flex-1">
                  {t("internalData")}
                </Label>
                <Switch
                  id="internal-data"
                  checked={useInternalData}
                  onCheckedChange={setUseInternalData}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="personal-data" className="flex-1">
                  {t("personalData")}
                </Label>
                <Switch
                  id="personal-data"
                  checked={usePersonalData}
                  onCheckedChange={setUsePersonalData}
                />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
