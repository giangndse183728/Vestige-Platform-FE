'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}

export function LoginModal({ 
  open, 
  onOpenChange, 
  title = "Login Required",
  description = "You need to be logged in to subscribe to a membership plan. Please login or create an account to continue."
}: LoginModalProps) {
  const router = useRouter();

  const handleLogin = () => {
    onOpenChange(false);
    router.push('/login');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <DialogHeader className="text-center space-y-4">
         
          <DialogTitle className="font-metal text-xl">{title}</DialogTitle>
          <DialogDescription className="font-gothic text-gray-600">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 mt-6">
          <Button 
            onClick={handleLogin}
            className="w-full font-gothic py-6 text-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-red-600 hover:bg-red-700 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300"
          >
            <LogIn className="w-5 h-5 mr-2" />
            LOGIN TO CONTINUE
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full font-gothic border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300"
          >
            CANCEL
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 