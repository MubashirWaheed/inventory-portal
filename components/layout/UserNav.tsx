"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { UserAvatar } from "@/components/layout/UserAvatar";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

type Props = {
  name: string | undefined | null;
  email: string | undefined;
};

export function UserNav({ name = "", email = "" }: Props) {
  const { signOut } = useClerk();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          user={{ name: name || null, image: null }}
          className="h-8 w-8 cursor-pointer"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-4 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {name && <p className="font-medium">{name}</p>}
            {email && (
              <p className="w-[200px] truncate text-sm text-zinc-700">
                {email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Button
            variant="outline"
            className="w-full cursor-pointer"
            onClick={() => {
              signOut(() => {
                router.refresh();
                router.push("/sign-in");
              });
            }}
          >
            <LogOut
              className="cursor-pointer mr-2 h-4 w-4"
              aria-hidden="true"
            />
            Log Out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
